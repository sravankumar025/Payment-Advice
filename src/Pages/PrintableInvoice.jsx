import React from "react";
import { useReactToPrint } from "react-to-print";
import shalimarLogo from "../Images/shalimarLogo.png";

const SAMPLE_DATA = {
  adviceNo: "592",
  refNo: "SRFM968",
  date: "16-Sep-2022",
  partyName: "M/s. AMBIKA ENTERPRISES",
  partyLocation: "SEONI",
  billNo: "215",
  receivedDate: "08-Sep-2022",
  rtgsNo: "456465",
  rtgsDate: "16-Sep-2022",
  bankNameAndAcc: "CBIN0282063 , A/c: 3786228952",
  amountRs: "920968.00",
  totalBills: 1,
  cashDiscountPercent: 4,
  cashDiscountAmount: "39730.00",
  unloading: "590",
  cashPaid: "2360.00",
  shortage: "-",
  lateLoading: "-",
  rateDiff: "-",
  qualityDiffText: "356 Qntl x 45 [ ]",
  qualityDiffAmount: "16020.00",
  tableItems: [
    {
      sno: 1,
      qty: "356",
      rate: "2790.00",
      amount: "993240.00",
      netWt: "13169.00",
      netAmt: "980071.00"
    }
  ],
  totalAmount: "980071.00",
  tdsAmount: "993.00",
  lessDeductions: "58110.00",
  netAmount: "920968.00",
  brokerName: "KALYANJI"
};

