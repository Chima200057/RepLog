# RepLog - AI-Powered Practice Journal

RepLog is an intelligent practice journal that acts as your personal coach. Powered by IBM Bob (WatsonX), it tracks, analyzes, and guides your practice sessions, ensuring you get better at everything you do.

## Features
- **Precision Tracking**: Log every nuance of your practice sessions.
- **Glassmorphism UI**: A stunning, modern, dark-mode React interface.
- **IBM Bob Chat**: An integrated sliding chat drawer to converse with your AI coach.
- **Dynamic Micro-Goals**: Get actionable feedback to break through plateaus.

## Tech Stack
- **Frontend**: React, Vite, Vanilla CSS
- **Backend**: Node.js, Express.js
- **AI Integration**: IBM WatsonX (`@ibm-cloud/watsonx-ai` SDK)

## How to Run Locally

### 1. Configure Environment variables
Rename the provided `.env.example` file to `.env` and insert your IBM Cloud credentials:
```bash
IBM_CLOUD_API_KEY=your_api_key_here
IBM_PROJECT_ID=your_project_id_here
```

### 2. Start the Backend Server
The Node.js Express server is needed to securely communicate with IBM WatsonX.
Open a terminal in the project root and run:
```bash
node server/index.js
```
The backend will start on `http://localhost:3001`.

### 3. Start the Frontend Application
Open a **second terminal window** in the project root and run:
```bash
npm install
npm run dev
```
The React frontend will start on `http://localhost:5173`. Any messages sent to the Bob Chat will automatically proxy to the backend.

---
*Built for the IBM lablab.ai Hackathon.*
