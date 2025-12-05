// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const patientRoutes = require("./routes/patientRoutes");

const app = express();

/**
 * Helper: normalize origin strings
 * - trims whitespace
 * - removes trailing slashes (so https://site.com/ -> https://site.com)
 */
const normalizeOrigin = (u) => {
  if (!u || typeof u !== "string") return u;
  return u.trim().replace(/\/+$/, "");
};

// Read raw allowed origin from env (or fallback)
const rawAllowed = process.env.FRONTEND_ORIGIN || "https://finalclinictoken.netlify.app";
const allowedOrigin = normalizeOrigin(rawAllowed);

// Build CORS options (same robust logic)
const corsOptions =
  process.env.NODE_ENV === "production"
    ? {
        origin: (incomingOrigin, callback) => {
          if (!incomingOrigin) return callback(null, true); // allow curl / server-to-server
          const normalizedIncoming = normalizeOrigin(incomingOrigin);
          if (normalizedIncoming === allowedOrigin) {
            return callback(null, true);
          }
          return callback(new Error("CORS policy: origin not allowed"));
        },
        credentials: true,
        optionsSuccessStatus: 204,
      }
    : {
        origin: true,
        credentials: true,
        optionsSuccessStatus: 204,
      };

// Use global CORS middleware for normal requests
app.use(cors(corsOptions));

// Preflight (OPTIONS) handling WITHOUT registering wildcard route patterns
// We call the cors middleware directly for OPTIONS requests and then end with 204
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    // run CORS middleware for this request then finish
    return cors(corsOptions)(req, res, () => res.sendStatus(204));
  }
  next();
});

// Slight middleware to set Vary: Origin (helps caches/proxies when Access-Control-Allow-Origin is echoed)
app.use((req, res, next) => {
  const existing = res.getHeader("Vary");
  if (!existing) {
    res.setHeader("Vary", "Origin");
  } else {
    const vary = Array.isArray(existing) ? existing.join(",") : String(existing);
    if (!/Origin/i.test(vary)) {
      res.setHeader("Vary", `${vary}, Origin`);
    }
  }
  next();
});

// Built-in body parser
app.use(express.json());

// Simple request logger (optional, helpful during debugging)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl} - Origin: ${req.headers.origin || "none"}`);
  next();
});

// Routes
app.use("/api", patientRoutes);

// Default health check
app.get("/", (req, res) => {
  res.send("Backend is running ✔");
});

// Basic error handler (including CORS errors)
app.use((err, req, res, next) => {
  console.error("ERROR:", err && err.message ? err.message : err);
  if (err && err.message && err.message.includes("CORS")) {
    return res.status(403).json({ error: "CORS error: origin not allowed" });
  }
  res.status(err && err.status ? err.status : 500).json({ error: err && err.message ? err.message : "Internal Server Error" });
});

// PORT — production platforms inject PORT env
const PORT = process.env.PORT || 4000;

// Bind 0.0.0.0 for hosting on Render/Railway
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT} — NODE_ENV=${process.env.NODE_ENV || "development"}`);
  console.log(`Configured allowed origin (normalized): ${allowedOrigin}`);
});
