import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { DashboardService } from './services/dashboard.service.js';
import { FinanceService } from './services/finance.service.js';
import { HyperlocalService } from './services/hyperlocal.service.js';
import { AdvisorService } from './ai/services/advisor.service.js';
import { SchemesService } from './services/schemes.service.js';
import snehRoutes from './routes/index.js';
import digilockerRoutes from './routes/digilocker.routes.js';
import intelligenceRoutes from './routes/intelligence.routes.js';
import authRoutes from './routes/auth.routes.js';
import voiceRoutes from './routes/voice.routes.js';
import { isMongoMode, getDatabaseMode } from './db/config.js';
import { connectDatabase, checkDatabaseHealth } from './db/connection.js';
import { createIndexes } from './db/indexes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use((req, _res, next) => {
  console.log(`[REQ] ${req.method} ${req.url}`);
  next();
});

// Team repository collaborators
const TEAM_COLLABORATORS = [
  { name: 'Yash Patel', handle: 'yashpatel-11', github: 'https://github.com/yashpatel-11', role: 'Project Lead / Full-Stack', status: 'Repository Owner' },
  { name: 'Aryann', handle: 'aryann310', github: 'https://github.com/aryann310', role: 'Core Contributor / Full-Stack', status: 'Collaborator' },
  { name: 'Kajal', handle: 'kajal3308', github: 'https://github.com/kajal3308', role: 'Team Member / Contributor', status: 'Collaborator' },
  { name: 'Sneh', handle: 'sneh557', github: 'https://github.com/sneh557', role: 'Team Member / Contributor', status: 'Collaborator' },
  { name: 'Zeel Gadhavi', handle: 'zeelgadhavi26-web', github: 'https://github.com/zeelgadhavi26-web', role: 'Team Member / Contributor', status: 'Collaborator' },
  { name: 'ZEEL K. THAKKAR', handle: 'ZeelThakkar90', github: 'https://github.com/ZeelThakkar90', role: 'Team Member / Contributor', status: 'Collaborator' }
];

// ─── Routes ─────────────────────────────────────────────────────────────────

app.get('/api/dashboard', async (req, res) => {
  const businessId = (req.query.businessId as string) || 'biz-001';
  try {
    const data = await DashboardService.getDashboard(businessId);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/finances', async (req, res) => {
  const businessId = (req.query.businessId as string) || 'biz-001';
  try {
    const data = await FinanceService.getFinancialSummary(businessId);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/hyperlocal', (req, res) => {
  const businessId = (req.query.businessId as string) || 'biz-001';
  try {
    const data = HyperlocalService.getHyperlocalData(businessId);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/schemes', async (_req, res) => {
  try {
    const schemes = await SchemesService.getAll();
    res.json(schemes);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/team', (_req, res) => {
  res.json(TEAM_COLLABORATORS);
});

app.post('/api/advisor', async (req, res) => {
  const { message, businessId = 'biz-001', lang = 'en' } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });
  try {
    const response = await AdvisorService.getAdvisory(message, businessId, lang);
    res.json(response);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/health', async (_req, res) => {
  const dbHealth = isMongoMode() ? await checkDatabaseHealth() : null;
  const status = dbHealth?.status === 'unavailable' ? 'degraded' : 'healthy';
  res.status(status === 'healthy' ? 200 : 503).json({
    status,
    services: {
      api: 'ok',
      database: isMongoMode() ? (dbHealth?.status ?? 'unavailable') : 'demo_mode',
      slm: process.env.SLM_API_KEY || process.env.GEMINI_API_KEY ? 'configured' : 'unconfigured',
      financialEngine: 'ok',
      inventoryEngine: 'ok',
      marketData: 'available'
    },
    databaseMode: getDatabaseMode(),
    ...(dbHealth?.latencyMs !== undefined ? { dbLatencyMs: dbHealth.latencyMs } : {})
  });
});

// Mount feature routes
app.use('/api/v2', snehRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/voice', voiceRoutes);
app.use('/api/digilocker', digilockerRoutes);
app.use('/api/intelligence', intelligenceRoutes);

// ─── Startup ────────────────────────────────────────────────────────────────

async function start() {
  console.log('\nSamvaya Backend');
  console.log('────────────────────────');
  console.log(`Environment:   ${process.env.NODE_ENV || 'development'}`);
  console.log(`Database mode: ${getDatabaseMode()}`);
  console.log(`SLM:           ${process.env.SLM_API_KEY || process.env.GEMINI_API_KEY ? 'configured' : 'unconfigured'}`);

  if (isMongoMode()) {
    if (!process.env.MONGODB_URI) {
      console.error('[Startup] ERROR: DATABASE_MODE=mongodb but MONGODB_URI is not set. Aborting.');
      process.exit(1);
    }
    try {
      await connectDatabase();
      await createIndexes();
      console.log('Database:      MongoDB ✔');
    } catch (err: any) {
      console.error('[Startup] MongoDB connection failed:', err.message);
      console.error('[Startup] Set DATABASE_MODE=demo to run without MongoDB.');
      process.exit(1);
    }
  } else {
    console.log('Database:      Demo mode (JSON DataStore)');
  }

  console.log('────────────────────────');

  const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}\n`);
  });

  // ─── Graceful Shutdown ────────────────────────────────────────────────────
  const shutdown = async (signal: string) => {
    console.log(`\n[Shutdown] ${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      if (isMongoMode()) {
        const { disconnectDatabase } = await import('./db/connection.js');
        await disconnectDatabase();
      }
      console.log('[Shutdown] Server closed.');
      process.exit(0);
    });
    // Force close after 10s
    setTimeout(() => {
      console.error('[Shutdown] Forced exit after timeout.');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

start();
