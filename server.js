const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const projectRoutes = require("./routes/projectRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const optimizationRoutes = require("./routes/optimizationRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/projects", projectRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/optimize", optimizationRoutes);

const PORT = process.env.PORT || 5000;

if (!process.env.MONGODB_URI) {
  console.error(
    "MONGODB_URI is missing. Add it in Render Environment Variables.",
  );
  process.exit(1);
}

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
