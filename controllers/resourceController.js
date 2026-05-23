const Resource = require("../models/Resource");

exports.createResource = async (req, res) => {
  try {
    const resource = await Resource.create(req.body);

    res.status(201).json({
      success: true,
      message: "Resource added successfully",
      resource,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add resource",
      error: error.message,
    });
  }
};

exports.getResourcesByProject = async (req, res) => {
  try {
    const resources = await Resource.find({
      projectId: req.params.projectId,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      resources,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch resources",
      error: error.message,
    });
  }
};

exports.updateResource = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found",
      });
    }

    res.json({
      success: true,
      message: "Resource updated successfully",
      resource,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update resource",
      error: error.message,
    });
  }
};
