import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import donorRoutes from "./routes/donorRoutes.js";
import contactRoutes from "./routes/contactRoutes.js"; // ✅ import contact routes

dotenv.config();
const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Connect Database
connectDB()
  .then(() => console.log("✅ MongoDB Connection Successful"))
  .catch((err) => console.error("❌ MongoDB Connection Failed:", err));

// ✅ API Routes
app.use("/api/donors", donorRoutes);
app.use("/api/contacts", contactRoutes); // ✅ use contact routes

// ✅ Root Test Route
app.get("/", (req, res) => {
  res.send("✅ BDMS Backend Server Running");
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error("🔥 SERVER ERROR:", err.message);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: err.message,
  });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
