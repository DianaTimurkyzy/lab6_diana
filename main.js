const { app, BrowserWindow } = require("electron");
const { exec } = require("child_process");
const http = require("http");
const path = require("path");

let serverProcess;

const waitForServer = (callback) => {
    const checkServer = () => {
        http
            .get("http://localhost:3000", (res) => {
                if (res.statusCode === 200) {
                    console.log("[INFO] Express server is running on http://localhost:3000");
                    callback();
                }
            })
            .on("error", () => {
                console.log("[INFO] Waiting for Express server to start...");
                setTimeout(checkServer, 500);
            });
    };
    checkServer();
};

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    win.loadURL("http://localhost:3000");

    win.webContents.openDevTools();
};

app.on("ready", () => {
    serverProcess = exec("npm start", (error) => {
        if (error) {
            console.error("[ERROR] Failed to start Express server:", error);
            app.quit();
        }
    });

    waitForServer(() => {
        createWindow();
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        if (serverProcess) {
            serverProcess.kill();
        }
        app.quit();
    }
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});