const Project = require("../models/Project");
const Resource = require("../models/Resource");
const OptimizationResult = require("../models/OptimizationResult");

exports.runOptimization = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    const mongoose = require("mongoose");

    const resources = await Resource.find({
      projectId: new mongoose.Types.ObjectId(req.params.projectId),
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    let remainingBudget = project.totalBudget;
    let budgetUsed = 0;
    let allocatedResources = [];

    const sortedResources = resources.sort(
      (a, b) =>
        b.productivityScore / b.unitCost - a.productivityScore / a.unitCost,
    );

    for (const resource of sortedResources) {
      const maxAffordableQty = Math.floor(remainingBudget / resource.unitCost);
      const allocatedQty = Math.min(
        resource.quantityAvailable,
        maxAffordableQty,
      );

      if (allocatedQty > 0) {
        const cost = allocatedQty * resource.unitCost;

        allocatedResources.push({
          resourceName: resource.resourceName,
          resourceType: resource.resourceType,
          allocatedQuantity: allocatedQty,
          unitCost: resource.unitCost,
          totalCost: cost,
          productivityScore: resource.productivityScore,
        });

        budgetUsed += cost;
        remainingBudget -= cost;
      }
    }

    const recommendation =
      allocatedResources.length > 0
        ? "Resources were allocated based on the highest productivity-to-cost ratio."
        : "No resources were allocated because the budget is insufficient.";

    const result = await OptimizationResult.create({
      projectId: project._id,
      totalBudget: project.totalBudget,
      budgetUsed,
      remainingBudget,
      allocatedResources,
      recommendation,
    });

    res.json({
      success: true,
      message: "Optimization completed",
      result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Optimization failed",
      error: error.message,
    });
  }
};
