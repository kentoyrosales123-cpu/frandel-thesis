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
    });

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
