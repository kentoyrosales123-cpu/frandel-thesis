const express = require("express");
const router = express.Router();

const {
  createResource,
  getResourcesByProject,
  updateResource,
} = require("../controllers/resourceController");

router.post("/", createResource);
router.get("/:projectId", getResourcesByProject);
router.put("/:id", updateResource);

module.exports = router;
