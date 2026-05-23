const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      required: true,
    },
    projectDescription: {
      type: String,
      required: true,
    },
    totalBudget: {
      type: Number,
      required: true,
    },
    objective: {
      type: String,
      default: "Maximize resource efficiency",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Project", projectSchema);
