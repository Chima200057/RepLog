import { WatsonXAI } from '@ibm-cloud/watsonx-ai';
import { IamAuthenticator } from 'ibm-cloud-sdk-core';
import dotenv from 'dotenv';
dotenv.config();

async function testWatson() {
  try {
    const watsonx = WatsonXAI.newInstance({
      version: '2023-05-29',
      authenticator: new IamAuthenticator({ apikey: process.env.IBM_CLOUD_API_KEY }),
      serviceUrl: 'https://us-south.ml.cloud.ibm.com' // Typical Hackathon default
    });

    const response = await watsonx.generateText({
      projectId: process.env.IBM_PROJECT_ID,
      modelId: 'ibm/granite-13b-chat-v2',
      input: "Hello IBM Bob!",
      parameters: { max_new_tokens: 10 }
    });

    console.log("SUCCESS:", response.result.results[0].generated_text);
  } catch (err) {
    console.error("SDK ERROR:");
    console.error(err.message);
  }
}

testWatson();
