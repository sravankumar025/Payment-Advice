const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");
const fs = require("fs");
const { Pool } = require("pg");

// Configure PostgreSQL connection pool
const pool = new Pool({
  user: process.env.PGUSER || "postgres",
  host: process.env.PGHOST || "localhost",
  database: process.env.PGDATABASE || "payment_advice_db",
  password: process.env.PGPASSWORD || "Sravan@3025", //
  port: process.env.PGPORT || 5432,
});

let mainWindow;

// --- Schema Setup ---
async function initDb() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS advices (
        id SERIAL PRIMARY KEY,
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
        cashDiscountPercent NUMERIC,
        unloading NUMERIC,
        cashPaid NUMERIC,
        shortage NUMERIC,
        lateLoading NUMERIC,
        rateDiff NUMERIC,
        other1 NUMERIC,
        other2 NUMERIC,
        additionalCharges NUMERIC,
        totalItemAmount NUMERIC,
        totalQualityDiffAmount NUMERIC,
        cashDiscountAmount NUMERIC,
        totalDeductions NUMERIC,
        netAmountIssued NUMERIC
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS items (
        id SERIAL PRIMARY KEY,
        adviceId INTEGER REFERENCES advices(id) ON DELETE CASCADE,
        qty TEXT,
        rate TEXT,
        netWeight TEXT
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS qualityDiffs (
        id SERIAL PRIMARY KEY,
        adviceId INTEGER REFERENCES advices(id) ON DELETE CASCADE,
        qty TEXT,
        uom TEXT,
        rate TEXT,
        remarks TEXT
      )
    `);

    console.log("PostgreSQL Database schema initialized.");
  } catch (err) {
    console.error("Error initializing PostgreSQL database:", err);
  }
}

// Initialize tables on startup
initDb();

// --- Save Advice Handler ---
ipcMain.handle("save-advice", async (event, formData) => {
  console.log("Incoming advice data:", formData);
  const requiredFields = ["partyName", "adviceNo", "location"];
  const missing = requiredFields.filter(
    (field) => !formData[field] || formData[field].trim() === ""
  );

  if (missing.length > 0) {
    dialog.showErrorBox(
      "Validation Error",
      `Cannot save advice. Missing required fields: ${missing.join(", ")}`
    );
    throw new Error("Validation failed");
  }

  const client = await pool.connect();

  try {
    // Start database transaction
    await client.query("BEGIN");

    const insertAdviceQuery = `
      INSERT INTO advices (
        location, partyName, broker, accountNo, adviceNo, date, refNo,
        outstandingBillNo, receivedDate, paymentMode, chqNo, chqDate,
        bankName, bankCode, remarks, cashDiscountPercent, unloading,
        cashPaid, shortage, lateLoading, rateDiff, other1, other2,
        additionalCharges, totalItemAmount, totalQualityDiffAmount,
        cashDiscountAmount, totalDeductions, netAmountIssued
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,
        $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26,
        $27, $28, $29
      ) RETURNING id
    `;

    const adviceValues = [
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
      formData.netAmountIssued,
    ];

    const res = await client.query(insertAdviceQuery, adviceValues);
    const adviceId = res.rows[0].id;
    console.log("Inserted adviceId:", adviceId);

    // Insert items (skip empty rows)
    const validItems = formData.items.filter(
      (i) => i.qty || i.rate || i.netWeight
    );
    for (const item of validItems) {
      await client.query(
        `INSERT INTO items (adviceId, qty, rate, netWeight) VALUES ($1, $2, $3, $4)`,
        [adviceId, item.qty, item.rate, item.netWeight]
      );
    }

    // Insert quality diffs (skip empty rows)
    const validQualityDiffs = formData.qualityDiffs.filter(
      (qd) => qd.qty || qd.rate || qd.remarks
    );
    for (const qd of validQualityDiffs) {
      await client.query(
        `INSERT INTO qualityDiffs (adviceId, qty, uom, rate, remarks) VALUES ($1, $2, $3, $4, $5)`,
        [adviceId, qd.qty, qd.uom, qd.rate, qd.remarks]
      );
    }

    // Commit transaction
    await client.query("COMMIT");

    dialog.showMessageBox({
      type: "info",
      title: "Success",
      message: "Advice saved successfully!",
      buttons: ["OK"],
    });

    return adviceId;
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error saving advice record:", err);
    throw err;
  } finally {
    client.release();
  }
});

// --- Get Advice Handler ---
ipcMain.handle("get-advice", async () => {
  try {
    const advicesRes = await pool.query("SELECT * FROM advices ORDER BY id DESC");
    const itemsRes = await pool.query("SELECT * FROM items");
    const qualityDiffsRes = await pool.query("SELECT * FROM qualityDiffs");

    const advices = advicesRes.rows;
    const items = itemsRes.rows;
    const qualityDiffs = qualityDiffsRes.rows;

    // Map through each advice and nest its corresponding items & qualityDiffs
    const result = advices.map((advice) => ({
      ...advice,
      items: items.filter((i) => i.adviceid === advice.id || i.adviceId === advice.id),
      qualityDiffs: qualityDiffs.filter((q) => q.adviceid === advice.id || q.adviceId === advice.id),
    }));

    return result; // Returns an Array of advice objects directly
  } catch (err) {
    console.error("Error fetching advices:", err);
    throw err;
  }
});

// --- Delete Single Advice Handler ---
ipcMain.handle("delete-advice", async (event, id) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Deleting single advice record.
    // FK CASCADE constraints will handle linked items and qualityDiffs automatically.
    const result = await client.query("DELETE FROM advices WHERE id = $1", [id]);

    await client.query("COMMIT");

    dialog.showMessageBox({
      type: "info",
      title: "Delete Successful",
      message: `Advice record #${id} deleted successfully.`,
      buttons: ["OK"],
    });

    return { success: true, count: result.rowCount };
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error deleting advice record:", err);
    throw err;
  } finally {
    client.release();
  }
});

// --- Delete All Advices Handler ---
ipcMain.handle("delete-advices", async () => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query("DELETE FROM items");
    await client.query("DELETE FROM qualityDiffs");
    const result = await client.query("DELETE FROM advices");

    await client.query("COMMIT");

    dialog.showMessageBox({
      type: "info",
      title: "Delete Successful",
      message: `Deleted ${result.rowCount} records from advices.`,
      buttons: ["OK"],
    });

    return { deleted: result.rowCount };
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error deleting advices:", err);
    throw err;
  } finally {
    client.release();
  }
});

// --- Window Setup ---
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.webContents.session.on(
    "will-download",
    (event, item, webContents) => {
      item.once("done", (event, state) => {
        if (state === "completed") {
          mainWindow.webContents.send("download-status", {
            status: "success",
            filename: item.getFilename(),
          });
        } else {
          mainWindow.webContents.send("download-status", {
            status: "cancelled",
            filename: item.getFilename(),
          });
        }
      });
    }
  );

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
