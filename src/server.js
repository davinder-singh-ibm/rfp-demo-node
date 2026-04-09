const express = require("express");
const cors = require("cors");
const path = require("path");
const { PORT, API_KEY } = require("./config/env");

const uploadRoutes = require("./routes/upload.routes");
const generateRoutes = require("./routes/generate.routes");
const parserRoutes = require("./routes/parser.routes");
const proposalRoutes = require("./routes/proposal.routes");
const pdfRoutes = require("./routes/pdf.routes");
const emailRoutes = require("./routes/email.routes");

const app = express();

/**
 * ======================================
 * Swagger setup
 * ======================================
 */
const { swaggerSpec, swaggerUi } = require("./config/swagger");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/swagger.json", (req, res) => res.json(swaggerSpec));

// New endpoint to serve swagger.json from src/swagger.json
app.get("/swagger_new.json", (req, res) => {
  const swaggerJson = require("./swagger.json");
  res.json(swaggerJson);
});

/**
 * ======================================
 * ENV FLAGS
 * ======================================
 */
const DISABLE_ENTRA_AUTH = process.env.DISABLE_ENTRA_AUTH === "true";
const DISABLE_CORS = process.env.DISABLE_CORS === "true";

/**
 * ======================================
 * CORS CONFIGURATION
 * ======================================
 */
if (DISABLE_CORS) {
  console.warn("⚠️  CORS is DISABLED (DEV MODE)");
  app.use(cors());
} else {
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:4200",
    "http://localhost:5173",
    "rfp-api-service-c8adb8a8h2gmbcf8.canadacentral-01.azurewebsites.net",
    "http://rfp-api-service-c8adb8a8h2gmbcf8.canadacentral-01.azurewebsites.net",
    "https://rfp-api-service-c8adb8a8h2gmbcf8.canadacentral-01.azurewebsites.net",
  ];

  app.use(
    cors({
      origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(new Error("CORS not allowed for this origin"), false);
      },
      credentials: true,
    })
  );
}

/**
 * ======================================
 * Body parsers
 * ======================================
 */
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true }));

/**
 * ======================================
 * API Key Authentication Middleware
 * ======================================
 */
function requireAuth(req, res, next) {
  if (DISABLE_ENTRA_AUTH) {
    return next();
  }

  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return res.status(401).json({
      message: "Unauthorized. Please provide x-api-key header.",
    });
  }

  // Validate API key against environment variable
  if (API_KEY) {
    // If API_KEY is configured, validate against it
    if (apiKey !== API_KEY) {
      return res.status(401).json({
        message: "Invalid API key.",
      });
    }
  } else {
    // If API_KEY is not configured, accept any non-empty API key (dev mode)
    console.warn("⚠️  API_KEY not configured. Accepting any non-empty API key (DEV MODE)");
    if (apiKey.trim().length === 0) {
      return res.status(401).json({
        message: "Invalid API key.",
      });
    }
  }

  next();
}

/**
 * ======================================
 * Optional: Get current user info
 * ======================================
 */
app.get("/api/me", (req, res) => {
  if (DISABLE_ENTRA_AUTH) {
    return res.json({
      authenticated: true,
      message: "Auth Disabled (DEV MODE)",
      user: {
        name: "DEV_USER",
        roles: ["developer"],
      },
    });
  }

  const apiKey = req.headers["x-api-key"];
  if (!apiKey) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  res.json({
    authenticated: true,
    user: {
      name: "API_USER",
      roles: ["api_user"],
    },
  });
});

/**
 * ======================================
 * Serve UI
 * ======================================
 */
app.use("/", express.static(path.join(__dirname, "ui")));

/**
 * ======================================
 * Public Health API
 * ======================================
 */
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "RFP Generator API running",
    authEnabled: !DISABLE_ENTRA_AUTH,
    corsEnabled: !DISABLE_CORS,
  });
});

/**
 * ======================================
 * Protected API Routes
 * ======================================
 */
app.use("/api/upload", requireAuth, uploadRoutes);
app.use("/api/generate", requireAuth, generateRoutes);
app.use("/api/parser", requireAuth, parserRoutes);
app.use("/api/proposals", requireAuth, proposalRoutes);
app.use("/api/download-pdf", requireAuth, pdfRoutes);
app.use("/api/send-email", requireAuth, emailRoutes);

/**
 * ======================================
 * API 404 Handler - Must come before UI fallback
 * ======================================
 */
app.use("/api/*", (req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `API endpoint ${req.method} ${req.path} does not exist`,
    path: req.path,
  });
});

/**
 * ======================================
 * API Error Handler - JSON errors for /api routes
 * ======================================
 */
app.use((err, req, res, next) => {
  // Only handle errors for API routes
  if (req.path.startsWith("/api")) {
    console.error("API Error:", err);
    
    const statusCode = err.statusCode || err.status || 500;
    const message = err.message || "Internal Server Error";
    
    res.status(statusCode).json({
      error: err.name || "Error",
      message: message,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
  } else {
    // Pass to default error handler for non-API routes
    next(err);
  }
});

/**
 * ======================================
 * Fallback route for UI (SPA)
 * ======================================
 */
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "ui", "index.html"));
});

/**
 * ======================================
 * Start Server
 * ======================================
 */
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(
    `Entra Auth: ${
      DISABLE_ENTRA_AUTH ? "DISABLED (DEV MODE)" : "ENABLED"
    }`
  );
  console.log(
    `CORS: ${DISABLE_CORS ? "DISABLED (DEV MODE)" : "ENABLED"}`
  );
});