const mongoose = require("mongoose");

const optimizationResultSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    totalBudget: Number,
    budgetUsed: Number,
    remainingBudget: Number,
    allocatedResources: Array,
    recommendation: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("OptimizationResult", optimizationResultSchema);
