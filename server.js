const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

// detect exe mode
const isElectron = process.versions.electron;

const envPath = isElectron
  ? path.join(process.resourcesPath, ".env")
  : path.join(__dirname, ".env");

// load env
dotenv.config({
  path: envPath,
});

const projectRoutes = require("./routes/projectRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const optimizationRoutes = require("./routes/optimizationRoutes");

const app = express();

app.use(cors());
app.use(express.json());
const publicPath = path.join(__dirname, "public");

app.use(express.static(publicPath));

app.use("/api/projects", projectRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/optimize", optimizationRoutes);
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const startServer = async (port = process.env.PORT || 5000) => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing");
  }

  await mongoose.connect(process.env.MONGODB_URI);

  return app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
  });
};

if (require.main === module) {
  startServer().catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}

module.exports = { app, startServer };
