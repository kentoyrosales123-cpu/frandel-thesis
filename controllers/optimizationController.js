const Resource = require("../models/Resource");
const OptimizationResult = require("../models/OptimizationResult");

exports.runOptimization = async (req, res) => {
  try {
    const { projectId } = req.params;

    const {
      maxBudget = 100000,
      maxLabor = 100,
      maxTime = 30,
      weights = {
        cost: 0.25,
        efficiency: 0.25,
        urgency: 0.25,
        availability: 0.15,
        risk: 0.1,
      },
    } = req.body;

    const resources = await Resource.find({ projectId });

    if (!resources.length) {
      return res.status(404).json({
        message: "No resources found for this project.",
      });
    }

    const maxCost = Math.max(...resources.map((r) => r.cost || 1));

    const scoredResources = resources.map((resource) => {
      const normalizedCost = 1 - resource.cost / maxCost;
      const normalizedEfficiency = resource.efficiency / 10;
      const normalizedUrgency = resource.urgency / 10;
      const normalizedAvailability = resource.availability / 10;
      const normalizedRisk = 1 - resource.risk / 10;

      const mcdmScore =
        weights.cost * normalizedCost +
        weights.efficiency * normalizedEfficiency +
        weights.urgency * normalizedUrgency +
        weights.availability * normalizedAvailability +
        weights.risk * normalizedRisk;

      return {
        resource,
        mcdmScore,
        valuePerCost: mcdmScore / Math.max(resource.cost, 1),
      };
    });

    scoredResources.sort((a, b) => b.valuePerCost - a.valuePerCost);

    let totalCost = 0;
    let totalLabor = 0;
    let totalTime = 0;
    let totalScore = 0;

    const selectedResources = [];
    const rejectedResources = [];

    for (const item of scoredResources) {
      const r = item.resource;

      const canSelect =
        totalCost + r.cost <= maxBudget &&
        totalLabor + r.laborRequired <= maxLabor &&
        totalTime + r.timeRequired <= maxTime;

      if (canSelect) {
        selectedResources.push({
          resourceId: r._id,
          name: r.name,
          cost: r.cost,
          laborRequired: r.laborRequired,
          timeRequired: r.timeRequired,
          mcdmScore: Number(item.mcdmScore.toFixed(4)),
        });

        totalCost += r.cost;
        totalLabor += r.laborRequired;
        totalTime += r.timeRequired;
        totalScore += item.mcdmScore;
      } else {
        rejectedResources.push({
          resourceId: r._id,
          name: r.name,
          reason: "Rejected due to budget, labor, or time constraint.",
          mcdmScore: Number(item.mcdmScore.toFixed(4)),
        });
      }
    }

    const result = await OptimizationResult.create({
      projectId,
      selectedResources,
      rejectedResources,
      totalCost,
      totalLabor,
      totalTime,
      totalScore: Number(totalScore.toFixed(4)),
      constraints: {
        maxBudget,
        maxLabor,
        maxTime,
      },
      weights,
      method: "LP-MCDM",
    });

    res.status(200).json({
      message: "LP-MCDM optimization completed successfully.",
      result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Optimization failed.",
      error: error.message,
    });
  }
};
