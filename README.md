# RepLog. 🦾✨

**The AI-Powered Coaching Journal for Elite Athletes and Creators.**

RepLog is a high-performance web application designed for the **IBM WatsonX Hackathon**. It transforms raw practice logs into actionable coaching intelligence, powered by IBM's industry-leading Granite Foundation Models.

---

## 🚀 Key Features

### 🧠 IBM WatsonX "Bob" AI Coach
- **Granite-Powered Insights**: Uses `ibm/granite-3-8b-instruct` to analyze practice nuances, physiological metrics, and psychological blocks.
- **Semantic Auto-Titling**: AI automatically generates titles for your coaching sessions based on the first few logs (e.g., "5km Interval Strategy", "Piano Chord Transition Focus").

### 🧵 Multi-Session Architecture
- **Parallel Threads**: Switch between coaching sessions for different goals (e.g., Weightlifting, Programming, Yoga) without losing historical context.
- **Session Selector**: A clean interface to resume previous conversations or start fresh threads.

### 📚 Integrated Markdown Notebook
- **Save to Journal**: One-click "Save to Notebook" feature captures Bob's advice directly into a persistent, organized digital journal.
- **Glassmorphic Editor**: A premium markdown-supported editor to refine your goals and track progress over time.

### 🔐 Secure Identity & Trial System
- **Guest Passes**: New users get a 3-chat trial with ephemeral storage to test the platform.
- **Persistent Accounts**: Registered users get unlimited chats and permanent notebook storage synced via local storage.
- **Glassmorphic Auth**: Elegant sign-in/sign-up experience.

---

## 🛠️ Technical Stack

- **Frontend**: React (Vite), Vanilla CSS (Custom Design System), Lucide Icons.
- **Backend**: Node.js, Express.js.
- **AI Infrastructure**: 
  - **IBM WatsonX SDK**: `@ibm-cloud/watsonx-ai`
  - **Foundation Model**: `ibm/granite-3-8b-instruct`
  - **Orchestration**: Custom Regex-based JSON extraction for structured AI responses.
- **Styling**: Premium Glassmorphism (Backdrop-filter, blurred layers, linear gradients).

---

## 🏁 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- IBM Cloud Account with WatsonX.ai access.

### 2. Environment Setup
Create a `.env` file in the root directory:
```env
IBM_CLOUD_API_KEY=YOUR_API_KEY
IBM_PROJECT_ID=YOUR_PROJECT_ID
PORT=3001
```

### 3. Installation
```bash
# Install dependencies
npm install

# Start the frontend
npm run dev

# Start the backend (in a separate terminal)
node server/index.js
```

---

## 🔒 Security & Best Practices
- **Credential Masking**: All API keys are managed exclusively via server-side environment variables and proxied through a secure Express bridge.
- **Git Integrity**: The repository history has been sanitized to ensure no credentials or sensitive WatsonX identifiers were ever exposed.

---
Created by **Team RepLog** for the IBM WatsonX Hackathon 2026. 🚀
