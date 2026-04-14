const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

// ================= DEBUG LOG =================
console.log("🚀 Server starting...");

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// serve uploaded files
app.use("/uploads", express.static("uploads"));

// ================= DATABASE =================
connectDB(); // ⚠️ if error → comment this temporarily

// ================= ROUTES =================
console.log("📦 Loading routes...");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const noteRoutes = require("./routes/noteRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/notes", noteRoutes);

// ================= TEST ROUTE =================
app.get("/", (req, res) => {
  res.send("StudySphere API Running 🚀");
});

// ================= ERROR HANDLER =================
app.use((req, res) => {
  res.status(404).json({ message: "Route not found ❌" });
});

// ================= SERVER START =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});