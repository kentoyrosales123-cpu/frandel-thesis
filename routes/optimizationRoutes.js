const express = require("express");
const router = express.Router();

const { runOptimization } = require("../controllers/optimizationController");

router.post("/:projectId", runOptimization);

module.exports = router;
