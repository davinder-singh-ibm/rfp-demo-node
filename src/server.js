const express = require("express");
const cors = require("cors");
const path = require("path");
const { PORT } = require("./config/env");

const uploadRoutes = require("./routes/upload.routes");
const generateRoutes = require("./routes/generate.routes");
const parserRoutes = require("./routes/parser.routes");
const proposalRoutes = require("./routes/proposal.routes");

const app = express();

/**
 * ======================================
 * Swagger setup
 * ======================================
 */
const { swaggerSpec, swaggerUi } = require("./config/swagger");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/swagger.json", (req, res) => res.json(swaggerSpec));

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
 * Azure App Service Easy Auth Middleware
 * ======================================
 */
function requireAuth(req, res, next) {
  if (DISABLE_ENTRA_AUTH) {
    return next();
  }

  const principal = req.headers["x-ms-client-principal"];
  if (!principal) {
    return res.status(401).json({
      message: "Unauthorized. Please login using Microsoft Entra ID.",
    });
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
      message: "Entra Auth Disabled (DEV MODE)",
      user: {
        name: "DEV_USER",
        roles: ["developer"],
      },
    });
  }

  const principal = req.headers["x-ms-client-principal"];
  if (!principal) {
    return res.status(401).json({ message: "Not logged in" });
  }

  try {
    const decoded = Buffer.from(principal, "base64").toString("utf8");
    const user = JSON.parse(decoded);
    res.json({
      authenticated: true,
      user,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to decode user principal",
      err,
    });
  }
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