import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

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

const TrashIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const FilterResetIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
);

export default function PaymentAdviceDashboard() {
    const [advices, setAdvices] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [paymentModeFilter, setPaymentModeFilter] = useState("ALL");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const navigate = useNavigate();

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
                    }
                } catch (error) {
                    console.error("Failed to load records from PostgreSQL:", error);
                }
            }
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

            // 1. Text Search Filter
            const matchesSearch =
                searchTerm === "" ||
                partyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                adviceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                broker.toLowerCase().includes(searchTerm.toLowerCase());

            // 2. Payment Mode Filter
            const matchesMode =
                paymentModeFilter === "ALL" ||
                paymentMode.toUpperCase() === paymentModeFilter.toUpperCase();

            // 3. Date Range Filter
            let matchesDate = true;
            if (fromDate) {
                matchesDate = matchesDate && new Date(adviceDate) >= new Date(fromDate);
            }
            if (toDate) {
                matchesDate = matchesDate && new Date(adviceDate) <= new Date(toDate);
            }

            return matchesSearch && matchesMode && matchesDate;
        });
    }, [advices, searchTerm, paymentModeFilter, fromDate, toDate]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, paymentModeFilter, fromDate, toDate]);

    const metrics = useMemo(() => {
        const totalCount = filteredAdvices.length;
        const totalNetIssued = filteredAdvices.reduce((acc, curr) => acc + (Number(curr.netamountissued || curr.netAmountIssued) || 0), 0);
        const totalDeductions = filteredAdvices.reduce((acc, curr) => acc + (Number(curr.totaldeductions || curr.totalDeductions) || 0), 0);
        const totalCashDiscounts = filteredAdvices.reduce((acc, curr) => acc + (Number(curr.cashdiscountamount || curr.cashDiscountAmount) || 0), 0);

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

    const handleDeleteAdvice = async (id, adviceNo) => {
        const isConfirmed = window.confirm(`Are you sure you want to delete advice "${adviceNo || id}"?`);
        if (!isConfirmed) return;

        if (window.electronAPI && window.electronAPI.deleteAdvice) {
            try {
                await window.electronAPI.deleteAdvice(id);
                setAdvices((prev) => prev.filter((item) => item.id !== id));
            } catch (error) {
                console.error("Failed to delete record:", error);
                alert("Error deleting record from database.");
            }
        }
    };

    const handleExportExcel = () => {
        if (filteredAdvices.length === 0) {
            alert("No data available to export!");
            return;
        }

        const headers = [
            "ID", "Advice No", "Date", "Party Name", "Location", "Broker",
            "Payment Mode", "Bank / Chq No", "Cash Discount (₹)",
            "Total Deductions (₹)", "Net Amount Issued (₹)", "Remarks"
        ];

        const rows = filteredAdvices.map((a) => [
            a.id,
            a.adviceno || a.adviceNo,
            a.date,
            a.partyname || a.partyName,
            a.location,
            a.broker,
            a.paymentmode || a.paymentMode,
            `${a.bankname || a.bankName || ""} (${a.chqno || a.chqNo || "-"})`,
            a.cashdiscountamount || a.cashDiscountAmount || 0,
            a.totaldeductions || a.totalDeductions || 0,
            a.netamountissued || a.netAmountIssued || 0,
            a.remarks || ""
        ]);

        const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Payment Advices");

        XLSX.writeFile(workbook, `Payment_Advices_${new Date().toISOString().slice(0, 10)}.xlsx`);
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 p-6 space-y-6 font-sans">
            <header className="flex items-center justify-between px-6 py-3 text shadow-md">
                <div
                    className="flex items-center space-x-2 cursor-pointer hover:text-blue-400 transition-colors"
                    onClick={() => navigate("/")}
                >
                    <svg xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M3 12l2-2m0 0l7-7 7 7m-9 2v8m4-8v8m5-12l2 2m-2-2v12m-2-2h-4m-4 0H5" />
                    </svg>
                    <h1 className="text-lg font-semibold">Home</h1>
                </div>

                <div>
                    <h1 className="text-xl font-bold tracking-wide">Reports & Dashboard</h1>
                </div>
            </header>

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
                        <DownloadIcon /> Export Excel (.xlsx)
                    </button>
                </div>
            </div>

            {/* Filter Section */}
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

            {/* Table Section */}
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
                                <th className="py-3 px-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                            {paginatedAdvices.length > 0 ? (
                                paginatedAdvices.map((advice) => {
                                    const adviceNo = advice.adviceno || advice.adviceNo;
                                    const partyName = advice.partyname || advice.partyName;
                                    const paymentMode = advice.paymentmode || advice.paymentMode;
                                    const totalDeductions = advice.totaldeductions || advice.totalDeductions;
                                    const netAmountIssued = advice.netamountissued || advice.netAmountIssued;

                                    return (
                                        <tr key={advice.id} className="hover:bg-slate-50/80 transition">
                                            <td className="py-3.5 px-4">
                                                <div className="font-bold text-indigo-600">{adviceNo}</div>
                                                <div className="text-[11px] text-slate-400 mt-0.5">{advice.date}</div>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <div className="font-semibold text-slate-800">{partyName}</div>
                                                <div className="text-[11px] text-slate-500">{advice.location}</div>
                                            </td>
                                            <td className="py-3.5 px-4 font-medium text-slate-600">
                                                {advice.broker || "-"}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span
                                                    className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${paymentMode === "Cheque"
                                                        ? "bg-purple-100 text-purple-700"
                                                        : paymentMode === "NEFT/RTGS" || paymentMode === "Bank Transfer"
                                                            ? "bg-blue-100 text-blue-700"
                                                            : paymentMode === "Cash"
                                                                ? "bg-emerald-100 text-emerald-700"
                                                                : "bg-slate-100 text-slate-700"
                                                        }`}
                                                >
                                                    {paymentMode || "Standard"}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-right font-medium text-rose-600">
                                                ₹{Number(totalDeductions || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="py-3.5 px-4 text-right font-black text-slate-900">
                                                ₹{Number(netAmountIssued || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
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
                                                        onClick={() => handleDeleteAdvice(advice.id, adviceNo)}
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
                                    <td colSpan={7} className="py-12 text-center text-slate-400">
                                        <p className="text-sm font-medium">No matching advice records found</p>
                                        <p className="text-xs mt-1">Try adjusting your search criteria or date filters.</p>
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

            {/* Modal */}
            {selectedAdvice && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-3xl overflow-hidden max-h-[90vh] flex flex-col">
                        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">
                                    Advice Details - {selectedAdvice.adviceno || selectedAdvice.adviceNo}
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Recorded on {selectedAdvice.date} | Party: {selectedAdvice.partyname || selectedAdvice.partyName}
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
                                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Broker</span>
                                    <span className="font-semibold text-slate-800">{selectedAdvice.broker || "N/A"}</span>
                                </div>
                                <div>
                                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Location</span>
                                    <span className="font-semibold text-slate-800">{selectedAdvice.location || "N/A"}</span>
                                </div>
                                <div>
                                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Account No</span>
                                    <span className="font-semibold text-slate-800">{selectedAdvice.accountno || selectedAdvice.accountNo || "N/A"}</span>
                                </div>
                                <div>
                                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Payment Mode</span>
                                    <span className="font-semibold text-indigo-600">{selectedAdvice.paymentmode || selectedAdvice.paymentMode || "N/A"}</span>
                                </div>
                                <div>
                                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Bank Name</span>
                                    <span className="font-semibold text-slate-800">{selectedAdvice.bankname || selectedAdvice.bankName || "N/A"}</span>
                                </div>
                                <div>
                                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Chq / Txn No</span>
                                    <span className="font-semibold text-slate-800">{selectedAdvice.chqno || selectedAdvice.chqNo || "N/A"}</span>
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
                                                    <td className="p-2">{item.netweight || item.netWeight}</td>
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

                            {/* Remarks */}
                            {selectedAdvice.remarks && (
                                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
                                    <span className="font-bold block text-[10px] uppercase">Remarks / Notes:</span>
                                    <p className="mt-0.5">{selectedAdvice.remarks}</p>
                                </div>
                            )}
                        </div>

                        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
                            <div>
                                <span className="text-slate-500 font-semibold">Net Amount Issued:</span>
                                <span className="ml-2 text-base font-black text-slate-900">
                                    ₹{Number(selectedAdvice.netamountissued || selectedAdvice.netAmountIssued || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
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
