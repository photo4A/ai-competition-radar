import { app, BrowserWindow, Menu, shell, nativeTheme } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Official production site — override with RADAR_URL if needed. */
const RADAR_URL =
  process.env.RADAR_URL?.trim() ||
  "https://workspace-beta-sand-54.vercel.app";

const isMac = process.platform === "darwin";

/** @type {BrowserWindow | null} */
let mainWindow = null;

function createWindow() {
  nativeTheme.themeSource = "dark";

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 880,
    minHeight: 640,
    title: "赛讯 Radar",
    backgroundColor: "#010102",
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  mainWindow.loadURL(RADAR_URL);

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

function buildMenu() {
  const template = [
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              { role: "about" },
              { type: "separator" },
              { role: "services" },
              { type: "separator" },
              { role: "hide" },
              { role: "hideOthers" },
              { role: "unhide" },
              { type: "separator" },
              { role: "quit" },
            ],
          },
        ]
      : []),
    {
      label: "赛讯",
      submenu: [
        {
          label: "刷新赛事",
          accelerator: "CmdOrCtrl+R",
          click: () => mainWindow?.webContents.reload(),
        },
        {
          label: "在浏览器打开",
          accelerator: "CmdOrCtrl+Shift+O",
          click: () => shell.openExternal(RADAR_URL),
        },
        { type: "separator" },
        isMac ? { role: "close" } : { role: "quit" },
      ],
    },
    {
      label: "编辑",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "selectAll" },
      ],
    },
    {
      label: "窗口",
      submenu: [{ role: "minimize" }, { role: "zoom" }, { role: "togglefullscreen" }],
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

app.whenReady().then(() => {
  buildMenu();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (!isMac) app.quit();
});
