// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import connectDB from "./config/db.js";
// import trackRoutes from "./routes/trackRoutes.js";
// import authRoutes from "./routes/authRoutes.js";


// dotenv.config();
// connectDB();

// const app = express();
// app.use(cors());
// app.use(express.json());

// app.use("/api/tracks", trackRoutes);
// app.use("/api/auth", authRoutes);


// app.get("/", (req, res) => {
//   res.send("Fleetrack backend running...");
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));






// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import connectDB from "./config/db.js";
// import authRoutes from "./routes/authRoutes.js";

// dotenv.config();
// const app = express();
// app.use(cors());
// app.use(express.json());

// const PORT = process.env.PORT || 5000;

// // Wait for MongoDB to connect BEFORE starting the server
// connectDB()
//   .then(() => {
//     console.log("✅ MongoDB Connected");
//     app.use("/api/auth", authRoutes);
//     app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
//   })
//   .catch((err) => {
//     console.error("❌ MongoDB Connection Failed:", err.message);
//     process.exit(1);
//   });



// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import connectDB from "./config/db.js";
// import authRoutes from "./routes/authRoutes.js";
// import trackRoutes from "./routes/trackRoutes.js";

// dotenv.config();
// const app = express();

// app.use(cors());
// app.use(express.json());

// // Wait until DB connects BEFORE starting the server
// const startServer = async () => {
//   try {
//     await connectDB();
//     console.log("✅ MongoDB connected successfully");

//     app.use("/api/auth", authRoutes);
//     app.use("/api/tracks", trackRoutes);

//     const PORT = process.env.PORT || 5000;
//     app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
//   } catch (err) {
//     console.error("❌ Database connection failed:", err.message);
//     process.exit(1);
//   }
// };

// startServer();





// // backend/server.js
// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import connectDB from "./config/db.js";

// // Existing routes (keep your login/register system)
// import authRoutes from "./routes/authRoutes.js";
// import trackRoutes from "./routes/trackRoutes.js";

// // Newly added routes for dashboard data
// import vehicleRoutes from "./routes/vehicleRoutes.js";
// import expenseRoutes from "./routes/expenseRoutes.js";
// import revenueRoutes from "./routes/revenueRoutes.js";
// import dashboardRoutes from "./routes/dashboardRoutes.js";

// dotenv.config();
// const app = express();

// // ✅ Middleware
// app.use(cors());
// app.use(express.json());

// // ✅ Health Check Endpoint
// app.get("/", (req, res) => {
//   res.send("🚚 FleetTrack Pro Backend is running successfully!");
// });

// // ✅ Start server after DB connection
// const startServer = async () => {
//   try {
//     await connectDB();
//     console.log("✅ MongoDB connected successfully");

//     // 🔐 Auth and tracking routes
//     app.use("/api/auth", authRoutes);
//     app.use("/api/tracks", trackRoutes);

//     // 💾 Core Fleet Management Routes
//     app.use("/api/vehicles", vehicleRoutes);
//     app.use("/api/expenses", expenseRoutes);
//     app.use("/api/revenues", revenueRoutes);

//     // 📊 Dashboard analytics route
//     app.use("/api/dashboard", dashboardRoutes);

//     // 🚀 Start server
//     const PORT = process.env.PORT || 5000;
//     app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
//   } catch (err) {
//     console.error("❌ Database connection failed:", err.message);
//     process.exit(1);
//   }
// };

// startServer();



// // backend/server.js
// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import connectDB from "./config/db.js";

// // Import route modules
// import authRoutes from "./routes/authRoutes.js";
// import trackRoutes from "./routes/trackRoutes.js";
// import vehicleRoutes from "./routes/vehicleRoutes.js";
// import expenseRoutes from "./routes/expenseRoutes.js";
// import revenueRoutes from "./routes/revenueRoutes.js";
// import dashboardRoutes from "./routes/dashboardRoutes.js";

// dotenv.config();

// const app = express();

// // ✅ Middleware Configuration
// app.use(
//   cors({
//     origin: ["http://localhost:3000"], // Allow your frontend
//     credentials: true,
//   })
// );
// app.use(express.json()); // Parse JSON bodies

// // ✅ Health Check Endpoint
// app.get("/", (req, res) => {
//   res.status(200).json({
//     status: "success",
//     message: "🚚 FleetTrack Pro Backend is running successfully!",
//   });
// });

// // ✅ Function to start the server after DB connects
// const startServer = async () => {
//   try {
//     await connectDB();
//     console.log("✅ MongoDB connected successfully");

//     // 🔐 Authentication & Tracking Routes
//     app.use("/api/auth", authRoutes);
//     app.use("/api/tracks", trackRoutes);

//     // 💾 Fleet Management Routes
//     app.use("/api/vehicles", vehicleRoutes);
//     app.use("/api/expenses", expenseRoutes);
//     app.use("/api/revenues", revenueRoutes);

//     // 📊 Dashboard Analytics Route
//     app.use("/api/dashboard", dashboardRoutes);

//     // ❌ Handle unknown API routes
//     app.use((req, res, next) => {
//       res.status(404).json({
//         success: false,
//         message: `API route not found: ${req.originalUrl}`,
//       });
//     });

//     // ⚠️ Global error handler (for any uncaught errors)
//     app.use((err, req, res, next) => {
//       console.error("Server Error:", err.stack);
//       res.status(500).json({
//         success: false,
//         message: "Internal server error",
//         error: err.message,
//       });
//     });

//     // 🚀 Start listening
//     const PORT = process.env.PORT || 5000;
//     app.listen(PORT, () => {
//       console.log(`🚀 Server running on port ${PORT}`);
//     });
//   } catch (err) {
//     console.error("❌ Database connection failed:", err.message);
//     process.exit(1);
//   }
// };

// // Initialize
// startServer();






// backend/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// Import route modules
import authRoutes from "./routes/authRoutes.js";
import trackRoutes from "./routes/trackRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import revenueRoutes from "./routes/revenueRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

dotenv.config();
const app = express();

// ✅ Middleware Configuration
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json()); // Parse JSON bodies

// ✅ Health Check Endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "🚚 FleetTrack Pro Backend is running successfully!",
  });
});

// ✅ Function to start the server only after DB connects
const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectDB();
    console.log("✅ MongoDB connected successfully");

    // ---- ROUTE MOUNT DEBUG START ----
    console.log("Mounting auth routes...");
    app.use("/api/auth", authRoutes);

    console.log("Mounting track routes...");
    app.use("/api/tracks", trackRoutes);

    console.log("Mounting vehicle routes...");
    app.use("/api/vehicles", vehicleRoutes);

    console.log("Mounting expense routes...");
    app.use("/api/expenses", expenseRoutes);

    console.log("Mounting revenue routes...");
    app.use("/api/revenues", revenueRoutes);

    console.log("Mounting dashboard routes...");
    app.use("/api/dashboard", dashboardRoutes);

    console.log("Mounting notification routes...");
    app.use("/api/notifications", notificationRoutes);
    // ---- ROUTE MOUNT DEBUG END ----

    // ❌ Handle unknown API routes
    app.use((req, res, next) => {
      res.status(404).json({
        success: false,
        message: `API route not found: ${req.originalUrl}`,
      });
    });

    // ⚠️ Global Error Handler
    app.use((err, req, res, next) => {
      console.error("Server Error:", err.stack);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: err.message,
      });
    });

    // 🚀 Start the server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );

  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
};

// Initialize
startServer();
