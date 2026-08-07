import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
import { useReactToPrint } from "react-to-print";
import html2pdf from "html2pdf.js";
import shalimarLogo from "../Images/shalimarLogo.png";
import PrintableInvoice from "./PrintableInvoice";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useNavigate } from "react-router-dom";

export default function PaymentAdviceForm() {
  // --- State Management ---
  const [currentTime, setCurrentTime] = useState(new Date());
  const [advice, setAdvices] = useState([]);
  const navigate = useNavigate();
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
    paymentMode: "",
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
    cashDiscountPercent: 0,
    unloading: 0,
    cashPaid: 0,
    shortage: 0,
    lateLoading: 0,
    rateDiff: 0,
    other1: 0,
    other2: 0,
    additionalCharges: 0,
  });

  useEffect(() => {
    if (window.electronAPI && window.electronAPI.onDownloadStatus) {
      const removeListener = window.electronAPI.onDownloadStatus(
        ({ status, filename }) => {
          if (status === "success") {
            toast.success(`PDF downloaded successfully!`, {
              position: "top-right",
              autoClose: 2000,
            });
          } else if (status === "cancelled") {
            toast.info("Download canceled", {
              position: "top-right",
              autoClose: 2000,
            });
          }
        },
      );

      return () => removeListener();
    }
  }, []);

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

  /**PDF Export */
  const invoiceData = {
    ...formData,
    ...deductions,
    items,
    qualityDiffs,
    totalItemAmount,
    totalQualityDiffAmount,
    cashDiscountAmount,
    totalDeductions,
    netAmountIssued,
  };

  const contentRef = useRef(null);

  const handleDownloadPdf = async () => {
    const element = document.getElementById("invoice");
    if (!element) {
      console.error("Invoice element not found");
      return;
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      width: element.offsetWidth,
      height: element.offsetHeight,
    });
    const imgData = canvas.toDataURL("image/png");

    // Create PDF
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("Payment_Advice_Custom.pdf");
  };

  const handleSubmitData = () => {
    window.electronAPI
      .saveAdvice(invoiceData)
      .then((id) => {
        console.log("Data Saved Successfully");
      })
      .catch((err) => {
        console.log("error");
      });
  };

  const handleDeleteData = () => {
    window.electronAPI
      .deleteAdvices()
      .then((count) => {
        console.log(`Deleted ${count} records`);
      })
      .then((rows) => setAdvices(rows))
      .catch((err) => {
        console.error("Error deleting null records:", err);
      });
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans select-none">
      <header className="sticky top-0 z-50 w-full bg-white px-4 py-2 flex flex-col md:flex-row justify-between items-center shadow-md border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div>
            <img
              src={shalimarLogo}
              alt="Company Logo"
              style={{ height: "40px", width: "auto" }}
            />
          </div>
        </div>

        <div className="text-center">
          <p className="text-xm text-black font-medium">
            Payment Advice Manager
          </p>
        </div>

        <div className="flex justify-between mt-2 md:mt-0 text-right gap-3">
          <div>
            <div className="text-xs text-black">Current Session</div>
            <div className="text-sm font-mono font-medium text-emerald-400">
              {currentTime.toLocaleDateString("en-GB")} |{" "}
              {currentTime.toLocaleTimeString()}
            </div>
          </div>
          <div className="mt-0 cursor-pointer">
            <svg
              onClick={()=> navigate("/reports")}
              xmlns="http://www.w3.org/2000/svg" width="34" height="34"
              viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
          </div>
        </div>
      </header>

      <main className="flex-1 p-12">
        <div
          id="printable-area"
          className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden"
        >
          <div className="p-6 space-y-6">
            {/* SECTION 1: PARTY & TRANSACTION DETAILS */}
            <section className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                <Receipt className="w-4 h-4 text-indigo-600" /> Transaction
                Overview
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="w-74">
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Location
                  </label>
                  <input
                    list="location-list"
                    className="w-full border border-slate-350 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                    placeholder="Type or select Location..."
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                  />
                  <datalist id="location-list" value={formData.location}>
                    <option value="Hyderabad" />
                    <option value="Chennai" />
                  </datalist>
                </div>

                <div className="w-74">
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Party Name
                  </label>
                  <input
                    list="party-list"
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                    placeholder="Type or select party..."
                    onChange={(e) =>
                      setFormData({ ...formData, partyName: e.target.value })
                    }
                  />
                  <datalist id="party-list" value={formData.partyName}>
                    <option value="Shalimar Roller Flour Mill" />
                    <option value="National Traders" />
                    <option value="Super Grain Suppliers" />
                    <option value="Apex Food Products" />
                  </datalist>
                </div>

                <div className="w-74">
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Broker Name
                  </label>
                  <input
                    list="Broker-list"
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                    placeholder="Type or select broker..."
                    onChange={(e) =>
                      setFormData({ ...formData, broker: e.target.value })
                    }
                  />
                  <datalist id="Broker-list" value={formData.broker}>
                    <option value="Broker 1" />
                    <option value="Broker 2" />
                  </datalist>
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
                    className="w-full px-3 py-1 bg-amber-50 border border-amber-300 text-amber-900 font-semibold rounded-md text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
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

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Received Date
                  </label>
                  <input
                    type="date"
                    value={formData.receivedDate}
                    onChange={(e) =>
                      setFormData({ ...formData, receivedDate: e.target.value })
                    }
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
            </section>

            <section className="grid grid-cols-3 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Payment Mode
                </label>
                <select
                  value={formData.paymentMode}
                  onChange={(e) =>
                    setFormData({ ...formData, paymentMode: e.target.value })
                  }
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="">Select</option>
                  <option value="DD">DD</option>
                  <option value="Cheque">Cheque</option>
                  <option value="RTGS">RTGS</option>
                  <option value="NEFT">NEFT</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Chq/DD No.
                </label>
                <input
                  type="number"
                  value={formData.chqNo}
                  onChange={(e) =>
                    setFormData({ ...formData, chqNo: e.target.value })
                  }
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.chqDate}
                  onChange={(e) =>
                    setFormData({ ...formData, chqDate: e.target.value })
                  }
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-4 col-span-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={formData.bankName}
                    onChange={(e) =>
                      setFormData({ ...formData, bankName: e.target.value })
                    }
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Bank Code
                  </label>
                  <input
                    type="text"
                    value={formData.bankCode}
                    onChange={(e) =>
                      setFormData({ ...formData, bankCode: e.target.value })
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
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white-200">
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
                      <span className="font-bold text-white">
                        ₹ {totalDeductions.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-2 text-sm">
                      <span className="text-xs font-bold uppercase text-white">
                        Net Amount Issued:
                      </span>
                      <span className="text-xl font-black text-white font-mono">
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
          <footer className="z-50 bg-slate-50 px-3 py-2 border-t border-slate-200 flex flex-wrap gap-3 justify-between items-center">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg text-xs transition"
            >
              <RotateCcw className="w-4 h-4" /> Reset
            </button>

            <div className="flex flex-wrap gap-2">
              {/* <button
                onClick={handleExportExcel}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-sm shadow transition"
              >
                <FileSpreadsheet className="w-4 h-4" /> Excel Export
              </button> */}

              <button
                onClick={handleDownloadPdf}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs shadow transition"
              >
                <Printer className="w-4 h-4" /> Print PDF
              </button>

              <button className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-lg text-xs transition">
                <Search className="w-4 h-4" /> Search
              </button>

              <button
                onClick={handleDeleteData}
                className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg text-xs shadow transition"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>

              <button
                onClick={handleSubmitData}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs shadow transition"
              >
                <Save className="w-4 h-4" /> Save Record
              </button>
            </div>
          </footer>
        </div>

        <div
          id="invoice"
          style={{
            position: "absolute",
            top: "-9999px",
            left: "-9999px",
            visibility: "visible",
          }}
        >
          <div ref={contentRef}>
            <PrintableInvoice data={invoiceData} />
          </div>
        </div>
      </main>
      <ToastContainer />
    </div>
  );
}
