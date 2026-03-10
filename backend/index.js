//BACKEND/INDEX.JS
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const authRoutes = require("./routes/auth");
const instructorCourseRoutes = require("./routes/instructor-routes/course.routes");
const studentCourseRoutes = require("./routes/student-routes/course.routes");
const studentOrderRoutes = require("./routes/student-routes/order.routes");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";
const isProduction = NODE_ENV === "production";

const allowedOrigins = (process.env.CLIENT_URLS || process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

function isLocalDevOrigin(origin) {
  try {
    const url = new URL(origin);
    return (
      (url.hostname === "localhost" || url.hostname === "127.0.0.1") &&
      (url.protocol === "http:" || url.protocol === "https:")
    );
  } catch {
    return false;
  }
}

// MIDDLEWARE 
app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser tools (curl/Postman) and configured browser origins.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Developer-friendly: allow any localhost/127.0.0.1 dev origin.
      if (!isProduction && isLocalDevOrigin(origin)) {
        return callback(null, true);
      }

      // Developer-friendly fallback: if no origins configured, allow localhost dev.
      if (!isProduction && allowedOrigins.length === 0) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

let servingFrontend = false;

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    env: NODE_ENV,
    dbReadyState: mongoose.connection.readyState,
    allowedOrigins,
  });
});

// ROUTES 
app.use("/api/auth", authRoutes);
// app.use("/media/auth", mediaRoutes);
try {
  const mediaRoutes = require("./routes/instructor-routes/media-routes");
  app.use("/api/instructor/media", mediaRoutes);
} catch (err) {
  console.error("Failed to load media routes:", err?.message || err);
  app.use("/api/instructor/media", (req, res) => {
    res.status(503).json({
      success: false,
      message: "Media routes are unavailable on this deployment.",
      ...(isProduction ? {} : { detail: String(err?.message || err) }),
    });
  });
}
app.use("/api/instructor/courses", instructorCourseRoutes);
app.use("/api/student/courses", studentCourseRoutes);
app.use("/api/student/orders", studentOrderRoutes);

// Serve the Vite build in production (optional).
if (isProduction) {
  const distPath = path.resolve(__dirname, "../frontend/dist");
  const indexPath = path.join(distPath, "index.html");

  if (fs.existsSync(indexPath)) {
    servingFrontend = true;
    app.use(express.static(distPath));
    app.get(/^\/(?!api\/).*/, (req, res) => {
      res.sendFile(indexPath);
    });
  }
}

// Root route: avoids "Cannot GET /" when opening the backend directly in a browser.
if (!servingFrontend) {
  app.get("/", (req, res) => {
    res
      .status(200)
      .type("text/plain")
      .send(
        [
          "EduNest backend is running.",
          "Health: /api/health",
          isProduction
            ? ""
            : "Frontend (dev): run `npm run dev` in ./frontend (default http://localhost:5173).",
        ]
          .filter(Boolean)
          .join("\n")
      );
  });
}

// ERROR HANDLER 
app.use(errorHandler);

// START SERVER (dev-friendly): listen immediately; connect DB in background.
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

async function connectDbWithRetry() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { dbName: "CourseMaster" });
    console.log("CONNECTED DB:", mongoose.connection.name);
  } catch (err) {
    console.error("MongoDB connection failed:", err?.message || err);
    if (isProduction) {
      process.exit(1);
    }

    setTimeout(connectDbWithRetry, 5000);
  }
}

connectDbWithRetry();
