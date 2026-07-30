const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const startUrl = isDev
    ? 'http://localhost:5173'
    : `file://${path.join(__dirname, '../build/index.html')}`;

  mainWindow.loadURL(startUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});


ipcMain.handle("generate-pdf", async () => {
  const win = BrowserWindow.getFocusedWindow();

  // Ask user where to save
  const { filePath } = await dialog.showSaveDialog({
    title: "Save Payment Advice PDF",
    defaultPath: "Payment_Advice.pdf",
    filters: [{ name: "PDF Files", extensions: ["pdf"] }]
  });

  if (!filePath) return { success: false, message: "Cancelled by user" };

  try {
    const pdfBuffer = await win.webContents.printToPDF({
      pageSize: "A4",
      printBackground: true
    });

    fs.writeFileSync(filePath, pdfBuffer);
    return { success: true, filePath };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
