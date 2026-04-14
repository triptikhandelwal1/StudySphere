const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");


// ================= ADD TASK =================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, subject, dueDate, priority } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required ❌" });
    }

    const task = new Task({
      user: req.user.id,
      title,
      subject,
      dueDate,
      priority
    });

    await task.save();

    res.json({ message: "Task added ✅", task });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= GET TASKS =================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.json(tasks);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= SUBMIT TASK =================
router.put("/:id/submit", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found ❌" });
    }

    if (task.completed) {
      return res.json({ message: "Already submitted ⚠️" });
    }

    task.completed = true;

    await task.save();

    res.json({ message: "Task submitted ✅", task });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= DELETE =================
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found ❌" });
    }

    await task.deleteOne();

    res.json({ message: "Task deleted ✅" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= ADD STUDY TIME =================
router.put("/:id/time", authMiddleware, async (req, res) => {
  try {
    const { time } = req.body;

    if (!time || time <= 0) {
      return res.status(400).json({ message: "Invalid time ❌" });
    }

    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found ❌" });
    }

    task.duration = (task.duration || 0) + time;

    await task.save();

    res.json({
      message: "Study time updated ✅",
      duration: task.duration
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;