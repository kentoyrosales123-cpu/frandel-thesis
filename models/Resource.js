const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    resourceName: {
      type: String,
      required: true,
    },
    resourceType: {
      type: String,
      required: true,
    },
    quantityAvailable: {
      type: Number,
      required: true,
    },
    unitCost: {
      type: Number,
      required: true,
    },
    productivityScore: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Resource", resourceSchema);
