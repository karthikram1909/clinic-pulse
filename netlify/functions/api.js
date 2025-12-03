import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import serverless from 'serverless-http';

config();

const app = express();

app.use(cors());
app.use(express.json());

// Import your routes
import patientRoutes from '../../backend/routes/patientRoutes.js';

app.use('/api/patients', patientRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

export const handler = serverless(app);
