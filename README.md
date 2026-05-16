# RepLog. 🦾✨
**The AI-Powered Coaching Journal for Elite Athletes and Creators.**

RepLog is a high-performance web application designed for the **IBM WatsonX Hackathon 2026**. It transforms raw practice logs into actionable coaching intelligence, powered by IBM's industry-leading **Granite Foundation Models**.

---

## 📽️ Project Overview
In a world of data overflow, athletes and creators often struggle to turn "practice volume" into "performance progress." **RepLog** bridges this gap by acting as a 24/7 AI coach. By analyzing training logs, sensory feedback, and performance metrics, RepLog provides structured, psychological, and technical feedback to help users achieve their "Peak Rep."

---

## 🎨 Design Philosophy: Glassmorphism 2.0
RepLog features a bespoke **Glassmorphic UI** designed for focus and flow:
- **Ultra-Modern Aesthetics**: Translucent layers with dynamic blur effects and vibrant gradients.
- **Micro-Animations**: Subtle transitions that provide tactile feedback without distraction.
- **Mobile First**: Responsive architecture that works on the track, in the gym, or at the desk.

---

## 🚀 Core Features

### 🧠 IBM WatsonX "Bob" AI Coach
*   **Granite-Powered Insights**: Leveraging `ibm/granite-3-8b-instruct` to perform domain-specific analysis across sports, coding, and music.
*   **Structured Coaching Loop**: Every response follows a high-impact pattern:
    *   🎉 **Small Wins**: Immediate positive reinforcement.
    *   🔍 **Pattern Observation**: Identifying technical or mental trends.
    *   🎯 **Next Practice Focus**: Concrete, actionable steps for the next session.
*   **Semantic Auto-Titling**: Bob analyzes the start of your session and automatically generates a title to keep your history organized.

### 🧵 Multi-Session Architecture
*   **Parallel Threads**: Maintain separate coaching sessions for "Cardio," "Strength," and "Skill Work" simultaneously.
*   **Persistence**: For registered users, sessions are preserved across reloads with optimized local caching.
*   **Session Management**: Full control to resume, jump back to history, or delete old sessions.

### 📚 Professional Markdown Notebook
*   **Drag-&-Drop Intelligence**: Seamlessly drag coaching advice or previous logs directly into your persistent journal.
*   **Read-Only for Guests**: Default welcome guides are provided as read-only templates to ensure system integrity.
*   **User-Scoped Storage**: Implements `prefix_userEmail` storage logic to ensure multi-user data isolation on shared machines.

---

## 🛠️ Technical Architecture

### Frontend: The High-Fidelity Interface
- **React (Vite)**: Lightning-fast HMR and build times.
- **Vanilla CSS**: Custom design system built from the ground up (no generic frameworks).
- **Lucide Icons**: Crisp, medical-grade iconography for professional appearance.
- **React-Markdown**: Full support for GFM-enhanced coaching summaries.

### Backend: The WatsonX Pipeline
- **Node.js / Express**: Secure proxy layer to mask API credentials.
- **IBM WatsonX AI SDK**: Direct integration with `@ibm-cloud/watsonx-ai`.
- **Robust Parsing Engine**: Custom regex-based JSON extractor that handles truncated or malformed LLM responses gracefully.

---

## 🏁 Getting Started

### 1. Prerequisites
- **Node.js** v18 or higher.
- **IBM Cloud Account** with a WatsonX.ai project instance.

### 2. Deployment Setup
Create a `.env` file in the root directory:
```env
IBM_CLOUD_API_KEY=your_ibm_api_key
IBM_PROJECT_ID=your_watsonx_project_id
PORT=3001
```

### 3. Installation & Launch
```bash
# 1. Install dependencies
npm install

# 2. Launch the AI Backend (Terminal 1)
node server/index.js

# 3. Launch the Frontend (Terminal 2)
npm run dev
```

---

## 📖 Feature Guides
- 📂 **[App Architecture](src/App.jsx)**: Central state and session management.
- 📂 **[AI Pipeline](server/index.js)**: IBM WatsonX integration and prompt engineering.
- 📂 **[Notebook System](src/pages/Notebook.jsx)**: Persistent journaling and drag-drop logic.

---

## 🏆 Hackathon Submission Notes
- **Innovation**: Real-time conversion of unstructured practice logs into structured coaching plans.
- **Reliability**: Implements robust error handling for AI inference and secure authentication workflows.
- **Scalability**: Designed for multi-user expansion while maintaining strict data privacy via user-scoped storage.

---
Created with 🦾 by **Team Vireon** for the IBM WatsonX Hackathon 2026.
"Optimize every rep. Log every gain."
