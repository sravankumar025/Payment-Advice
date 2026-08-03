const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const fs = require('fs');
const Database = require("better-sqlite3");
const db = new Database("payment_advice.db");

let mainWindow;

db.prepare(`CREATE TABLE IF NOT EXISTS advice(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  adviceNo TEXT,
  partyName TEXT
  )`).run();


ipcMain.handle('save-advice', (event, formData) => {
   console.log("Received in main:", formData); 
  const indertAdvice = db.prepare(`
    INSERT INTO advice (adviceNo,partyName) VALUES (?, ?)
    `);

  const result = indertAdvice.run(formData.adviceNo, formData.partyName);
  return result.lastInsertRowid;
});

ipcMain.handle('get-advices', (event) => {
  try {
    const stmt = db.prepare(`SELECT * FROM advice ORDER BY id DESC`);
    const rows = stmt.all(); // returns array of objects
    return rows;
  } catch (err) {
    console.error("Error in get-advices:", err);
    throw err; 
  }
})

ipcMain.handle('delete-null-advices', (event) => {
  const stmt = db.prepare(`
    DELETE FROM advice
  `);
  const result = stmt.run();
  return result.changes; // number of rows deleted
});

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
    // mainWindow.webContents.openDevTools();
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

    await new Promise(resolve => setTimeout(resolve, 300));


    const pdfBuffer = await printWindow.webContents.printToPDF({
      pageSize: "A4",
      printBackground: true,
      marginsType: 1
    });

    fs.writeFileSync(filePath, pdfBuffer);
    printWindow.close();

    return { success: true, filePath };
  } catch (error) {
    if (!printWindow.isDestroyed()) printWindow.close();
    return { success: false, error: error.message };
  }
});
