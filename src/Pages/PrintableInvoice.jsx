import React from "react";
import shalimarLogo from "../Images/shalimarLogo.png";

const PrintableInvoice = React.forwardRef(({ data = {} }, ref) => {
  // Safe extraction with default fallback values
  const adviceNo = data.adviceNo || "";
  const refNo = data.refNo || "";
  const date = data.date || "";
  const partyName = data.partyName || "";
  const partyLocation = data.location || "";
  const billNo = data.outstandingBillNo || "";
  const receivedDate = data.receivedDate || "";
  const rtgsNo = data.chqNo || "";
  const rtgsDate = data.chqDate || "";
  const bankNameAndAcc = `${data.bankCode || ""}${data.bankCode && data.accountNo ? " , A/c: " : ""}${data.accountNo || ""}`;
  const amountRs = (data.netAmountIssued || 0).toFixed(2);
  const totalBills = data.items ? data.items.filter((i) => i.qty && i.rate).length : 0;
  const cashDiscountPercent = data.cashDiscountPercent || 0;
  const cashDiscountAmount = (data.cashDiscountAmount || 0).toFixed(2);
  const unloading = (parseFloat(data.unloading) || 0).toFixed(2);
  const cashPaid = (parseFloat(data.cashPaid) || 0).toFixed(2);
  const shortage = (parseFloat(data.shortage) || 0).toFixed(2);
  const lateLoading = (parseFloat(data.lateLoading) || 0).toFixed(2);
  const rateDiff = (parseFloat(data.rateDiff) || 0).toFixed(2);
  const other1 = (parseFloat(data.other1) || 0).toFixed(2);
  const other2 = (parseFloat(data.other2) || 0).toFixed(2);

  // Quality Difference Summary
  const qualityDiffItems = (data.qualityDiffs || []).filter((q) => q.qty && q.rate);
  const qualityDiffText = qualityDiffItems.length > 0
    ? qualityDiffItems.map((q) => `${q.qty} ${q.uom} x ${q.rate}`).join(", ")
    : "-";
  const qualityDiffAmount = (data.totalQualityDiffAmount || 0).toFixed(2);

  // Bill Items Breakdown
  const tableItems = (data.items || [])
    .filter((item) => item.qty || item.rate)
    .map((item, idx) => {
      const qty = parseFloat(item.qty) || 0;
      const rate = parseFloat(item.rate) || 0;
      const amount = qty * rate;
      const netWt = parseFloat(item.netWeight) || 0;
      return {
        sno: idx + 1,
        qty: qty,
        rate: rate.toFixed(2),
        amount: amount.toFixed(2),
        netWt: netWt.toFixed(2),
        netAmt: amount.toFixed(2),
      };
    });

  const totalAmount = (data.totalItemAmount || 0).toFixed(2);
  const tdsAmount = "0.00"; // Can be linked if added to deductions form
  const lessDeductions = (data.totalDeductions || 0).toFixed(2);
  const netAmount = (data.netAmountIssued || 0).toFixed(2);
  const brokerName = data.broker || "";

  return (
    <div>
      {/* Outer A4 Page Container */}
      <div
        ref={ref}
        style={{ width: "210mm", height: "297mm", margin: "0 auto", boxSizing: "border-box" }}
        className="bg-white text font-sans shadow-lg relative box-sizing flex flex-col justify-between origin-top"
      >
        <div style={{ margin: "10px" }} className="border border-black p-3 h-full flex flex-col justify-between text-[11px] leading-snug">
          <div>
            <div className="relative mb-2">
              <div className="text-xs">No. {adviceNo}</div>

              {/* Center Company Branding */}
              <div className="text-center">
                <div className="inline-flex items-center gap-3">
                  <div className="text-left">
                    <p className="text-[11px] font-bold tracking-widest text-[#002D62] uppercase py-2">PAYMENT ADVICE</p>
                    <img src={shalimarLogo} height="65px" width="150px" alt="Company Logo" />
                  </div>
                </div>
                <p className="text-[9.5px] font-bold text-slate-700 mt-1 pb-1 border-b border-slate-300">
                  15-1-503/A/9, ASHOK MARKET, SIDDIAMBER BAZAR, HYDERABAD - 12. [A.P]
                </p>
              </div>

              {/* Right Side Contact Info */}
              <div className="absolute top-0 right-0 text-[10px] text-black space-y-0.5 font-medium text-right">
                <div className="flex items-center justify-end gap-1">
                  <span>Phone: 24741736</span>
                </div>
                <p>24745058</p>
                <p>24614929</p>
                <div className="flex items-center justify-end gap-1">
                  <span>Email: shalimar_srfm@rediffmail.com</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between font-bold text-[13px] mb-1">
              <div>Ref. No. {refNo}</div>
              <div>Date : {date}</div>
            </div>

            <div className="mb-2">
              <p className="font-bold text-[13px]">To,</p>
              <div className="flex items-start gap-2 pl-1 mt-0.5">
                <div>
                  <p className="font-bold text-[13px] text-slate-900">
                    Party's Name & Address :
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className="uppercase text-[12px] font-semibold">
                    <span className="inline-block align-middle border-b border-slate-400 w-[150mm] pb-1">
                      {partyName}
                    </span>
                  </p>
                  <p className="uppercase text-[12px] font-semibold">
                    <span className="inline-block align-middle border-b border-slate-400 w-[150mm] pb-1">
                      {partyLocation}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Sub & Received Box */}
            <div className="border border-black rounded-md flex justify-between items-center font-bold text-[12.5px] mb-4 px-2 pt-0 pb-2">
              <div className="flex items-center">Sub: Your outstanding Bill No. <span className="ml-4 font-extrabold">{billNo}</span></div>
              <div className="flex items-center">Received on dated <span className="ml-4 font-extrabold">{receivedDate}</span></div>
            </div>

            {/* Covering Letter Box */}
            <div className="border border-dashed border-black rounded-md pt-0 px-2 pb-2 mb-2 text-[13px] leading-relaxed">
              <p className="font-bold">Dear Sir,</p>
              <div className="pl-4 space-y-1">
                <p>
                  Please find enclosed herewith {data.paymentMode || "Chq/DD"} No. <span className="inline-block align-middle border-b border-slate-400 font-semibold px-2 pb-0.5">{rtgsNo}</span>
                  Dated <span className="inline-block align-middle border-b border-slate-400 font-semibold px-2 pb-0.5">{rtgsDate}</span>
                  drawn on <span className="inline-block align-middle border-b border-slate-400 font-semibold px-2 pb-0.5">{bankNameAndAcc}</span> in your favour
                  for Rs. <span className="inline-block align-middle border-b border-slate-400 font-semibold px-2 pb-0.5">{amountRs}</span> towards full and final/part payment as per the details as under.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-2 mb-2">
              {/* Left Column: Deductions Breakdown */}
              <div className="col-span-5 border border-black p-2 flex flex-col justify-between text-[13px]">
                <div className="space-y-1">
                  <p className="font-bold">1) Total of <span className="inline-block align-middle border-b border-slate-400 font-semibold px-2 pb-0.5">{totalBills}</span> Bills.</p>
                  <p className="font-bold">2) LESS</p>

                  <div className="pl-3 space-y-0.5">
                    <div className="flex justify-between">
                      <span>a) Cash Discount ({cashDiscountPercent} %)</span>
                      <span className="font-mono">: {cashDiscountAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>b) Unloading</span>
                      <span className="font-mono">: {unloading}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>c) Cash Paid</span>
                      <span className="font-mono">: {cashPaid}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>d) Shortage</span>
                      <span className="font-mono">: {shortage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>e) Late Loading</span>
                      <span className="font-mono">: {lateLoading}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>f) Rate Difference</span>
                      <span className="font-mono">: {rateDiff}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>g) Other 1</span>
                      <span className="font-mono">: {other1}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>h) Other 2</span>
                      <span className="font-mono">: {other2}</span>
                    </div>
                  </div>

                  <div className="pt-1">
                    <p className="font-bold">3) Quality Difference</p>
                    <div className="flex justify-between pl-3 mt-0.5 font-medium">
                      <span>{qualityDiffText}</span>
                      <span className="font-mono">: {qualityDiffAmount}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Table & Summary Cards */}
              <div className="col-span-7 flex flex-col justify-between border border-slate-200 overflow-hidden">
                {/* Table */}
                <div>
                  <table className="w-full text-center text-[13px] border border-collapse border-black">
                    <thead>
                      <tr className="text-black font-bold border border-black">
                        <th className="p-1 border border-black">Sno</th>
                        <th className="p-1 border border-black">Qty</th>
                        <th className="p-1 border border-black">Rate</th>
                        <th className="p-1 border border-black">Amount</th>
                        <th className="p-1 border border-black">Net Wt</th>
                        <th className="p-1 border border-black">Net Amt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {tableItems.map((item, idx) => (
                        <tr key={idx} className="font-medium text-slate-800 border border-black">
                          <td className="p-1 border border-black">{item.sno}.</td>
                          <td className="p-1 border border-black">{item.qty}</td>
                          <td className="p-1 border border-black">{item.rate}</td>
                          <td className="p-1 border border-black">{item.amount}</td>
                          <td className="p-1 border border-black">{item.netWt}</td>
                          <td className="p-1 border border-black">{item.netAmt}</td>
                        </tr>
                      ))}
                      {/* Empty padding rows for structural height match */}
                      {Array.from({ length: Math.max(0, 3 - tableItems.length) }).map((_, i) => (
                        <tr key={i} className="h-6">
                          <td className="border border-black" />
                          <td className="border border-black" />
                          <td className="border border-black" />
                          <td className="border border-black" />
                          <td className="border border-black" />
                          <td className="border border-black" />
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Subtotals & Deductions */}
                <div className="border border-black p-2 space-y-1 bg-slate text-[13px] font-bold">
                  <div className="flex justify-between">
                    <span className="text-black">Total Amount</span>
                    <span className="font-mono text-slate-900">{totalAmount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-black">Tds <span className="font-normal text-slate-500 ml-2">[ - ]</span></span>
                    <span className="font-mono text-slate-900">{tdsAmount}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-black">Less Deductions <span className="font-normal text-slate-500 ml-2">[ - ]</span></span>
                    <span className="font-mono text-slate-900">{lessDeductions}</span>
                  </div>
                </div>

                {/* Net Amount Banner */}
                <div className="text-black flex justify-between items-center px-2 pb-2 font-bold border border-black">
                  <span className="text-xs uppercase tracking-wide">Nett. Amount</span>
                  <div className="text-black px-3 py-1 rounded text-sm font-black font-mono">
                    {netAmount}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-2 font-bold text-[14px] text-black">
              <span>Please Credit the same to our A/c. and acknowledge the receipt at your earliest,</span>
            </div>

            <div className="border border-dashed border-black rounded-md pt-0 pb-2 px-2 text-[12px] leading-tight mb-1">
              The Payment for your above bill(s) is being made with the clear understanding that you have purchased the wheat from your local & delivered to us against the bargain on our Mill delivery basis & that all taxes / levies as applicable in your state will be paid by you. We are in no way responsible for any taxes or levies. Your acceptance of the DD will confirm your acceptance of these facts.
            </div>
          </div>

          <div>
            <div className="grid grid-cols-12 gap-4 items-end pt-1">
              {/* Left Side: Terms and Conditions */}
              <div className="col-span-10 space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-black font-bold text-[12px] rounded uppercase tracking-wider">
                    TERMS AND CONDITIONS:
                  </span>
                </div>

                <div className="space-y-1.5 text-[10.5px] text-slate-800 font-medium">
                  <div className="flex gap-2">
                    <span className="font-bold">1.</span>
                    <span>Subject to Hyderabad Jurisdiction.</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold">2.</span>
                    <span>Payments are made through account payee demand drafts only. Cash will not be paid in any circumstances.</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold">3.</span>
                    <span>If there is undue delay (more than 60 days) in payment kindly confirm the balance with us.</span>
                  </div>
                </div>

                <p className="text-[10px] font-bold text-slate-900 pt-1">Encl. as above</p>

                <div className="pt-3">
                  <p className="text-[13px] font-bold">
                    Broker : <span className="ml-2 underline font-black uppercase">{brokerName}</span>
                  </p>
                </div>
              </div>

              {/* Right Side: Signatures & Company Name */}
              <div className="col-span-12 text-right space-y-2">
                <div className="flex justify-end items-center gap-3">
                  <div className="text-left">
                    <p className="text-[13px] font-bold text-slate-800">Thanking You</p>
                    <p className="text-[12px] font-semibold text-slate-600">Yours faithfully</p>
                  </div>
                </div>

                <p className="text-[14px] font-bold text-black">
                  For <span className="uppercase">Shalimar Roller Flour Mill</span>
                </p>

                <div className="flex justify-end">
                  <p className="text-[11px] font-bold text-slate-800 flex items-center">
                    Authorised Signatory
                    <span className="ml-2 inline-block border-b border-slate-400 w-32 pt-4" />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default PrintableInvoice;
