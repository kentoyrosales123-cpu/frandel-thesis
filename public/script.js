const API_URL = "http://localhost:5000/api";

document.addEventListener("DOMContentLoaded", () => {
  loadProjects();

  const projectForm = document.getElementById("projectForm");
  const resourceForm = document.getElementById("resourceForm");
  const runOptimizationBtn = document.getElementById("runOptimizationBtn");

  const resourceListProject = document.getElementById("resourceListProject");
  const cancelEditBtn = document.getElementById("cancelEditBtn");

  if (resourceListProject) {
    resourceListProject.addEventListener("change", (e) => {
      loadResourcesByProject(e.target.value);
    });
  }

  if (cancelEditBtn) {
    cancelEditBtn.addEventListener("click", resetResourceForm);
  }

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
      const resourceListProject = document.getElementById(
        "resourceListProject",
      );

      if (resourceListProject) {
        resourceListProject.innerHTML += `
    <option value="${project._id}">
      ${project.projectName}
    </option>
  `;
      }
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
  const editingResourceId = document.getElementById("editingResourceId")?.value;

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
    const url = editingResourceId
      ? `${API_URL}/resources/${editingResourceId}`
      : `${API_URL}/resources`;

    const method = editingResourceId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resourceData),
    });

    const data = await res.json();

    if (data.success) {
      message.textContent = editingResourceId
        ? "Resource updated successfully."
        : "Resource added successfully.";

      message.className = "success";

      const selectedProjectId = resourceData.projectId;

      resetResourceForm();

      if (document.getElementById("resourceListProject")) {
        document.getElementById("resourceListProject").value =
          selectedProjectId;
        loadResourcesByProject(selectedProjectId);
      }
    } else {
      message.textContent = "Failed to save resource.";
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

async function loadResourcesByProject(projectId) {
  const resourceList = document.getElementById("resourceList");

  if (!resourceList || !projectId) return;

  resourceList.innerHTML = "<p>Loading resources...</p>";

  try {
    const res = await fetch(`${API_URL}/resources/${projectId}`);
    const data = await res.json();

    if (!data.resources || data.resources.length === 0) {
      resourceList.innerHTML = "<p>No resources added yet.</p>";
      return;
    }

    resourceList.innerHTML = data.resources
      .map(
        (resource) => `
        <div class="result-item">
          <h3>${resource.resourceName}</h3>
          <p><strong>Type:</strong> ${resource.resourceType}</p>
          <p><strong>Quantity:</strong> ${resource.quantityAvailable}</p>
          <p><strong>Unit Cost:</strong> ₱${resource.unitCost}</p>
          <p><strong>Productivity Score:</strong> ${resource.productivityScore}</p>

          <button onclick='editResource(${JSON.stringify(resource)})'>
            Edit Resource
          </button>
        </div>
      `,
      )
      .join("");
  } catch (error) {
    resourceList.innerHTML = "<p class='error'>Failed to load resources.</p>";
  }
}

function editResource(resource) {
  document.getElementById("editingResourceId").value = resource._id;
  document.getElementById("resourceProject").value = resource.projectId;
  document.getElementById("resourceName").value = resource.resourceName;
  document.getElementById("resourceType").value = resource.resourceType;
  document.getElementById("quantityAvailable").value =
    resource.quantityAvailable;
  document.getElementById("unitCost").value = resource.unitCost;
  document.getElementById("productivityScore").value =
    resource.productivityScore;

  document.getElementById("resourceSubmitBtn").textContent = "Update Resource";
  document.getElementById("cancelEditBtn").style.display = "block";

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetResourceForm() {
  const form = document.getElementById("resourceForm");
  if (!form) return;

  form.reset();
  document.getElementById("editingResourceId").value = "";
  document.getElementById("resourceSubmitBtn").textContent = "Save Resource";
  document.getElementById("cancelEditBtn").style.display = "none";
}
