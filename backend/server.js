// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const patientRoutes = require("./routes/patientRoutes");

const app = express();

// IMPORTANT: Allow Netlify frontend only
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || "https://clinicpulseee.netlify.app/",
  credentials: true
}));

app.use(express.json());

// Routes
app.use("/api", patientRoutes);

// Default health check
app.get("/", (req, res) => {
  res.send("Backend is running ✔");
});

// PORT — production platforms inject PORT env
const PORT = process.env.PORT || 4000;

// Bind 0.0.0.0 for hosting on Render/Railway
app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port " + PORT);
});
