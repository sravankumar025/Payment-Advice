import React, { useState, useEffect } from "react";
import {
  Printer,
  FileSpreadsheet,
  RotateCcw,
  Save,
  Trash2,
  Search,
  XCircle,
  Calculator,
  Building2,
  Receipt,
} from "lucide-react";
import * as XLSX from "xlsx";
import html2pdf from "html2pdf.js";
import shalimarLogo from "../Images/shalimarLogo.png";

export default function PaymentAdviceForm() {
  // --- State Management ---
  const [currentTime, setCurrentTime] = useState(new Date());

  // Header & Transaction Info
  const [formData, setFormData] = useState({
    location: "",
    partyName: "",
    broker: "",
    accountNo: "",
    adviceNo: "563",
    date: new Date().toISOString().split("T")[0],
    refNo: "",
    outstandingBillNo: "",
    receivedDate: new Date().toISOString().split("T")[0],
    paymentMode: "DD",
    chqNo: "",
    chqDate: new Date().toISOString().split("T")[0],
    bankName: "",
    bankCode: "",
    remarks: "",
  });

  // Items / Bills Table (5 Rows)
  const [items, setItems] = useState([
    { qty: "", rate: "", netWeight: "" },
    { qty: "", rate: "", netWeight: "" },
    { qty: "", rate: "", netWeight: "" },
    { qty: "", rate: "", netWeight: "" },
    { qty: "", rate: "", netWeight: "" },
  ]);

  // Quality Difference Rows (4 Rows)
  const [qualityDiffs, setQualityDiffs] = useState([
    { qty: "", uom: "Bags", rate: "", remarks: "" },
    { qty: "", uom: "Bags", rate: "", remarks: "" },
    { qty: "", uom: "Bags", rate: "", remarks: "" },
    { qty: "", uom: "Bags", rate: "", remarks: "" },
  ]);

  // Deductions State
  const [deductions, setDeductions] = useState({
    cashDiscountPercent: 4,
    unloading: 0,
    cashPaid: 0,
    shortage: 0,
    lateLoading: 0,
    rateDiff: 0,
    other1: 0,
    other2: 0,
    additionalCharges: 0,
  });

  // Real-time Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // --- Calculations ---
  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const calculateItemAmount = (qty, rate) =>
    (parseFloat(qty) || 0) * (parseFloat(rate) || 0);

  const totalItemAmount = items.reduce(
    (acc, curr) => acc + calculateItemAmount(curr.qty, curr.rate),
    0,
  );
  const totalBags = items.reduce(
    (acc, curr) => acc + (parseFloat(curr.qty) || 0),
    0,
  );

  const calculateQualityAmount = (qty, rate) =>
    (parseFloat(qty) || 0) * (parseFloat(rate) || 0);
  const totalQualityDiffAmount = qualityDiffs.reduce(
    (acc, curr) => acc + calculateQualityAmount(curr.qty, curr.rate),
    0,
  );

  const cashDiscountAmount =
    (totalItemAmount * (parseFloat(deductions.cashDiscountPercent) || 0)) / 100;

  const totalDeductions =
    cashDiscountAmount +
    (parseFloat(deductions.unloading) || 0) +
    (parseFloat(deductions.cashPaid) || 0) +
    (parseFloat(deductions.shortage) || 0) +
    (parseFloat(deductions.lateLoading) || 0) +
    (parseFloat(deductions.rateDiff) || 0) +
    (parseFloat(deductions.other1) || 0) +
    (parseFloat(deductions.other2) || 0) +
    totalQualityDiffAmount;

  const netAmountIssued =
    totalItemAmount +
    (parseFloat(deductions.additionalCharges) || 0) -
    totalDeductions;

  // --- Handlers ---
  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset the form?")) {
      window.location.reload();
    }
  };

  const handleExportExcel = () => {
    const exportData = [
      { Category: "Advice No", Value: formData.adviceNo },
      { Category: "Party Name", Value: formData.partyName },
      { Category: "Date", Value: formData.date },
      { Category: "Total Item Amount", Value: totalItemAmount.toFixed(2) },
      { Category: "Total Deductions", Value: totalDeductions.toFixed(2) },
      { Category: "Net Amount Issued", Value: netAmountIssued.toFixed(2) },
    ];

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payment Advice");
    XLSX.writeFile(workbook, `Payment_Advice_${formData.adviceNo}.xlsx`);
  };

  const handleExportPDF = () => {
    const element = document.getElementById("printable-area");
    const opt = {
      margin: 0.5,
      filename: `Payment_Advice_${formData.adviceNo}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "landscape" },
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans select-none">
      <header className="sticky top-0 z-50 w-full bg-white px-8 py-4 flex flex-col md:flex-row justify-between items-center shadow-md border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div>
            <img
              src={shalimarLogo}
              alt="Company Logo"
              style={{ height: "50px", widht: "auto" }}
            />
          </div>
        </div>

        <div className="text-center">
          <p className="text-lg text-black font-medium">
            Payment Advice Management System
          </p>
        </div>

        <div className="mt-2 md:mt-0 text-right">
          <div className="text-xs text-black">Current Session</div>
          <div className="text-sm font-mono font-medium text-emerald-400">
            {currentTime.toLocaleDateString()} |{" "}
            {currentTime.toLocaleTimeString()}
          </div>
        </div>
      </header>
      <main className="flex-1 p-6">
        <div
          id="printable-area"
          className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden"
        >
          <div className="p-6 space-y-6">
            {/* SECTION 1: PARTY & TRANSACTION DETAILS */}
            <section className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                <Receipt className="w-4 h-4 text-indigo-600" /> Transaction Overview
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Location
                  </label>
                  <select
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="">Select Location</option>
                    <option value="Main Warehouse">Main Warehouse</option>
                    <option value="Mill Unit 1">Mill Unit 1</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Party Name
                  </label>
                  <input
                    type="text"
                    value={formData.partyName}
                    onChange={(e) =>
                      setFormData({ ...formData, partyName: e.target.value })
                    }
                    placeholder="Enter Party Name"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Broker
                  </label>
                  <select
                    value={formData.broker}
                    onChange={(e) =>
                      setFormData({ ...formData, broker: e.target.value })
                    }
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="">Select Broker</option>
                    <option value="Broker A">Broker A</option>
                    <option value="Broker B">Broker B</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    A/c No.
                  </label>
                  <input
                    type="text"
                    value={formData.accountNo}
                    onChange={(e) =>
                      setFormData({ ...formData, accountNo: e.target.value })
                    }
                    className="w-full px-3 py-1.5 bg-amber-50 border border-amber-300 text-amber-900 font-semibold rounded-md text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                {/* Row 2 */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    No.
                  </label>
                  <input
                    type="text"
                    value={formData.adviceNo}
                    onChange={(e) =>
                      setFormData({ ...formData, adviceNo: e.target.value })
                    }
                    className="w-full px-3 py-1.5 bg-slate-200 border border-slate-300 font-bold text-slate-700 rounded-md text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Ref No.
                  </label>
                  <input
                    type="text"
                    value={formData.refNo}
                    onChange={(e) =>
                      setFormData({ ...formData, refNo: e.target.value })
                    }
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Outstanding Bill No.
                  </label>
                  <input
                    type="text"
                    value={formData.outstandingBillNo}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        outstandingBillNo: e.target.value,
                      })
                    }
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
            </section>

            {/* SECTION 2: GRID LAYOUT (ITEMS TABLE & DEDUCTIONS) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* ITEM DETAILS TABLE (2 Columns Wide) */}
              <div className="lg:col-span-2 space-y-6">
                {/* Item Entry Table */}
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
                    <span className="text-xs font-bold uppercase text-slate-600 tracking-wider">
                      Bill Item Breakdown
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      Total Bags:{" "}
                      <strong className="text-indigo-600">{totalBags}</strong>
                    </span>
                  </div>
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                      <tr>
                        <th className="p-2 border-r">#</th>
                        <th className="p-2 border-r">Qty</th>
                        <th className="p-2 border-r">Rate</th>
                        <th className="p-2 border-r">Amount</th>
                        <th className="p-2 border-r">Net Weight</th>
                        <th className="p-2">Net Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((row, idx) => {
                        const amount = calculateItemAmount(row.qty, row.rate);
                        return (
                          <tr
                            key={idx}
                            className="border-b border-slate-100 hover:bg-slate-50"
                          >
                            <td className="p-2 border-r font-medium text-slate-400 text-center">
                              {idx + 1}
                            </td>
                            <td className="p-1 border-r">
                              <input
                                type="number"
                                value={row.qty}
                                onChange={(e) =>
                                  handleItemChange(idx, "qty", e.target.value)
                                }
                                className="w-full px-2 py-1 border border-slate-200 rounded text-right focus:outline-indigo-500"
                              />
                            </td>
                            <td className="p-1 border-r">
                              <input
                                type="number"
                                value={row.rate}
                                onChange={(e) =>
                                  handleItemChange(idx, "rate", e.target.value)
                                }
                                className="w-full px-2 py-1 border border-slate-200 rounded text-right focus:outline-indigo-500"
                              />
                            </td>
                            <td className="p-2 border-r bg-amber-50 font-semibold text-right text-amber-900">
                              {amount.toFixed(2)}
                            </td>
                            <td className="p-1 border-r">
                              <input
                                type="number"
                                value={row.netWeight}
                                onChange={(e) =>
                                  handleItemChange(
                                    idx,
                                    "netWeight",
                                    e.target.value,
                                  )
                                }
                                className="w-full px-2 py-1 border border-slate-200 rounded text-right focus:outline-indigo-500"
                              />
                            </td>
                            <td className="p-2 bg-amber-50 font-semibold text-right text-amber-900">
                              {amount.toFixed(2)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot className="bg-slate-100 font-bold">
                      <tr>
                        <td
                          colSpan={3}
                          className="p-2 text-right border-r text-slate-600"
                        >
                          Total Item Amount:
                        </td>
                        <td className="p-2 border-r text-right bg-amber-100 text-amber-900">
                          {totalItemAmount.toFixed(2)}
                        </td>
                        <td className="p-2 border-r"></td>
                        <td className="p-2 text-right bg-amber-100 text-amber-900">
                          {totalItemAmount.toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Quality Difference Table */}
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <div className="bg-slate-100 px-4 py-2 border-b border-slate-200">
                    <span className="text-xs font-bold uppercase text-slate-600 tracking-wider">
                      Quality Difference Adjustments
                    </span>
                  </div>
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                      <tr>
                        <th className="p-2 border-r">#</th>
                        <th className="p-2 border-r">Qty</th>
                        <th className="p-2 border-r">UOM</th>
                        <th className="p-2 border-r">Rate</th>
                        <th className="p-2 border-r">Amount</th>
                        <th className="p-2">Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {qualityDiffs.map((row, idx) => {
                        const qAmount = calculateQualityAmount(
                          row.qty,
                          row.rate,
                        );
                        return (
                          <tr key={idx} className="border-b border-slate-100">
                            <td className="p-2 border-r text-center text-slate-400">
                              {idx + 1}
                            </td>
                            <td className="p-1 border-r">
                              <input
                                type="number"
                                value={row.qty}
                                onChange={(e) => {
                                  const q = [...qualityDiffs];
                                  q[idx].qty = e.target.value;
                                  setQualityDiffs(q);
                                }}
                                className="w-full px-2 py-1 border border-slate-200 rounded text-right"
                              />
                            </td>
                            <td className="p-1 border-r">
                              <select
                                value={row.uom}
                                onChange={(e) => {
                                  const q = [...qualityDiffs];
                                  q[idx].uom = e.target.value;
                                  setQualityDiffs(q);
                                }}
                                className="w-full px-1 py-1 border border-slate-200 rounded bg-white"
                              >
                                <option value="Bags">Bags</option>
                                <option value="Kg">Kg</option>
                                <option value="Qtl">Qtl</option>
                              </select>
                            </td>
                            <td className="p-1 border-r">
                              <input
                                type="number"
                                value={row.rate}
                                onChange={(e) => {
                                  const q = [...qualityDiffs];
                                  q[idx].rate = e.target.value;
                                  setQualityDiffs(q);
                                }}
                                className="w-full px-2 py-1 border border-slate-200 rounded text-right"
                              />
                            </td>
                            <td className="p-2 border-r bg-amber-50 font-semibold text-right text-amber-900">
                              {qAmount.toFixed(2)}
                            </td>
                            <td className="p-1">
                              <input
                                type="text"
                                value={row.remarks}
                                onChange={(e) => {
                                  const q = [...qualityDiffs];
                                  q[idx].remarks = e.target.value;
                                  setQualityDiffs(q);
                                }}
                                className="w-full px-2 py-1 border border-slate-200 rounded"
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* DEDUCTIONS & SUMMARY COLUMN */}
              <div className="space-y-6">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
                  <h3 className="text-xs font-bold uppercase text-slate-600 tracking-wider flex items-center gap-1">
                    <Calculator className="w-4 h-4 text-indigo-600" />{" "}
                    Deductions Breakup
                  </h3>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-slate-600">Cash Discount (%)</span>
                      <div className="flex items-center gap-1 w-32">
                        <input
                          type="number"
                          value={deductions.cashDiscountPercent}
                          onChange={(e) =>
                            setDeductions({
                              ...deductions,
                              cashDiscountPercent: e.target.value,
                            })
                          }
                          className="w-12 px-1 py-1 border rounded text-right"
                        />
                        <input
                          type="text"
                          readOnly
                          value={cashDiscountAmount.toFixed(2)}
                          className="w-full px-2 py-1 bg-amber-50 border border-amber-300 font-semibold text-right rounded"
                        />
                      </div>
                    </div>

                    {[
                      "Unloading",
                      "Cash Paid",
                      "Shortage",
                      "Late Loading",
                      "Rate Difference",
                      "Other 1",
                      "Other 2",
                    ].map((fieldKey) => {
                      const camelKey = fieldKey
                        .replace(/\s+/g, "")
                        .replace(/^(.)/, (c) => c.toLowerCase());
                      return (
                        <div
                          key={fieldKey}
                          className="flex items-center justify-between"
                        >
                          <span className="text-slate-600">{fieldKey}</span>
                          <input
                            type="number"
                            value={deductions[camelKey]}
                            onChange={(e) =>
                              setDeductions({
                                ...deductions,
                                [camelKey]: e.target.value,
                              })
                            }
                            className="w-32 px-2 py-1 border border-slate-300 rounded text-right focus:outline-indigo-500"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* FINAL FINANCIAL SUMMARY */}
                <div className="bg-indigo-900 text-white p-4 rounded-lg space-y-3 shadow-md">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-200">
                    Financial Summary
                  </h3>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center border-b border-indigo-800 pb-1">
                      <span className="text-indigo-200">
                        Additional Charges:
                      </span>
                      <input
                        type="number"
                        value={deductions.additionalCharges}
                        onChange={(e) =>
                          setDeductions({
                            ...deductions,
                            additionalCharges: e.target.value,
                          })
                        }
                        className="w-28 px-2 py-0.5 text-black rounded text-right font-semibold"
                      />
                    </div>

                    <div className="flex justify-between items-center border-b border-indigo-800 pb-1">
                      <span className="text-indigo-200">Total Deductions:</span>
                      <span className="font-bold text-rose-300">
                        ₹ {totalDeductions.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-2 text-sm">
                      <span className="font-bold uppercase tracking-wider text-emerald-400">
                        Net Amount Issued:
                      </span>
                      <span className="text-lg font-black text-emerald-400">
                        ₹ {netAmountIssued.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* REMARKS INPUT */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Remarks / Notes
              </label>
              <input
                type="text"
                value={formData.remarks}
                onChange={(e) =>
                  setFormData({ ...formData, remarks: e.target.value })
                }
                placeholder="Add payment advice remarks..."
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* BOTTOM BUTTON BAR */}
        </div>
      </main>
      <footer className="sticky bottom-0 z-50 bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-wrap gap-3 justify-between items-center">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg text-sm transition"
            >
              <RotateCcw className="w-4 h-4" /> Reset
            </button>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleExportExcel}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-sm shadow transition"
              >
                <FileSpreadsheet className="w-4 h-4" /> Excel Export
              </button>

              <button
                onClick={handleExportPDF}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-sm shadow transition"
              >
                <Printer className="w-4 h-4" /> Print PDF
              </button>

              <button className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-lg text-sm transition">
                <Search className="w-4 h-4" /> Search
              </button>

              <button className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg text-sm shadow transition">
                <Trash2 className="w-4 h-4" /> Delete
              </button>

              <button className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm shadow transition">
                <Save className="w-4 h-4" /> Save Record
              </button>
            </div>
          </footer>
    </div>
  );
}
