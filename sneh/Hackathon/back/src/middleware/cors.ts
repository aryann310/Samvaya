import cors from 'cors';

export const corsMiddleware = cors({
  origin: '*', // Allow all for local dev
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
});
