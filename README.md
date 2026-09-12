# 🤖 AI Advisor & Decision Intelligence

> **Assigned To:** Member 2 (AI & Decision Intelligence)  
> **Recommended Git Branch:** `feature/AIAdvisorandIntelligence`  
> **Backend Port:** `5002` | **Frontend Port:** `5175`

---

## 📌 Module Overview
This module is the **AI Intelligence Engine** of Samvaya. You own:
- **Conversational AI Advisor**: Context-aware advisory chatbot tailored for micro-businesses.
- **Structured Recommendation Cards**: Clear breakdown with 'Why', 'Local Evidence', 'Financial Impact', and 'Next Steps'.
- **AI Insights Engine**: Real-time business diagnostic alerts and proactive growth tips.
- **Multilingual Support & Prompting**: Extensible for Google Gemini or OpenAI API keys.

---

## ⚡ Quick Start Instructions

### 1. Setup your Git Feature Branch
```bash
git checkout main
git pull origin main
git checkout -b feature/AIAdvisorandIntelligence
```

### 2. Start the Backend Server (Port 5002)
```bash
cd backend
npm install
npm run dev
```
Verify the backend is active at: [http://localhost:5002/health](http://localhost:5002/health)

### 3. Start the Frontend Application (Port 5175)
In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5175](http://localhost:5175) in your browser.

---

## 🗂️ Scope & File Ownership

### Frontend Pages Owned:
- `frontend/src/pages/AIAdvisor.tsx`

### Backend Routes & Endpoints Owned:
- `/api/v2/ai` (Routes: `backend/src/routes/ai.routes.ts`, Controller: `backend/src/controllers/ai.controller.ts`, Service: `backend/src/services/ai.service.ts`)

---

## 🔄 Merging back to `main`
When your features and improvements are tested and complete:
1. Copy modified page files from `frontend/src/pages/` to the root project: `x:\Hackathon - Copy\frontend\src\pages\`
2. Copy modified backend controllers/services from `backend/src/` to root: `x:\Hackathon - Copy\backend\src\`
3. Commit and push:
   ```bash
   git add .
   git commit -m "feat(ai): completed feature implementation"
   git push -u origin feature/AIAdvisorandIntelligence
   ```
4. Open a Pull Request on GitHub targeting `main`.
