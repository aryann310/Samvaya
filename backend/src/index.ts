import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import aiRoutes from './routes/ai.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());

// Health checks
app.get('/health', (req, res) => res.status(200).json({ status: 'ok', module: 'AIAdvisorandIntelligence', port: PORT }));
app.get('/api/health', (req, res) => res.status(200).json({ status: 'ok', module: 'AIAdvisorandIntelligence', port: PORT }));


// Legacy / Direct advisor endpoint
app.post('/api/advisor', (req, res) => {
  const { message, lang = 'en' } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });
  res.json({
    recommendation: "Consider taking a MUDRA Shishu loan to expand your inventory.",
    why: "Your cash flow is stable, but available cash (₹32,000) might not cover the upcoming festive season demand spike.",
    localEvidence: "Local market data shows a 15% increase in demand in your 5km radius.",
    financialImpact: "An investment of ₹20,000 in inventory could yield an estimated ₹35,000 in revenue based on current margins.",
    nextStep: "Review the MUDRA scheme details in the Government Schemes section and prepare your basic KYC documents."
  });
});


// Mount Routes under /api/v2
app.use('/api/v2/ai', aiRoutes);

app.listen(PORT, () => {
  console.log(`🚀 AI Advisor & Decision Intelligence Backend running at http://localhost:${PORT}`);
});
