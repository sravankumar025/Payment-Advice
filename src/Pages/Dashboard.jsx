import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import RtgsTransactionReports from "./RtgsTransactionReports";
import DeductionsReport from "./DeductionsReports";
const SearchIcon = () => (
  <svg
    className="w-4 h-4 text-slate-400"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const CalendarIcon = () => (
  <svg
    className="w-4 h-4 text-slate-400"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const DownloadIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
    />
  </svg>
);

const EyeIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

const TrashIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

const FilterResetIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    />
  </svg>
);

const MenuIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);

const DashboardIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M3 12l2-2m0 0l7-7 7 7m-9 2v8m4-8v8m5-12l2 2m-2-2v12m-2-2h-4m-4 0H5"
    />
  </svg>
);

const BankIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
    />
  </svg>
);

const DeductionIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z"
    />
  </svg>
);

const PlusIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 4v16m8-8H4"
    />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M15 19l-7-7 7-7"
    />
  </svg>
);

const ChevronRightIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9 5l7 7-7 7"
    />
  </svg>
);

const exportToExcelCSV = (filename, headers, rows) => {
  const formatValue = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const csvContent = [
    headers.map(formatValue).join(","),
    ...rows.map((row) => row.map(formatValue).join(",")),
  ].join("\n");

  const blob = new Blob(["\ufeff" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `${filename}_${new Date().toISOString().slice(0, 10)}.csv`,
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default function PaymentAdviceDashboard() {
  const [advices, setAdvices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentModeFilter, setPaymentModeFilter] = useState("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const navigate = useNavigate();
  // Sidebar & View Navigation State - CLOSED BY DEFAULT
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState("dashboard"); // "dashboard" | "rtgs" | "deductions"

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Selected Advice Modal State
  const [selectedAdvice, setSelectedAdvice] = useState(null);

  useEffect(() => {
    const fetchAdvicesFromDB = async () => {
      if (window.electronAPI && window.electronAPI.getAdvice) {
        try {
          const data = await window.electronAPI.getAdvice();
          if (Array.isArray(data) && data.length > 0) {
            setAdvices(data);
            return;
          }
        } catch (error) {
          console.error("Failed to load records from PostgreSQL:", error);
        }
      }

      // Fallback sample data for testing reports and dashboard
      setAdvices([
        {
          id: 1,
          adviceNo: "ADV-1001",
          date: "2026-08-01",
          partyName: "Reliance Industries",
          location: "Mumbai",
          broker: "Apex Brokers",
          paymentMode: "RTGS",
          bankName: "HDFC Bank",
          accountNo: "501002345678",
          chqNo: "RTGS981234",
          cashDiscountAmount: 1200,
          totalDeductions: 3500,
          netAmountIssued: 145000,
          remarks: "Processed via RTGS online batch",
        },
        {
          id: 2,
          adviceNo: "ADV-1002",
          date: "2026-08-03",
          partyName: "Tata Consultancy Services",
          location: "Pune",
          broker: "Global Logistics",
          paymentMode: "NEFT",
          bankName: "ICICI Bank",
          accountNo: "000401567890",
          chqNo: "NEFT883120",
          cashDiscountAmount: 800,
          totalDeductions: 1800,
          netAmountIssued: 98200,
          remarks: "Deduction for freight quality diff",
        },
        {
          id: 3,
          adviceNo: "ADV-1003",
          date: "2026-08-05",
          partyName: "Adani Enterprises",
          location: "Ahmedabad",
          broker: "Star Traders",
          paymentMode: "Cheque",
          bankName: "State Bank of India",
          accountNo: "30210045611",
          chqNo: "CHQ-445102",
          cashDiscountAmount: 2500,
          totalDeductions: 5000,
          netAmountIssued: 210000,
          remarks: "Physical cheque handed over",
        },
        {
          id: 4,
          adviceNo: "ADV-1004",
          date: "2026-08-08",
          partyName: "Infosys Ltd",
          location: "Bengaluru",
          broker: "Karnataka Agros",
          paymentMode: "RTGS",
          bankName: "Axis Bank",
          accountNo: "918020045512",
          chqNo: "RTGS774123",
          cashDiscountAmount: 3000,
          totalDeductions: 6200,
          netAmountIssued: 320000,
          remarks: "Priority RTGS settlement",
        },
        {
          id: 5,
          adviceNo: "ADV-1005",
          date: "2026-08-10",
          partyName: "Larsen & Toubro",
          location: "Delhi",
          broker: "National Capital Agencies",
          paymentMode: "DD",
          bankName: "Punjab National Bank",
          accountNo: "110200114002",
          chqNo: "DD-901234",
          cashDiscountAmount: 500,
          totalDeductions: 1200,
          netAmountIssued: 75000,
          remarks: "Demand Draft issued",
        },
        {
          id: 6,
          adviceNo: "ADV-1006",
          date: "2026-08-11",
          partyName: "Mahindra & Mahindra",
          location: "Nagpur",
          broker: "Central Freight Ltd",
          paymentMode: "NEFT",
          bankName: "Kotak Bank",
          accountNo: "771200445123",
          chqNo: "NEFT992314",
          cashDiscountAmount: 1800,
          totalDeductions: 4200,
          netAmountIssued: 185000,
          remarks: "Quarterly trade rebate applied",
        },
      ]);
    };
    fetchAdvicesFromDB();
  }, []);

  const filteredAdvices = useMemo(() => {
    return advices.filter((item) => {
      const partyName = item.partyname || item.partyName || "";
      const adviceNo = item.adviceno || item.adviceNo || "";
      const location = item.location || "";
      const broker = item.broker || "";
      const paymentMode = item.paymentmode || item.paymentMode || "";
      const adviceDate = item.date || "";

      // 1. View-based Specific Filtering
      if (
        activeView === "rtgs" &&
        !["RTGS", "NEFT", "NEFT/RTGS", "BANK TRANSFER"].includes(
          paymentMode.toUpperCase(),
        )
      ) {
        return false;
      }

      // 2. Text Search Filter
      const matchesSearch =
        searchTerm === "" ||
        partyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        adviceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        broker.toLowerCase().includes(searchTerm.toLowerCase());

      // 3. Payment Mode Filter
      const matchesMode =
        paymentModeFilter === "ALL" ||
        paymentMode.toUpperCase() === paymentModeFilter.toUpperCase();

      // 4. Date Range Filter
      let matchesDate = true;
      if (fromDate) {
        matchesDate = matchesDate && new Date(adviceDate) >= new Date(fromDate);
      }
      if (toDate) {
        matchesDate = matchesDate && new Date(adviceDate) <= new Date(toDate);
      }

      return matchesSearch && matchesMode && matchesDate;
    });
  }, [advices, searchTerm, paymentModeFilter, fromDate, toDate, activeView]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, paymentModeFilter, fromDate, toDate, activeView]);

  const metrics = useMemo(() => {
    const totalCount = filteredAdvices.length;
    const totalNetIssued = filteredAdvices.reduce(
      (acc, curr) =>
        acc + (Number(curr.netamountissued || curr.netAmountIssued) || 0),
      0,
    );
    const totalDeductions = filteredAdvices.reduce(
      (acc, curr) =>
        acc + (Number(curr.totaldeductions || curr.totalDeductions) || 0),
      0,
    );
    const totalCashDiscounts = filteredAdvices.reduce(
      (acc, curr) =>
        acc + (Number(curr.cashdiscountamount || curr.cashDiscountAmount) || 0),
      0,
    );

    return { totalCount, totalNetIssued, totalDeductions, totalCashDiscounts };
  }, [filteredAdvices]);

  const totalPages = Math.ceil(filteredAdvices.length / pageSize) || 1;
  const paginatedAdvices = useMemo(() => {
    const startIdx = (currentPage - 1) * pageSize;
    return filteredAdvices.slice(startIdx, startIdx + pageSize);
  }, [filteredAdvices, currentPage, pageSize]);

  const navigationItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <DashboardIcon />,
      route: "/dashboard",
      description: "Overview & All Advices",
    },
    {
      id: "rtgs",
      label: "RTGS Reports",
      icon: <BankIcon />,
      route: "/rtgs-reports",
      description: "Bank Transfers & RTGS Logs",
    },
    {
      id: "deductions",
      label: "Deduction Reports",
      icon: <DeductionIcon />,
      route: "/deduction-reports",
      description: "Discounts & Deductions Summary",
    },
  ];

  const handleNavigation = (item) => {
    setActiveView(item.id);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setPaymentModeFilter("ALL");
    setFromDate("");
    setToDate("");
  };

  const handleDeleteAdvice = async (id, adviceNo) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete advice "${adviceNo || id}"?`,
    );
    if (!isConfirmed) return;

    if (window.electronAPI && window.electronAPI.deleteAdvice) {
      try {
        await window.electronAPI.deleteAdvice(id);
        setAdvices((prev) => prev.filter((item) => item.id !== id));
      } catch (error) {
        console.error("Failed to delete record:", error);
      }
    } else {
      setAdvices((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleExportExcel = () => {
    if (filteredAdvices.length === 0) {
      alert("No data available to export!");
      return;
    }

    const headers = [
      "ID",
      "Advice No",
      "Date",
      "Party Name",
      "Location",
      "Broker",
      "Payment Mode",
      "Bank Name",
      "Account / Chq No",
      "Cash Discount (INR)",
      "Total Deductions (INR)",
      "Net Amount Issued (INR)",
      "Remarks",
    ];

    const rows = filteredAdvices.map((a) => [
      a.id,
      a.adviceno || a.adviceNo,
      a.date,
      a.partyname || a.partyName,
      a.location,
      a.broker,
      a.paymentmode || a.paymentMode,
      a.bankname || a.bankName || "-",
      `${a.accountno || a.accountNo || "-"} (${a.chqno || a.chqNo || "-"})`,
      a.cashdiscountamount || a.cashDiscountAmount || 0,
      a.totaldeductions || a.totalDeductions || 0,
      a.netamountissued || a.netAmountIssued || 0,
      a.remarks || "",
    ]);

    exportToExcelCSV(
      `Payment_Advices_${activeView.toUpperCase()}`,
      headers,
      rows,
    );
  };

  return (
    <div className="h-screen bg-slate-100 flex font-sans text-slate-800 relative w-full overflow-hidden">
      {/* BACKDROP OVERLAY WHEN SIDEBAR IS OPEN */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-30 transition-opacity"
          title="Click to close sidebar"
        />
      )}

      {/* OVERLAY COLLAPSIBLE SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 h-full bg-slate-900 text-slate-300 transition-all duration-300 ease-in-out flex flex-col z-40 shadow-2xl ${
          isSidebarOpen ? "w-64" : "w-12"
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-3 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center space-x-3 overflow-hidden">
            <span className="font-bold text-base text-white truncate tracking-wide">
              Payment Advice
            </span>
          </div>

          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition ${
              !isSidebarOpen ? "hidden md:block" : ""
            }`}
            title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            {isSidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 py-4 px-2 space-y-1.5 overflow-y-auto overflow-x-hidden">
          {isSidebarOpen && (
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider px-3 mb-2">
              Main Reports
            </p>
          )}

          {navigationItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  handleNavigation(item);
                  if (window.innerWidth < 768) {
                    setIsSidebarOpen(false);
                  }
                }}
                className={`w-full flex items-center gap-3 px-1.5 py-2 rounded-xl font-medium text-xs transition group relative ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "hover:bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <div
                  className={`shrink-0 ${isActive ? "text-white" : "text-slate-400 group-hover:text-white"}`}
                >
                  {item.icon}
                </div>

                {isSidebarOpen && (
                  <div className="text-left truncate flex-1">
                    <div className="font-semibold text-xs leading-none">
                      {item.label}
                    </div>
                    <div
                      className={`text-[10px] mt-1 truncate ${isActive ? "text-indigo-200" : "text-slate-500"}`}
                    >
                      {item.description}
                    </div>
                  </div>
                )}

                {!isSidebarOpen && (
                  <div className="absolute left-full ml-3 px-2.5 py-1 bg-slate-800 text-white text-xs rounded-md shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition duration-200 z-50 whitespace-nowrap">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}

          {/* Placeholder for future links */}
          {isSidebarOpen && (
            <div className="pt-6">
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider px-3 mb-2">
                System
              </p>
              <button
                onClick={() =>
                  alert(
                    "Future Report Section - You can easily add more routes here!",
                  )
                }
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 border border-dashed border-slate-800 transition"
              >
                <PlusIcon />
                <span>Add Custom Report</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT AREA WITH FIXED LEFT MARGIN SO CONTENT NEVER COMPRESSES */}
      <div className="flex-1 flex flex-col h-full min-w-0 max-w-full overflow-hidden ml-16">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-6 shadow-sm sticky top-0 z-20">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <DashboardIcon />
              <span
                onClick={() => navigate("/")}
                className="text-sm font-semibold text-slate-700 hidden sm:inline cursor-pointer"
              >
                Home
              </span>
            </div>
            <span className="text-slate-300 hidden sm:inline">/</span>
            <h1 className="text-sm sm:text-base font-bold text-slate-800 capitalize truncate max-w-[180px] sm:max-w-none">
              Payment Advice Dashboard
            </h1>
          </div>
        </header>

        {/* Main Body Content */}
        <main className="p-4 sm:p-6 flex-1 overflow-y-auto max-w-full">
          {activeView !== "dashboard" ? (
            <div className="w-full min-h-[500px] bg-white rounded-2xl border border-dashed border-slate-300 shadow-sm flex flex-col p-8 text-center text-slate-400">
              <div className="flex-1 w-full h-full overflow-auto text-sm font-semibold text-slate-600 capitalize">
                {activeView === "rtgs" ? (
                  <RtgsTransactionReports />
                ) : (
                  <DeductionsReport />
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Top Action / Title Bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Payment Advice Dashboard
                  </h1>
                  <p className="text-xs text-slate-500 mt-1">
                    Manage, filter and export all party payment advice logs.
                  </p>
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

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                    Filter Records
                  </h2>
                  {(searchTerm ||
                    paymentModeFilter !== "ALL" ||
                    fromDate ||
                    toDate) && (
                    <button
                      onClick={handleResetFilters}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 transition"
                    >
                      <FilterResetIcon /> Clear Filters
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Search
                    </label>
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

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Payment Mode
                    </label>
                    <select
                      value={paymentModeFilter}
                      onChange={(e) => setPaymentModeFilter(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    >
                      <option value="ALL">All Modes</option>
                      <option value="CHEQUE">Cheque</option>
                      <option value="DD">DD</option>
                      <option value="NEFT">NEFT</option>
                      <option value="RTGS">RTGS</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      From Date
                    </label>
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

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      To Date
                    </label>
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

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100/70 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                        <th className="py-3 px-4">Advice No / Date</th>
                        <th className="py-3 px-4">Party Name & Location</th>
                        <th className="py-3 px-4">Broker / Bank</th>
                        <th className="py-3 px-4">Payment Mode</th>
                        <th className="py-3 px-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                      {paginatedAdvices.length > 0 ? (
                        paginatedAdvices.map((advice) => {
                          const adviceNo = advice.adviceno || advice.adviceNo;
                          const partyName =
                            advice.partyname || advice.partyName;
                          const paymentMode =
                            advice.paymentmode || advice.paymentMode;
                          const bankName = advice.bankname || advice.bankName;

                          return (
                            <tr
                              key={advice.id}
                              className="hover:bg-slate-50/80 transition"
                            >
                              <td className="py-3.5 px-4">
                                <div className="font-bold text-indigo-600">
                                  {adviceNo}
                                </div>
                                <div className="text-[11px] text-slate-400 mt-0.5">
                                  {advice.date}
                                </div>
                              </td>
                              <td className="py-3.5 px-4">
                                <div className="font-semibold text-slate-800">
                                  {partyName}
                                </div>
                                <div className="text-[11px] text-slate-500">
                                  {advice.location}
                                </div>
                              </td>
                              <td className="py-3.5 px-4 font-medium text-slate-600">
                                <div>{advice.broker || "-"}</div>
                                {bankName && (
                                  <div className="text-[10px] text-slate-400">
                                    {bankName}
                                  </div>
                                )}
                              </td>
                              <td className="py-3.5 px-4">
                                <span
                                  className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                    paymentMode === "Cheque"
                                      ? "bg-purple-100 text-purple-700"
                                      : [
                                            "RTGS",
                                            "NEFT",
                                            "NEFT/RTGS",
                                            "BANK TRANSFER",
                                          ].includes(
                                            (paymentMode || "").toUpperCase(),
                                          )
                                        ? "bg-blue-100 text-blue-700"
                                        : paymentMode === "Cash"
                                          ? "bg-emerald-100 text-emerald-700"
                                          : "bg-slate-100 text-slate-700"
                                  }`}
                                >
                                  {paymentMode || "Standard"}
                                </span>
                              </td>

                              <td className="py-3.5 px-4 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => setSelectedAdvice(advice)}
                                    className="p-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg text-slate-600 transition"
                                    title="View Full Details"
                                  >
                                    <EyeIcon />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteAdvice(advice.id, adviceNo)
                                    }
                                    className="p-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 rounded-lg text-slate-600 transition"
                                    title="Delete Advice"
                                  >
                                    <TrashIcon />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td
                            colSpan={5}
                            className="py-12 text-center text-slate-400"
                          >
                            <p className="text-sm font-medium">
                              No matching advice records found
                            </p>
                            <p className="text-xs mt-1">
                              Try adjusting your search criteria or date
                              filters.
                            </p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
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
                      Showing{" "}
                      {filteredAdvices.length > 0
                        ? (currentPage - 1) * pageSize + 1
                        : 0}{" "}
                      -{" "}
                      {Math.min(currentPage * pageSize, filteredAdvices.length)}{" "}
                      of {filteredAdvices.length}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-semibold hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      Previous
                    </button>
                    <span className="px-3 font-semibold text-slate-700">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-semibold hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {selectedAdvice && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-3xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Advice Details -{" "}
                  {selectedAdvice.adviceno || selectedAdvice.adviceNo}
                </h3>
                <p className="text-xs text-slate-500">
                  Recorded on {selectedAdvice.date} | Party:{" "}
                  {selectedAdvice.partyname || selectedAdvice.partyName}
                </p>
              </div>
              <button
                onClick={() => setSelectedAdvice(null)}
                className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg text-xs transition"
              >
                ✕ Close
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">
                    Broker
                  </span>
                  <span className="font-semibold text-slate-800">
                    {selectedAdvice.broker || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">
                    Location
                  </span>
                  <span className="font-semibold text-slate-800">
                    {selectedAdvice.location || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">
                    Account No
                  </span>
                  <span className="font-semibold text-slate-800">
                    {selectedAdvice.accountno ||
                      selectedAdvice.accountNo ||
                      "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">
                    Payment Mode
                  </span>
                  <span className="font-semibold text-indigo-600">
                    {selectedAdvice.paymentmode ||
                      selectedAdvice.paymentMode ||
                      "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">
                    Bank Name
                  </span>
                  <span className="font-semibold text-slate-800">
                    {selectedAdvice.bankname ||
                      selectedAdvice.bankName ||
                      "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">
                    Chq / Txn No
                  </span>
                  <span className="font-semibold text-slate-800">
                    {selectedAdvice.chqno || selectedAdvice.chqNo || "N/A"}
                  </span>
                </div>
              </div>

              {/* Line Items */}
              <div>
                <h4 className="font-bold text-slate-800 mb-2">
                  Item Line Details
                </h4>
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
                          <td className="p-2">
                            {item.netweight || item.netWeight}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-slate-400 italic">
                    No line items recorded.
                  </p>
                )}
              </div>

              {/* Quality Differences */}
              {selectedAdvice.qualityDiffs &&
                selectedAdvice.qualityDiffs.length > 0 && (
                  <div>
                    <h4 className="font-bold text-slate-800 mb-2">
                      Quality Difference Adjustments
                    </h4>
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

              {/* Remarks */}
              {selectedAdvice.remarks && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
                  <span className="font-bold block text-[10px] uppercase">
                    Remarks / Notes:
                  </span>
                  <p className="mt-0.5">{selectedAdvice.remarks}</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
              <div>
                <span className="text-slate-500 font-semibold">
                  Net Amount Issued:
                </span>
                <span className="ml-2 text-base font-black text-slate-900">
                  ₹
                  {Number(
                    selectedAdvice.netamountissued ||
                      selectedAdvice.netAmountIssued ||
                      0,
                  ).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
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
