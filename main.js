const { app, BrowserWindow } = require("electron");

const path = require("path");
const dotenv = require("dotenv");

// load env correctly
dotenv.config({
  path: path.join(process.resourcesPath, ".env"),
});

const { startServer } = require("./server");

let mainWindow;
let serverInstance;

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1100,
    minHeight: 700,
    autoHideMenuBar: true,
    title: "Infrastructure Resource Optimization System",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  try {
    serverInstance = await startServer(5000);

    await mainWindow.loadURL("http://127.0.0.1:5000");
  } catch (error) {
    mainWindow.loadURL(`
      data:text/html,
      <div style="font-family:Arial;padding:30px">
        <h2>App failed to start</h2>
        <p>${error.message}</p>
      </div>
    `);
  }
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (serverInstance) {
    serverInstance.close();
  }

  if (process.platform !== "darwin") {
    app.quit();
  }
});
