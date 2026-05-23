const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      default: "General",
    },

    cost: {
      type: Number,
      required: true,
      default: 0,
    },

    efficiency: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
      max: 10,
    },

    urgency: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
      max: 10,
    },

    availability: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
      max: 10,
    },

    risk: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
      max: 10,
    },

    laborRequired: {
      type: Number,
      default: 0,
    },

    timeRequired: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Resource", resourceSchema);
