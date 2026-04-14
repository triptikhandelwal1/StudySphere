const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      default: "",
    },
  },
  {
    timestamps: true, // ✅ adds createdAt & updatedAt
  }
);

module.exports = mongoose.model("Note", noteSchema);