const PrintableInvoice = React.forwardRef(({ data }, ref) => {
  const advice = { ...SAMPLE_DATA };

  return (
    <div>

      {/* Outer A4 Page Container */}
      <div
        ref={ref}
        style={{ width: "210mm",height:"297mm", margin: "0 auto", boxSizing: "border-box" }}
        className="bg-white text font-sans  shadow-lg relative box-sizing flex flex-col justify-between origin-top"
      >
        <div style={{ margin: "10px" }} className="border border-black p-3 h-full flex flex-col justify-between text-[11px] leading-snug">

          <div>
            { }
            <div className="relative mb-2">
              <div className="text-xs">
                No. {advice.adviceNo}
              </div>

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

            { }
            <div className="flex justify-between font-bold text-[13px] mb-1">
              <div>Ref. No. {advice.refNo}</div>
              <div>Date : {advice.date}</div>
            </div>

            <div className="mb-2">
              <p className="font-bold text-[13px]">To,</p>
              <div className="flex items-start gap-2 pl-1 mt-0.5">
                {/**Party icon should come here */}
                <div>
                  <p className="font-bold text-[13px] text-slate-900">
                    Party's Name & Address :</p>
                </div>
                <div className="flex flex-col">
                  <p className="uppercase text-[12px] font-semibold">
                    <span className="inline-block align-middle border-b border-slate-400 w-[150mm] pb-1">
                      {advice.partyName}
                    </span>
                  </p>
                  <p className="uppercase text-[12px] font-semibold">
                    <span className="inline-block align-middle border-b border-slate-400 w-[150mm] pb-1">
                      {advice.partyLocation}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Sub & Received Box */}
            <div className="border border-black rounded-md flex justify-between items-center font-bold text-[12.5 px] mb-4 px-2 pt-0 pb-2">
              <div className="flex items-center">Sub: Your outstanding Bill No. <span className="ml-4 font-extrabold">{advice.billNo}</span></div>
              <div className="flex items-center">Received on dated <span className="ml-4 font-extrabold">{advice.receivedDate}</span></div>
            </div>

            {/* Covering Letter Box */}
            <div className="border border-dashed border-black rounded-md pt-0 px-2 pb-2 mb-2 text-[13px] leading-relaxed">
              <p className="font-bold ">Dear Sir,</p>
              <div className="pl-4 space-y-1">
                <p>
                  Please find enclosed here with RTGS No. <span className="inline-block align-middle border-b border-slate-400 font-semibold px-2 pb-0.5">{advice.rtgsNo} </span>
                  Dated <span className="inline-block align-middle border-b border-slate-400 font-semibold px-2 pb-0.5">{advice.rtgsDate}</span>
                  drawn on <span className="inline-block align-middle border-b border-slate-400 font-semibold px-2 pb-0.5">{advice.bankNameAndAcc}</span> in your favour
                  for Rs. <span className="inline-block align-middle border-b border-slate-400 font-semibold px-2 pb-0.5">{advice.amountRs}</span> towards. full and final/part payment as per the details as under.
                </p>
              </div>
            </div>

            { }
            <div className="grid grid-cols-12 gap-2 mb-2">
              {/* Left Column: Deductions Breakdown */}
              <div className="col-span-5 border border-black p-2 flex flex-col justify-between text-[13px]">
                <div className="space-y-1">
                  <p className="font-bold">1) Total of <span className="inline-block align-middle border-b border-slate-400 font-semibold px-2 pb-0.5">{advice.totalBills}</span> Bills.</p>
                  <p className="font-bold">2) LESS</p>

                  <div className="pl-3 space-y-0.5">
                    <div className="flex justify-between">
                      <span>a) Cash Discount ({advice.cashDiscountPercent} %)</span>
                      <span className="font-mono">: {advice.cashDiscountAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>b) Unloading</span>
                      <span className="font-mono">: {advice.unloading}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>c) Cash Paid</span>
                      <span className="font-mono">: {advice.cashPaid}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>d) Shortage</span>
                      <span className="font-mono">: {advice.shortage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>e) Late Loading</span>
                      <span className="font-mono">: {advice.lateLoading}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>f) Rate Difference</span>
                      <span className="font-mono">: {advice.rateDiff}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>g)</span>
                      <span className="font-mono">: -</span>
                    </div>
                    <div className="flex justify-between">
                      <span>h)</span>
                      <span className="font-mono">: -</span>
                    </div>
                  </div>

                  <div className="pt-1">
                    <p className="font-bold">3) Quality Difference</p>
                    <div className="flex justify-between pl-3 mt-0.5 font-medium">
                      <span>{advice.qualityDiffText}</span>
                      <span className="font-mono">: {advice.qualityDiffAmount}</span>
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
                      {advice.tableItems.map((item, idx) => (
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
                      {Array.from({ length: Math.max(0, 3 - advice.tableItems.length) }).map((_, i) => (
                        <tr key={i} className="h-6">
                          <td className="border border-black" />
                          <td className="border border-black" />
                          <td className="border border-black" />
                          <td className="border border-black" />
                          <td className="border border-black" />
                          <td className="border border-black"/>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Subtotals & Deductions */}
                <div className="border border-black p-2 space-y-1 bg-slate text-[13px] font-bold">
                  <div className="flex justify-between">
                    <span className="text-black">Total Amount</span>
                    <span className="font-mono text-slate-900">{advice.totalAmount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-black">Tds <span className="font-normal text-slate-500 ml-2">[ - ]</span></span>
                    <span className="font-mono text-slate-900">{advice.tdsAmount}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-black">Less Deductions <span className="font-normal text-slate-500 ml-2">[ - ]</span></span>
                    <span className="font-mono text-slate-900">{advice.lessDeductions}</span>
                  </div>
                </div>

                {/* Net Amount Banner */}
                <div className="text-black flex justify-between items-center px-2 pb-2 font-bold border border-black">
                  <span className="text-xs uppercase tracking-wide">Nett. Amount</span>
                  <div className="text-black px-3 py-1 rounded text-sm font-black font-mono">
                    {advice.netAmount}
                  </div>
                </div>
              </div>
            </div>

            { }
            <div className="flex items-center gap-2 mb-2 font-bold text-[14px] text-black">
              <span>Please Credit the same to our A/c. and acknowledge the receipt at your earliest,</span>
            </div>

            <div className="border border-dashed border-black rounded-md pt-0 pb-2 px-2 text-[12px] text leading-tight mb-1">
              The Payment for your above bill(s) is being made with the clear understanding that you have purchased the wheat from your local & delivered to us against the bargain on our Mill delivery basis & that all taxes / levies as applicable in your state will be paid by you. We are in no way responsible for any taxes or levies. Your acceptance of the DD wii confirm your acceptance of these facts.
            </div>
          </div>

          { }
          <div>
            <div className="grid grid-cols-12 gap-4 items-end pt-1">
              {/* Left Side: Terms and Conditions */}
              <div className="col-span-10 space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className=" text-black font-bold text-[12px] rounded uppercase tracking-wider">
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
                    Broker : <span className="ml-2 underline font-black uppercase text">{advice.brokerName}</span>
                  </p>
                </div>
              </div>

              {/* Right Side: Signatures & Compnay Name*/}
              <div className="col-span-12 text-right space-y-2">
                <div className="flex justify-end items-center gap-3">
                  {/*Thank you icon*/}
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
