# 📊 Core Dashboard & Business Management

> **Assigned To:** Member 1 (Project Lead / Core Platform)  
> **Recommended Git Branch:** `members/aryann310`  
> **Backend Port:** `5001` | **Frontend Port:** `5174`

---

## 📌 Module Overview
This module is the **Core Backbone** of Samvaya. You own:
- **Business Dashboard**: Health score calculation, revenue/expense stats, operational priorities.
- **Business Profile**: Business registration details, category, location, and owner KYC.
- **System Settings**: Localization and system configurations.
- **Team Roster**: Hackathon team member showcase.
- **Global Layout & Navigation**: Application shell, theme toggler, and shared sidebar.

---

## ⚡ Quick Start Instructions

### 1. Setup your Git Feature Branch
```bash
git checkout main
git pull origin main
git checkout -b members/aryann310
```

### 2. Start the Backend Server (Port 5001)
```bash
cd backend
npm install
npm run dev
```
Verify the backend is active at: [http://localhost:5001/health](http://localhost:5001/health)

### 3. Start the Frontend Application (Port 5174)
In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5174](http://localhost:5174) in your browser.

---

## 🗂️ Scope & File Ownership

### Frontend Pages Owned:
- `frontend/src/pages/Dashboard.tsx`
- `frontend/src/pages/Business.tsx`
- `frontend/src/pages/Settings.tsx`
- `frontend/src/pages/Team.tsx`

### Backend Routes & Endpoints Owned:
- `/api/v2/dashboard` (Routes: `backend/src/routes/dashboard.routes.ts`, Controller: `backend/src/controllers/dashboard.controller.ts`, Service: `backend/src/services/dashboard.service.ts`)
- `/api/v2/business` (Routes: `backend/src/routes/business.routes.ts`, Controller: `backend/src/controllers/business.controller.ts`, Service: `backend/src/services/business.service.ts`)

---

## 🔄 Merging back to `main`
When your features and improvements are tested and complete:
1. Copy modified page files from `frontend/src/pages/` to the root project: `x:\Hackathon - Copy\frontend\src\pages\`
2. Copy modified backend controllers/services from `backend/src/` to root: `x:\Hackathon - Copy\backend\src\`
3. Commit and push:
   ```bash
   git add .
   git commit -m "feat(core): completed feature implementation"
   git push -u origin members/aryann310
   ```
4. Open a Pull Request on GitHub targeting `main`.
