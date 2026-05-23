const API_URL = "http://localhost:5000/api";

document.addEventListener("DOMContentLoaded", () => {
  loadProjects();

  const projectForm = document.getElementById("projectForm");
  const resourceForm = document.getElementById("resourceForm");
  const runOptimizationBtn = document.getElementById("runOptimizationBtn");

  if (projectForm) {
    projectForm.addEventListener("submit", addProject);
  }

  if (resourceForm) {
    resourceForm.addEventListener("submit", addResource);
  }

  if (runOptimizationBtn) {
    runOptimizationBtn.addEventListener("click", runOptimization);
  }
});

async function loadProjects() {
  try {
    const res = await fetch(`${API_URL}/projects`);
    const data = await res.json();

    const projectList = document.getElementById("projectList");
    const resourceProject = document.getElementById("resourceProject");
    const optimizationProject = document.getElementById("optimizationProject");

    if (projectList) {
      projectList.innerHTML = "";
    }

    data.projects.forEach((project) => {
      if (projectList) {
        projectList.innerHTML += `
  <div class="project-item">
    <h3>${project.projectName}</h3>
    <p>${project.projectDescription}</p>
    <p><strong>Budget:</strong> ₱${project.totalBudget}</p>
    <p><strong>ID:</strong> ${project._id}</p>

    <button class="delete-btn" onclick="deleteProject('${project._id}')">
      Delete Project
    </button>
  </div>
`;
      }

      if (resourceProject) {
        resourceProject.innerHTML += `
          <option value="${project._id}">
            ${project.projectName}
          </option>
        `;
      }

      if (optimizationProject) {
        optimizationProject.innerHTML += `
          <option value="${project._id}">
            ${project.projectName}
          </option>
        `;
      }
    });
  } catch (error) {
    console.error("Failed to load projects:", error);
  }
}

async function addProject(e) {
  e.preventDefault();

  const message = document.getElementById("projectMessage");

  const projectData = {
    projectName: document.getElementById("projectName").value,
    projectDescription: document.getElementById("projectDescription").value,
    totalBudget: Number(document.getElementById("totalBudget").value),
    objective: document.getElementById("objective").value,
  };

  try {
    const res = await fetch(`${API_URL}/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(projectData),
    });

    const data = await res.json();

    if (data.success) {
      message.textContent = "Project saved successfully.";
      message.className = "success";
      e.target.reset();
      loadProjects();
    } else {
      message.textContent = "Failed to save project.";
      message.className = "error";
    }
  } catch (error) {
    message.textContent = "Server error.";
    message.className = "error";
  }
}

async function addResource(e) {
  e.preventDefault();

  const message = document.getElementById("resourceMessage");

  const resourceData = {
    projectId: document.getElementById("resourceProject").value,
    resourceName: document.getElementById("resourceName").value,
    resourceType: document.getElementById("resourceType").value,
    quantityAvailable: Number(
      document.getElementById("quantityAvailable").value,
    ),
    unitCost: Number(document.getElementById("unitCost").value),
    productivityScore: Number(
      document.getElementById("productivityScore").value,
    ),
  };

  try {
    const res = await fetch(`${API_URL}/resources`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resourceData),
    });

    const data = await res.json();

    if (data.success) {
      message.textContent = "Resource added successfully.";
      message.className = "success";
      e.target.reset();
    } else {
      message.textContent = "Failed to add resource.";
      message.className = "error";
    }
  } catch (error) {
    message.textContent = "Server error.";
    message.className = "error";
  }
}

async function runOptimization() {
  const projectId = document.getElementById("optimizationProject").value;
  const message = document.getElementById("optimizationMessage");
  const resultBox = document.getElementById("optimizationResult");

  if (!projectId) {
    message.textContent = "Please select a project.";
    message.className = "error";
    return;
  }

  try {
    const res = await fetch(`${API_URL}/optimize/${projectId}`, {
      method: "POST",
    });

    const data = await res.json();

    if (data.success) {
      message.textContent = "Optimization completed.";
      message.className = "success";

      const result = data.result;

      resultBox.innerHTML = `
        <div class="result-item">
          <h3>Budget Summary</h3>
          <p><strong>Total Budget:</strong> ₱${result.totalBudget}</p>
          <p><strong>Budget Used:</strong> ₱${result.budgetUsed}</p>
          <p><strong>Remaining Budget:</strong> ₱${result.remainingBudget}</p>
        </div>

        <div class="result-item">
          <h3>Allocated Resources</h3>
          ${
            result.allocatedResources.length > 0
              ? result.allocatedResources
                  .map(
                    (item) => `
                      <p>
                        <strong>${item.resourceName}</strong><br>
                        Type: ${item.resourceType}<br>
                        Quantity: ${item.allocatedQuantity}<br>
                        Unit Cost: ₱${item.unitCost}<br>
                        Total Cost: ₱${item.totalCost}<br>
                        Productivity Score: ${item.productivityScore}
                      </p>
                    `,
                  )
                  .join("")
              : "<p>No resources allocated.</p>"
          }
        </div>

        <div class="result-item">
          <h3>Recommendation</h3>
          <p>${result.recommendation}</p>
        </div>
      `;
    } else {
      message.textContent = "Optimization failed.";
      message.className = "error";
    }
  } catch (error) {
    message.textContent = "Server error.";
    message.className = "error";
  }
}

async function deleteProject(projectId) {
  const confirmDelete = confirm(
    "Are you sure you want to delete this project?",
  );

  if (!confirmDelete) return;

  try {
    const res = await fetch(`${API_URL}/projects/${projectId}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (data.success) {
      alert("Project deleted successfully.");
      loadProjects();
    } else {
      alert("Failed to delete project.");
    }
  } catch (error) {
    alert("Server error while deleting project.");
  }
}
