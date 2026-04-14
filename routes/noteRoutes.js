const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const multer = require("multer");

// ================= MULTER CONFIG =================
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ================= SAVE NOTE =================
router.post("/", async (req, res) => {
  try {
    const { content } = req.body;

    // validation
    if (!content) {
      return res.status(400).json({ message: "Content is required ❌" });
    }

    // find existing note
    let note = await Note.findOne();

    if (note) {
      note.content = content;
      note.updatedAt = Date.now();
    } else {
      note = new Note({ content });
    }

    await note.save();

    res.status(200).json({
      message: "Notes saved ✅",
      note,
    });

  } catch (err) {
    console.error("Save error:", err);
    res.status(500).json({ error: "Server error while saving note ❌" });
  }
});


// ================= GET NOTE =================
router.get("/", async (req, res) => {
  try {
    const note = await Note.findOne().sort({ updatedAt: -1 });

    if (!note) {
      return res.json({ content: "" });
    }

    res.status(200).json(note);

  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ error: "Server error while fetching note ❌" });
  }
});
// ================= FILE UPLOAD =================
router.post("/upload", upload.single("file"), (req, res) => {
  try {
    res.json({
      message: "File uploaded ✅",
      fileName: req.file.filename,
    });
  } catch (err) {
    res.status(500).json({ error: "Upload failed ❌" });
  }
});
module.exports = router;