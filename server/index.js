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
    
    // Construct prompt
    const promptText = `You are IBM Bob, a supportive, intelligent, and highly analytical AI practice coach. 
Analyze the user's practice log and provide brief, encouraging, coaching-style feedback to help them improve.

Practice Log: ${message}
Bob's Feedback:`;

    const response = await watsonx.generateText({
      projectId: process.env.IBM_PROJECT_ID,
      modelId: 'ibm/granite-13b-chat-v2', 
      input: promptText,
      parameters: { max_new_tokens: 200 }
    });

    res.json({ text: response.result.results[0].generated_text });

  } catch (error) {
    console.error('Error calling WatsonX:', error);
    res.status(500).json({ text: 'Failed to communicate with IBM Bob backend.' });
  }
});

app.listen(PORT, () => {
  console.log(`RepLog Backend running on http://localhost:${PORT}`);
  console.log(`Make sure to configure your .env file!`);
});
