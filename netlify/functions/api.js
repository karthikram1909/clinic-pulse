const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Import patient routes
const patientRoutes = require('../../backend/routes/patientRoutes.js');

// Mount routes at root so function URLs map to: /.netlify/functions/api/queue etc.
app.use('/', patientRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message });
});

exports.handler = serverless(app);
