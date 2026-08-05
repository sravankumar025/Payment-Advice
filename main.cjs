const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");
const fs = require("fs");
const Database = require("better-sqlite3");
const { title } = require("process");
const db = new Database("payment_advice1.db");

let mainWindow;

// --- Schema setup ---
db.prepare(`
CREATE TABLE IF NOT EXISTS advices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  location TEXT,
  partyName TEXT,
  broker TEXT,
  accountNo TEXT,
  adviceNo TEXT,
  date TEXT,
  refNo TEXT,
  outstandingBillNo TEXT,
  receivedDate TEXT,
  paymentMode TEXT,
  chqNo TEXT,
  chqDate TEXT,
  bankName TEXT,
  bankCode TEXT,
  remarks TEXT,
  cashDiscountPercent REAL,
  unloading REAL,
  cashPaid REAL,
  shortage REAL,
  lateLoading REAL,
  rateDiff REAL,
  other1 REAL,
  other2 REAL,
  additionalCharges REAL,
  totalItemAmount REAL,
  totalQualityDiffAmount REAL,
  cashDiscountAmount REAL,
  totalDeductions REAL,
  netAmountIssued REAL
)`).run();

db.prepare(`
CREATE TABLE IF NOT EXISTS items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  adviceId INTEGER,
  qty TEXT,
  rate TEXT,
  netWeight TEXT,
  FOREIGN KEY(adviceId) REFERENCES advices(id)
)`).run();

db.prepare(`
CREATE TABLE IF NOT EXISTS qualityDiffs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  adviceId INTEGER,
  qty TEXT,
  uom TEXT,
  rate TEXT,
  remarks TEXT,
  FOREIGN KEY(adviceId) REFERENCES advices(id)
)`).run();

// --- Save advice handler ---
ipcMain.handle("save-advice", (event, formData) => {
  console.log("Incoming advice data:", formData);
  const requiredFields = ["partyName", "adviceNo", "location"];
  const missing = requiredFields.filter(field => !formData[field] || formData[field].trim() === "");

  if (missing.length > 0) {
    dialog.showErrorBox(
      "Validation Error",
      `Cannot save advice. Missing required fields: ${missing.join(", ")}`
    );
    throw new Error("Validation failed");
  }else {
    // If validation passes, show success info box
    dialog.showMessageBox({
      type: "info",
      title: "Success",
      message: "Advice saved successfully!",
      buttons: ["OK"]
    });
  }

  const result = db.prepare(`
    INSERT INTO advices (
      location, partyName, broker, accountNo, adviceNo, date, refNo,
      outstandingBillNo, receivedDate, paymentMode, chqNo, chqDate,
      bankName, bankCode, remarks, cashDiscountPercent, unloading,
      cashPaid, shortage, lateLoading, rateDiff, other1, other2,
      additionalCharges, totalItemAmount, totalQualityDiffAmount,
      cashDiscountAmount, totalDeductions, netAmountIssued
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `).run(
    formData.location,
    formData.partyName,
    formData.broker,
    formData.accountNo,
    formData.adviceNo,
    formData.date,
    formData.refNo,
    formData.outstandingBillNo,
    formData.receivedDate,
    formData.paymentMode,
    formData.chqNo,
    formData.chqDate,
    formData.bankName,
    formData.bankCode,
    formData.remarks,
    formData.cashDiscountPercent,
    formData.unloading,
    formData.cashPaid,
    formData.shortage,
    formData.lateLoading,
    formData.rateDiff,
    formData.other1,
    formData.other2,
    formData.additionalCharges,
    formData.totalItemAmount,
    formData.totalQualityDiffAmount,
    formData.cashDiscountAmount,
    formData.totalDeductions,
    formData.netAmountIssued
  );

  const adviceId = result.lastInsertRowid;
  console.log("Inserted adviceId:", adviceId);

  if (!adviceId) {
    throw new Error("Parent advice insert failed, no valid ID returned");
  }

  // Insert items (skip empty rows)
  formData.items
    .filter(i => i.qty || i.rate || i.netWeight)
    .forEach(item => {
      db.prepare(`INSERT INTO items (adviceId, qty, rate, netWeight) VALUES (?,?,?,?)`)
        .run(adviceId, item.qty, item.rate, item.netWeight);
    });

  // Insert quality diffs (skip empty rows)
  formData.qualityDiffs
    .filter(qd => qd.qty || qd.rate || qd.remarks)
    .forEach(qd => {
      db.prepare(`INSERT INTO qualityDiffs (adviceId, qty, uom, rate, remarks) VALUES (?,?,?,?,?)`)
        .run(adviceId, qd.qty, qd.uom, qd.rate, qd.remarks);
    });

  return adviceId;
});

