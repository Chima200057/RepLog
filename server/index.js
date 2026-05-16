import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { WatsonXAI } from '@ibm-cloud/watsonx-ai'; 
import { IamAuthenticator } from 'ibm-cloud-sdk-core';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.post('/api/chat', async (req, res) => {
  const { message, history = [] } = req.body;

  if (!process.env.IBM_CLOUD_API_KEY || !process.env.IBM_PROJECT_ID) {
    return res.json({
      text: "[MOCK RESPONSE] You said: '" + message + "'. Please configure your .env file with IBM_CLOUD_API_KEY and IBM_PROJECT_ID so I can connect to watsonx.ai!",
      title: "Bob's Feedback"
    });
  }

  try {
    const watsonx = WatsonXAI.newInstance({
      version: '2023-05-29',
      authenticator: new IamAuthenticator({ apikey: process.env.IBM_CLOUD_API_KEY })
    });
    
    let conversationContext = history.map(h => 
      h.role === 'user' ? `<|user|>\n${h.text}` : `<|assistant|>\n${h.text}`
    ).join('\n');

    const promptText = `<|system|>
You are IBM Bob, a supportive, intelligent, and highly analytical AI practice coach. 
Analyze the user's practice log and provide structured coaching feedback using Markdown.

STYLE & FORMATTING RULES:
- Use Markdown headers starting with '### ' (e.g., ### Training Strategy) for main sections.
- Use bullet points starting with '- ' for specific tips.
- Use bold text sparingly and ALWAYS close the tags: **bold text**.
- Use 3-4 friendly and relevant emojis across the response to be user-friendly.
- Ensure double line breaks between paragraphs for clarity.

IMPORTANT: Return your response ONLY in this JSON format:
{
  "title": "A short 2-4 word summary",
  "text": "Your markdown-formatted advice with proper spacing and emojis"
}

${conversationContext}
<|user|>
Practice Log: ${message}
<|assistant|>`;

    const response = await watsonx.generateText({
      projectId: process.env.IBM_PROJECT_ID,
      modelId: 'ibm/granite-3-8b-instruct', 
      input: promptText,
      parameters: { 
        max_new_tokens: 500,
        stop_sequences: ['<|user|>', '<|system|>'] 
      }
    });

    let rawText = response.result.results[0].generated_text.trim();
    let parsed = { text: rawText, title: "Bob's Advice" };

    // Robust JSON search
    const startBracket = rawText.indexOf('{');
    const endBracket = rawText.lastIndexOf('}');
    
    if (startBracket !== -1 && endBracket !== -1 && endBracket > startBracket) {
      try {
        const potentialJson = rawText.substring(startBracket, endBracket + 1);
        const jsonData = JSON.parse(potentialJson);
        if (jsonData.text) {
          parsed = {
            text: jsonData.text,
            title: jsonData.title || "Bob's Advice"
          };
        }
      } catch (e) {
        console.warn("JSON block found but invalid, using raw text cleanup.");
      }
    }

    // Cleanup logic if fallback is used
    if (parsed.text === rawText) {
      const stopSequences = ['User:', "Bob's Feedback:", 'Analyze the user\'s', '<|system|>', '<|user|>', '<|assistant|>'];
      stopSequences.forEach(seq => {
        const index = parsed.text.indexOf(seq);
        if (index !== -1) parsed.text = parsed.text.substring(0, index).trim();
      });
    }

    res.json(parsed);

  } catch (error) {
    console.error('Error calling WatsonX:', error.message);
    res.status(500).json({ text: 'Failed to communicate with IBM Bob backend.' });
  }
});

app.listen(PORT, () => {
  console.log(`RepLog Backend running on http://localhost:${PORT}`);
});
