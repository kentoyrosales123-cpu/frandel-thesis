const mongoose = require("mongoose");

const optimizationResultSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    method: {
      type: String,
      default: "LP-MCDM",
    },

    selectedResources: [
      {
        resourceId: mongoose.Schema.Types.ObjectId,
        name: String,
        cost: Number,
        laborRequired: Number,
        timeRequired: Number,
        mcdmScore: Number,
      },
    ],

    rejectedResources: [
      {
        resourceId: mongoose.Schema.Types.ObjectId,
        name: String,
        reason: String,
        mcdmScore: Number,
      },
    ],

    totalCost: Number,
    totalLabor: Number,
    totalTime: Number,
    totalScore: Number,

    constraints: {
      maxBudget: Number,
      maxLabor: Number,
      maxTime: Number,
    },

    weights: {
      cost: Number,
      efficiency: Number,
      urgency: Number,
      availability: Number,
      risk: Number,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("OptimizationResult", optimizationResultSchema);
