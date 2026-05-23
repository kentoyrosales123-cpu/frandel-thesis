const express = require("express");
const router = express.Router();

const {
  createResource,
  getResourcesByProject,
} = require("../controllers/resourceController");

router.post("/", createResource);
router.get("/:projectId", getResourcesByProject);

module.exports = router;
