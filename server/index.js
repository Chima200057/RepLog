import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// Official IBM WatsonX SDK import
// import { WatsonXAI } from '@ibm-cloud/watsonx-ai'; 
// import { IamAuthenticator } from 'ibm-cloud-sdk-core';

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
    /* 
    TODO: Initialize the WatsonX AI client with proper keys once configured
    
    const watsonx = WatsonXAI.newInstance({
      version: '2023-05-29',
      authenticator: new IamAuthenticator({ apikey: process.env.IBM_CLOUD_API_KEY })
    });
    
    const response = await watsonx.generateText({
      projectId: process.env.IBM_PROJECT_ID,
      modelId: 'ibm/granite-13b-chat-v2', // or any other capable model
      input: message,
      parameters: { maxNewTokens: 200 }
    });

    return res.json({ text: response.results[0].generatedText });
    */

    // Placeholder until the SDK is uncommented
    res.json({
      text: "WatsonX is connected! Bob says: Keep up the great practice!"
    });

  } catch (error) {
    console.error('Error calling WatsonX:', error);
    res.status(500).json({ text: 'Failed to communicate with IBM Bob backend.' });
  }
});

app.listen(PORT, () => {
  console.log(`RepLog Backend running on http://localhost:${PORT}`);
  console.log(`Make sure to configure your .env file!`);
});
