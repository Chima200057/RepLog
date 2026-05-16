# RepLog. 🦾✨

**The AI-Powered Coaching Journal for Elite Athletes and Creators.**

RepLog is a high-performance web application designed for the **IBM WatsonX Hackathon**. It transforms raw practice logs into actionable coaching intelligence, powered by IBM's industry-leading Granite Foundation Models.

---

## 🚀 Key Features

### 🧠 IBM WatsonX "Bob" AI Coach
- **Granite-Powered Insights**: Uses `ibm/granite-3-8b-instruct` to analyze practice nuances, physiological metrics, and psychological blocks.
- **Semantic Auto-Titling**: AI automatically generates titles for your coaching sessions based on the first few logs (e.g., "5km Interval Strategy").

### 🧵 Multi-Session Architecture
- **Parallel Threads**: Switch between coaching sessions for different goals without losing historical context.
- **Full Control Manager**: High-fidelity interface to resume previous conversations, navigate back with a dedicated **Back Button**, or permanently **Delete** old threads.

### 📚 Integrated Markdown Notebook
- **Save to Journal**: One-click "Save to Notebook" feature captures Bob's advice directly into a persistent, organized digital journal.
- **Glassmorphic Editor**: A premium markdown-supported editor to refine your goals and track progress over time.

### 📊 Notes Dashboard (NEW!)
- **Visual Review Interface**: Interactive card-based layout displaying notebooks (parents) and pages (children) for easy content selection.
- **Smart Selection**: Click a notebook to review all notes together, or click individual pages for focused feedback.
- **Structured Coaching**: Bob provides three-part feedback: 🎉 Small Win, 🔍 Pattern/Observation, and 🎯 Next Practice Focus.
- **Seamless Integration**: Modal overlay accessible from the Notebook page with full responsive design.

### � Secure Identity & Trial System
- **Guest Passes**: New users get a 3-chat trial with ephemeral storage to test the platform.
- **Persistent Accounts**: Registered users get unlimited chats and permanent notebook storage.
- **Data Privacy**: Guest history and journals are strictly transient and reset on page reload.

---

## 🛠️ Technical Stack

- **Frontend**: React (Vite), Vanilla CSS (Custom Design System), Lucide Icons.
- **Backend**: Node.js, Express.js.
- **AI Infrastructure**: 
  - **IBM WatsonX SDK**: `@ibm-cloud/watsonx-ai`
  - **Foundation Model**: `ibm/granite-3-8b-instruct`
  - **Prompt Engineering**: Structured JSON extraction with robust regex-based fallbacks.

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

## 📖 Documentation

- **[Notes Dashboard Feature Guide](PRACTICE_MAP_README.md)**: Complete guide to using the Notes Dashboard
- **[Notes Dashboard Implementation Plan](PRACTICE_MAP_PLAN.md)**: Technical architecture and design decisions
- **[Notes Dashboard Test Guide](PRACTICE_MAP_TEST_GUIDE.md)**: Comprehensive testing checklist

---

## 🔒 Security & Best Practices
- **Credential Masking**: All API keys are managed exclusively via server-side environment variables and proxied through a secure Express bridge.
- **Git Integrity**: The repository history has been sanitized to ensure no credentials were ever exposed.

---
Created by **Team Vireon** for the IBM WatsonX Hackathon 2026. 🚀
