const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  title: {
    type: String,
    required: true
  },

  subject: {
    type: String,
    default: ""
  },

  dueDate: {
    type: Date
  },

  completed: {
    type: Boolean,
    default: false
  },

  // 🔥 STUDY TIME TRACKING (NEW)
  duration: {
    type: Number,
    default: 0   // in seconds
  }

}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);