const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 1000,
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

ipcMain.handle("generate-pdf", async (event, formData) => {
  // 1. Show Save Dialog
  const { filePath } = await dialog.showSaveDialog({
    title: "Save Payment Advice PDF",
    defaultPath: `Payment_Advice_${formData?.adviceNo || "563"}.pdf`,
    filters: [{ name: "PDF Files", extensions: ["pdf"] }]
  });

  if (!filePath) return { success: false, message: "Cancelled by user" };

  // 2. Create a hidden window for isolated A4 rendering
  const printWindow = new BrowserWindow({
    show: false, // Keep invisible
    width: 794,  // Exact A4 width at 96 DPI (210mm)
    height: 1123, // Exact A4 height at 96 DPI (297mm)
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  try {
    // Pass form data via URL query parameters to the print route
    const encodedData = encodeURIComponent(JSON.stringify(formData));
    const startUrl = isDev
      ? `http://localhost:5173/#/print-preview?data=${encodedData}`
      : `file://${path.join(__dirname, '../build/index.html')}#/print-preview?data=${encodedData}`;

    await printWindow.loadURL(startUrl);

    // Wait briefly for React components & web fonts to paint
    await new Promise(resolve => setTimeout(resolve, 300));

    // 3. Generate clean vector PDF from the isolated route
    const pdfBuffer = await printWindow.webContents.printToPDF({
      pageSize: "A4",
      printBackground: true,
      marginsType: 1 // Fixed typo: 'marginsType' with an 's'
    });

    fs.writeFileSync(filePath, pdfBuffer);
    printWindow.close(); // Clean up hidden window

    return { success: true, filePath };
  } catch (error) {
    if (!printWindow.isDestroyed()) printWindow.close();
    return { success: false, error: error.message };
  }
});
