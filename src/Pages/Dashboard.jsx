import React, { useState, useEffect, useMemo } from "react";

const SearchIcon = () => (
  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const DownloadIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const EyeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const FilterResetIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const WalletIcon = () => (
  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const TrendingDownIcon = () => (
  <svg className="w-6 h-6 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
  </svg>
);

const FileTextIcon = () => (
  <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const TagIcon = () => (
  <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
  </svg>
);

const SAMPLE_ADVICES = [
  {
    id: 1,
    adviceNo: "PA-2026-001",
    partyName: "Bhaskara Logistics & Mills",
    location: "Hyderabad",
    broker: "Srinivas Agencies",
    accountNo: "ACC-908122",
    date: "2026-08-01",
    receivedDate: "2026-08-02",
    paymentMode: "Cheque",
    chqNo: "CHQ-889021",
    bankName: "HDFC Bank",
    cashDiscountAmount: 4500.0,
    totalDeductions: 12800.0,
    netAmountIssued: 683712.0,
    totalItemAmount: 692012.0,
    remarks: "Regular monthly clearance",
    items: [
      { id: 101, qty: "50", rate: "12000", netWeight: "600" },
      { id: 102, qty: "20", rate: "4600", netWeight: "92" }
    ],
    qualityDiffs: [
      { id: 201, qty: "2", uom: "Bags", rate: "2500", remarks: "Moisture penalty" }
    ]
  },
  {
    id: 2,
    adviceNo: "PA-2026-002",
    partyName: "Sri Venkateswara Traders",
    location: "Vijayawada",
    broker: "Rao & Sons",
    accountNo: "ACC-552190",
    date: "2026-08-03",
    receivedDate: "2026-08-03",
    paymentMode: "NEFT/RTGS",
    chqNo: "N-9812451",
    bankName: "State Bank of India",
    cashDiscountAmount: 2200.0,
    totalDeductions: 5400.0,
    netAmountIssued: 312000.0,
    totalItemAmount: 315200.0,
    remarks: "Payment against invoice #4092",
    items: [{ id: 103, qty: "25", rate: "12600", netWeight: "315" }],
    qualityDiffs: []
  },
  {
    id: 3,
    adviceNo: "PA-2026-003",
    partyName: "Global Agro Inputs Ltd",
    location: "Guntur",
    broker: "Direct",
    accountNo: "ACC-110098",
    date: "2026-08-04",
    receivedDate: "2026-08-04",
    paymentMode: "Cash",
    chqNo: "-",
    bankName: "-",
    cashDiscountAmount: 1500.0,
    totalDeductions: 3200.0,
    netAmountIssued: 145000.0,
    totalItemAmount: 146700.0,
    remarks: "Hand cash payment for spot delivery",
    items: [{ id: 104, qty: "10", rate: "14670", netWeight: "100" }],
    qualityDiffs: []
  },
  {
    id: 4,
    adviceNo: "PA-2026-004",
    partyName: "Royal Grain Processors",
    location: "Kakinada",
    broker: "Krishna Associates",
    accountNo: "ACC-663211",
    date: "2026-08-05",
    receivedDate: "2026-08-05",
    paymentMode: "Bank Transfer",
    chqNo: "TXN-776212",
    bankName: "ICICI Bank",
    cashDiscountAmount: 6200.0,
    totalDeductions: 18500.0,
    netAmountIssued: 920500.0,
    totalItemAmount: 932800.0,
    remarks: "Bulk consignment 12",
    items: [{ id: 105, qty: "80", rate: "11660", netWeight: "932.8" }],
    qualityDiffs: [
      { id: 202, qty: "5", uom: "MTS", rate: "2400", remarks: "Shortage adjustment" }
    ]
  },
  {
    id: 5,
    adviceNo: "PA-2026-005",
    partyName: "Balaji Agro Food Products",
    location: "Hyderabad",
    broker: "Srinivas Agencies",
    accountNo: "ACC-908122",
    date: "2026-08-06",
    receivedDate: "2026-08-06",
    paymentMode: "Cheque",
    chqNo: "CHQ-990123",
    bankName: "Axis Bank",
    cashDiscountAmount: 3100.0,
    totalDeductions: 8900.0,
    netAmountIssued: 485000.0,
    totalItemAmount: 490800.0,
    remarks: "Urgent dispatch settlement",
    items: [{ id: 106, qty: "40", rate: "12270", netWeight: "490.8" }],
    qualityDiffs: []
  }
];

export default function PaymentAdviceDashboard() {
  const [advices, setAdvices] = useState(SAMPLE_ADVICES);
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentModeFilter, setPaymentModeFilter] = useState("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Selected Advice Modal State
  const [selectedAdvice, setSelectedAdvice] = useState(null);

  useEffect(() => {
    const fetchAdvicesFromDB = async () => {
      if (window.electronAPI && window.electronAPI.getAllAdvices) {
        try {
          const data = await window.electronAPI.getAllAdvices();
          if (Array.isArray(data) && data.length > 0) {
            setAdvices(data);
          }
        } catch (error) {
          console.error("Failed to load records from SQLite:", error);
        }
      }
    };
    fetchAdvicesFromDB();
  }, []);

  const filteredAdvices = useMemo(() => {
    return advices.filter((item) => {
      // 1. Text Search Filter (Party Name, Advice No, Location, Broker)
      const matchesSearch =
        searchTerm === "" ||
        (item.partyName && item.partyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.adviceNo && item.adviceNo.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.location && item.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.broker && item.broker.toLowerCase().includes(searchTerm.toLowerCase()));

      // 2. Payment Mode Filter
      const matchesMode =
        paymentModeFilter === "ALL" ||
        (item.paymentMode && item.paymentMode.toUpperCase() === paymentModeFilter.toUpperCase());

      // 3. Date Range Filter (FROM & TO)
      let matchesDate = true;
      if (fromDate) {
        matchesDate = matchesDate && new Date(item.date) >= new Date(fromDate);
      }
      if (toDate) {
        matchesDate = matchesDate && new Date(item.date) <= new Date(toDate);
      }

      return matchesSearch && matchesMode && matchesDate;
    });
  }, [advices, searchTerm, paymentModeFilter, fromDate, toDate]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, paymentModeFilter, fromDate, toDate]);

  const metrics = useMemo(() => {
    const totalCount = filteredAdvices.length;
    const totalNetIssued = filteredAdvices.reduce((acc, curr) => acc + (Number(curr.netAmountIssued) || 0), 0);
    const totalDeductions = filteredAdvices.reduce((acc, curr) => acc + (Number(curr.totalDeductions) || 0), 0);
    const totalCashDiscounts = filteredAdvices.reduce((acc, curr) => acc + (Number(curr.cashDiscountAmount) || 0), 0);

    return { totalCount, totalNetIssued, totalDeductions, totalCashDiscounts };
  }, [filteredAdvices]);

  const totalPages = Math.ceil(filteredAdvices.length / pageSize) || 1;
  const paginatedAdvices = useMemo(() => {
    const startIdx = (currentPage - 1) * pageSize;
    return filteredAdvices.slice(startIdx, startIdx + pageSize);
  }, [filteredAdvices, currentPage, pageSize]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setPaymentModeFilter("ALL");
    setFromDate("");
    setToDate("");
  };

  const handleExportExcel = () => {
    if (filteredAdvices.length === 0) {
      alert("No data available to export!");
      return;
    }

    // CSV Headers
    const headers = [
      "ID",
      "Advice No",
      "Date",
      "Party Name",
      "Location",
      "Broker",
      "Payment Mode",
      "Bank / Chq No",
      "Cash Discount (₹)",
      "Total Deductions (₹)",
      "Net Amount Issued (₹)",
      "Remarks"
    ];

    // Format Rows
    const rows = filteredAdvices.map((a) => [
      a.id,
      `"${a.adviceNo || ""}"`,
      `"${a.date || ""}"`,
      `"${a.partyName || ""}"`,
      `"${a.location || ""}"`,
      `"${a.broker || ""}"`,
      `"${a.paymentMode || ""}"`,
      `"${a.bankName || ""} (${a.chqNo || "-"})"`,
      a.cashDiscountAmount || 0,
      a.totalDeductions || 0,
      a.netAmountIssued || 0,
      `"${a.remarks || ""}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Payment_Advices_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-6 space-y-6 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Payment Advice Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-sm hover:shadow transition"
          >
            <DownloadIcon /> Export Excel (.csv)
          </button>
        </div>
      </div>

      {}

      {}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            Filter Records
          </h2>
          {(searchTerm || paymentModeFilter !== "ALL" || fromDate || toDate) && (
            <button
              onClick={handleResetFilters}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 transition"
            >
              <FilterResetIcon /> Clear Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search Box */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Search</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Party name, Advice #, Location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
              <div className="absolute left-3 top-2.5">
                <SearchIcon />
              </div>
            </div>
          </div>

          {/* Payment Mode Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Payment Mode</label>
            <select
              value={paymentModeFilter}
              onChange={(e) => setPaymentModeFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            >
              <option value="ALL">All Modes</option>
              <option value="CHEQUE">Cheque</option>
              <option value="NEFT/RTGS">NEFT / RTGS</option>
              <option value="CASH">Cash</option>
              <option value="BANK TRANSFER">Bank Transfer</option>
              <option value="UPI">UPI</option>
            </select>
          </div>

          {/* FROM Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">From Date</label>
            <div className="relative">
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
              <div className="absolute left-3 top-2.5">
                <CalendarIcon />
              </div>
            </div>
          </div>

          {/* TO Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">To Date</label>
            <div className="relative">
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
              <div className="absolute left-3 top-2.5">
                <CalendarIcon />
              </div>
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Advice No / Date</th>
                <th className="py-3 px-4">Party Name & Location</th>
                <th className="py-3 px-4">Broker</th>
                <th className="py-3 px-4">Payment Mode</th>
                <th className="py-3 px-4 text-right">Deductions (₹)</th>
                <th className="py-3 px-4 text-right">Net Amount (₹)</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {paginatedAdvices.length > 0 ? (
                paginatedAdvices.map((advice) => (
                  <tr key={advice.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-indigo-600">{advice.adviceNo}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{advice.date}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{advice.partyName}</div>
                      <div className="text-[11px] text-slate-500">{advice.location}</div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-600">
                      {advice.broker || "-"}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          advice.paymentMode === "Cheque"
                            ? "bg-purple-100 text-purple-700"
                            : advice.paymentMode === "NEFT/RTGS" || advice.paymentMode === "Bank Transfer"
                            ? "bg-blue-100 text-blue-700"
                            : advice.paymentMode === "Cash"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {advice.paymentMode || "Standard"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-medium text-rose-600">
                      ₹{Number(advice.totalDeductions || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-slate-900">
                      ₹{Number(advice.netAmountIssued || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => setSelectedAdvice(advice)}
                        className="p-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg text-slate-600 transition"
                        title="View Full Details"
                      >
                        <EyeIcon />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <p className="text-sm font-medium">No matching advice records found</p>
                    <p className="text-xs mt-1">Try adjusting your search criteria or date filters.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span className="ml-2 text-slate-400">
              Showing {filteredAdvices.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} -{" "}
              {Math.min(currentPage * pageSize, filteredAdvices.length)} of {filteredAdvices.length}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-semibold hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Previous
            </button>
            <span className="px-3 font-semibold text-slate-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-semibold hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {}
      {selectedAdvice && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-3xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Advice Details - {selectedAdvice.adviceNo}
                </h3>
                <p className="text-xs text-slate-500">
                  Recorded on {selectedAdvice.date} | Party: {selectedAdvice.partyName}
                </p>
              </div>
              <button
                onClick={() => setSelectedAdvice(null)}
                className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg text-xs transition"
              >
                ✕ Close
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
              {/* Key Particulars Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Broker</span>
                  <span className="font-semibold text-slate-800">{selectedAdvice.broker || "N/A"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Location</span>
                  <span className="font-semibold text-slate-800">{selectedAdvice.location || "N/A"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Account No</span>
                  <span className="font-semibold text-slate-800">{selectedAdvice.accountNo || "N/A"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Payment Mode</span>
                  <span className="font-semibold text-indigo-600">{selectedAdvice.paymentMode || "N/A"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Bank Name</span>
                  <span className="font-semibold text-slate-800">{selectedAdvice.bankName || "N/A"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Chq / Txn No</span>
                  <span className="font-semibold text-slate-800">{selectedAdvice.chqNo || "N/A"}</span>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <h4 className="font-bold text-slate-800 mb-2">Item Line Details</h4>
                {selectedAdvice.items && selectedAdvice.items.length > 0 ? (
                  <table className="w-full text-left border border-slate-200 rounded-lg overflow-hidden">
                    <thead className="bg-slate-100 text-[10px] uppercase font-bold text-slate-600">
                      <tr>
                        <th className="p-2">Qty</th>
                        <th className="p-2">Rate (₹)</th>
                        <th className="p-2">Net Weight</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedAdvice.items.map((item, index) => (
                        <tr key={index}>
                          <td className="p-2">{item.qty}</td>
                          <td className="p-2">₹{item.rate}</td>
                          <td className="p-2">{item.netWeight}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-slate-400 italic">No line items recorded.</p>
                )}
              </div>

              {/* Quality Differences */}
              {selectedAdvice.qualityDiffs && selectedAdvice.qualityDiffs.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-800 mb-2">Quality Difference Adjustments</h4>
                  <table className="w-full text-left border border-slate-200 rounded-lg overflow-hidden">
                    <thead className="bg-slate-100 text-[10px] uppercase font-bold text-slate-600">
                      <tr>
                        <th className="p-2">Qty</th>
                        <th className="p-2">UOM</th>
                        <th className="p-2">Rate (₹)</th>
                        <th className="p-2">Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedAdvice.qualityDiffs.map((qd, index) => (
                        <tr key={index}>
                          <td className="p-2">{qd.qty}</td>
                          <td className="p-2">{qd.uom}</td>
                          <td className="p-2">₹{qd.rate}</td>
                          <td className="p-2">{qd.remarks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Remarks Section */}
              {selectedAdvice.remarks && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
                  <span className="font-bold block text-[10px] uppercase">Remarks / Notes:</span>
                  <p className="mt-0.5">{selectedAdvice.remarks}</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
              <div>
                <span className="text-slate-500 font-semibold">Net Amount Issued:</span>
                <span className="ml-2 text-base font-black text-slate-900">
                  ₹{Number(selectedAdvice.netAmountIssued || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <button
                onClick={() => setSelectedAdvice(null)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
