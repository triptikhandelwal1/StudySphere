const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");

const JWT_SECRET = "studysphere_secret";

// ==================== SIGNUP ====================
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists ❌" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    res.json({ message: "User registered successfully ✅" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== LOGIN ====================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials ❌" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials ❌" });
    }

    const token = jwt.sign(
      { id: user._id },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful ✅",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== GET CURRENT USER ====================
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== UPDATE STREAK ====================
router.put("/streak", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const today = new Date().toISOString().split("T")[0];

    // Already counted today
    if (user.lastStudyDate === today) {
      return res.json({
        message: "Already counted today",
        streak: user.streak
      });
    }

    // Check yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yDate = yesterday.toISOString().split("T")[0];

    if (user.lastStudyDate === yDate) {
      user.streak += 1; // continue streak
    } else {
      user.streak = 1; // reset streak
    }

    user.lastStudyDate = today;

    await user.save();

    res.json({
      message: "Streak updated ✅",
      streak: user.streak
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;