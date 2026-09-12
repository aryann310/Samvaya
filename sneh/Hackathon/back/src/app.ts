import express from 'express';
import { corsMiddleware } from './middleware/cors';
import { errorHandler } from './middleware/errorHandler';
import apiRoutes from './routes';

const app = express();

app.use(corsMiddleware);
app.use(express.json());

app.use('/api', apiRoutes);

app.use(errorHandler);

export default app;
