// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");
// const authRoutes = require("./routes/auth");
// const mediaRoutes = require("./routes/instructor-routes/media-routes");
// const errorHandler = require("./middleware/errorHandler");

// const app = express();
// const PORT = process.env.PORT || 5000;
// const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/EduNest";

// // CORS configuration
// app.use(
//     cors({
//         origin: process.env.CLIENT_URL,
//         methods: ["GET", "POST", "DELETE", "PUT"],
//         allowedHeaders: ["Content-Type", "Authorization"],
//     })
// );

// // Middleware
// app.use(express.json());

// // Routes
// app.use("/api/auth", authRoutes); 
// app.use("/media/auth", mediaRoutes);

// // Global Error Handler
// app.use(errorHandler);

// // MongoDB connection
// // mongoose.connect(MONGO_URI)
// //     .then(() => console.log("MongoDB connected"))
// //     .catch(err => console.error("MongoDB connection error:", err));

// mongoose.connect(process.env.MONGO_URI, {
//     dbName: "CourseMaster",
// })
// .then(() => console.log("MongoDB connected to CourseMaster"))
// .catch(err => console.error(err));


// // Default fallback error handler (in case errorHandler is missing)
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).json({
//         success: false,
//         message: "Something went wrong",
//     });
// });

// // Start server
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });





//BACKEND/INDEX.JS
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth");
const mediaRoutes = require("./routes/instructor-routes/media-routes");
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
app.use("/api/instructor/media", mediaRoutes);
app.use("/api/instructor/courses", instructorCourseRoutes);
app.use("/api/student/courses", studentCourseRoutes);
app.use("/api/student/orders", studentOrderRoutes);

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
