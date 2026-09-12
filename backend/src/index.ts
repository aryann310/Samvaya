import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import dashboardRoutes from './routes/dashboard.routes.js';
import businessRoutes from './routes/business.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Health checks
app.get('/health', (req, res) => res.status(200).json({ status: 'ok', module: 'Core_DashboardandBusiness', port: PORT }));
app.get('/api/health', (req, res) => res.status(200).json({ status: 'ok', module: 'Core_DashboardandBusiness', port: PORT }));


// Core Team & General endpoints
app.get('/api/team', (req, res) => {
  res.json([
    { name: "Yash Patel", handle: "yashpatel-11", github: "https://github.com/yashpatel-11", role: "Project Lead / Full-Stack", status: "Repository Owner" },
    { name: "Aryann", handle: "aryann310", github: "https://github.com/aryann310", role: "Core Contributor / Full-Stack", status: "Collaborator" },
    { name: "Kajal", handle: "kajal3308", github: "https://github.com/kajal3308", role: "Team Member / Contributor", status: "Collaborator" },
    { name: "Sneh", handle: "sneh557", github: "https://github.com/sneh557", role: "Team Member / Contributor", status: "Collaborator" }
  ]);
});


// Mount Routes under /api/v2
app.use('/api/v2/dashboard', dashboardRoutes);
app.use('/api/v2/business', businessRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Core Dashboard & Business Management Backend running at http://localhost:${PORT}`);
});