// --- Get advice handler ---
ipcMain.handle("get-advice", (event, adviceId) => {
  const advices = db.prepare("SELECT * FROM advices").all();
  const advice = db.prepare("SELECT * FROM advices WHERE id = ?").get(adviceId);
  const items = db.prepare("SELECT * FROM items WHERE adviceId = ?").all(adviceId);
  const qualityDiffs = db.prepare("SELECT * FROM qualityDiffs WHERE adviceId = ?").all(adviceId);

  return { ...advices, items, qualityDiffs };
});

ipcMain.handle("delete-advices", () => {
  try {
    // Delete children first
    db.prepare("DELETE FROM items").run();
    db.prepare("DELETE FROM qualityDiffs").run();

    // Then delete parent
    const result = db.prepare("DELETE FROM advices").run();

    dialog.showMessageBox({
      type: "info",
      title: "Delete Successful",
      message: `Deleted ${result.changes} records from advices.`,
      buttons: ["OK"]
    });

    return { deleted: result.changes };
  } catch (err) {
    console.error("Error deleting advices:", err);
    throw err;
  }

})

// --- Window setup ---
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, "src", "assets", "PA5.ico"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.webContents.session.on('will-download', (event, item, webContents) => {
    // Detect when download completes or gets canceled
    item.once('done', (event, state) => {
      if (state === 'completed') {
        mainWindow.webContents.send('download-status', {
          status: 'success',
          filename: item.getFilename(),
        });
      } else {
        mainWindow.webContents.send('download-status', {
          status: 'cancelled',
          filename: item.getFilename(),
        });
      }
    });
  });

  mainWindow.loadURL('http://localhost:5173');

  const startUrl = isDev
    ? "http://localhost:5173"
    : `file://${path.join(__dirname, "../build/index.html")}`;

  mainWindow.loadURL(startUrl);
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// --- PDF generation handler ---
ipcMain.handle("generate-pdf", async (event, formData) => {
  const { filePath } = await dialog.showSaveDialog({
    title: "Save Payment Advice PDF",
    defaultPath: `Payment_Advice_${formData?.adviceNo || "563"}.pdf`,
    filters: [{ name: "PDF Files", extensions: ["pdf"] }],
  });

  if (!filePath) {
    dialog.showMessageBox({
      type: "info",
      title: "Cancelled",
      message: "PDF save was cancelled by the user.",
      buttons: ["OK"]
    });
    return { success: false, message: "Cancelled by user" };
  }

  const printWindow = new BrowserWindow({
    show: false,
    width: 794,
    height: 1123,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  try {
    const encodedData = encodeURIComponent(JSON.stringify(formData));
    const startUrl = isDev
      ? `http://localhost:5173/#/print-preview?data=${encodedData}`
      : `file://${path.join(__dirname, "../build/index.html")}#/print-preview?data=${encodedData}`;

    await printWindow.loadURL(startUrl);
    await new Promise(resolve => setTimeout(resolve, 300));

    const pdfBuffer = await printWindow.webContents.printToPDF({
      pageSize: "A4",
      printBackground: true,
      marginsType: 1,
    });

    fs.writeFileSync(filePath, pdfBuffer);
    printWindow.close();

    dialog.showMessageBox({
      type: "info",
      title: "PDF Generated",
      message: `Payment Advice PDF saved successfully at:\n${filePath}`,
      buttons: ["OK"]
    });

    return { success: true, filePath };
  } catch (error) {
    if (!printWindow.isDestroyed()) printWindow.close();
    dialog.showErrorBox("PDF Generation Failed", error.message);

    return { success: false, error: error.message };
  }
});
