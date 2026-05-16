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
  const { message } = req.body;

  // 1. Check if user configured IBM Cloud credentials
  if (!process.env.IBM_CLOUD_API_KEY || !process.env.IBM_PROJECT_ID) {
    return res.json({
      text: "[MOCK RESPONSE] You said: '" + message + "'. Please configure your .env file with IBM_CLOUD_API_KEY and IBM_PROJECT_ID so I can connect to watsonx.ai and give you real coaching advice!"
    });
  }

  // 2. Setup WatsonX API interaction
  try {
    const watsonx = WatsonXAI.newInstance({
      version: '2023-05-29',
      authenticator: new IamAuthenticator({ apikey: process.env.IBM_CLOUD_API_KEY })
    });
    
    // Construct prompt using official Granite 3 tags for better separation
    const promptText = `<|system|>
You are IBM Bob, a supportive, intelligent, and highly analytical AI practice coach. 
Analyze the user's practice log and provide brief, encouraging, coaching-style feedback to help them improve.
Use relevant emojis to make your responses more friendly and engaging.
<|user|>
Practice Log: ${message}
<|assistant|>
Bob's Feedback:`;

    const response = await watsonx.generateText({
      projectId: process.env.IBM_PROJECT_ID,
      modelId: 'ibm/granite-3-8b-instruct', 
      input: promptText,
      parameters: { 
        max_new_tokens: 400,
        stop_sequences: ['Practice Log:', 'User:'] 
      }
    });

    let text = response.result.results[0].generated_text;
    
    // Comprehensive cleanup logic
    const stopSequences = [
      'Practice Log:', 
      'User:', 
      "Bob's Feedback:", 
      'Analyze the user\'s', 
      '<|system|>', 
      '<|user|>', 
      '<|assistant|>'
    ];
    
    stopSequences.forEach(seq => {
      const index = text.indexOf(seq);
      if (index !== -1) {
        text = text.substring(0, index);
      }
    });

    res.json({ text: text.trim() });

  } catch (error) {
    console.error('Error calling WatsonX:', error.message);
    
    // Fallback Mock Mode for Hackathon resilience
    if (error.message && error.message.includes('invalid credentials')) {
      return res.json({ 
        text: `[Fallback Mode: IBM Cloud is still processing your API Key] Your log looks great! Keep focusing on those chord transitions. Practicing the G to C pivot for 5 minutes daily will build the muscle memory you need!`
      });
    }

    res.status(500).json({ text: 'Failed to communicate with IBM Bob backend.' });
  }
});

app.listen(PORT, () => {
  console.log(`RepLog Backend running on http://localhost:${PORT}`);
  console.log(`Make sure to configure your .env file!`);
});
