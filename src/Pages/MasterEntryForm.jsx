import { useState, useEffect } from "react";

export default function MasterEntryForm() {
  const [formData, setFormData] = useState({
    rtgsAccountNo: "9128790000086",
    shalimarAccountNo: "63025927314",
    ifscCode: "STIN0003233",
    unloadingCharges: "5.00",
    serviceTax: "0",
  });

  useEffect(() => {
    window.electronAPI.getMasterEntry().then((data) => {
      setFormData({
        rtgsAccountNo: data.rtgs_account_no,
        shalimarAccountNo: data.shalimar_account_no,
        ifscCode: data.ifsc_code,
        unloadingCharges: data.unloading_charges,
        serviceTax: data.service_tax,
      });
    });
  }, []);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    window.electronAPI.saveMasterEntry(formData);
    console.log("Form submitted:", formData);
  };

  return (
    <div className="w-[400px] h-[500px] bg-white p-4">
      <h2 className="text-lg font-semibold mb-4">Master Entry</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* RTGS Account No */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            RTGS Account No.
          </label>
          <input
            type="text"
            name="rtgsAccountNo"
            value={formData.rtgsAccountNo}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* Shalimar Account No */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Shalimar - Account No.
          </label>
          <input
            type="text"
            name="shalimarAccountNo"
            value={formData.shalimarAccountNo}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* IFSC Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            IFSC Code - Shalimar
          </label>
          <input
            type="text"
            name="ifscCode"
            value={formData.ifscCode}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* Unloading Charges */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Unloading charges / bag
          </label>
          <input
            type="text"
            name="unloadingCharges"
            value={formData.unloadingCharges}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* Service Tax */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Service Tax - DD Request Report
          </label>
          <input
            type="text"
            name="serviceTax"
            value={formData.serviceTax}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-2 pt-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm hover:bg-blue-700 transition"
          >
            Ok
          </button>
          <button
            type="button"
            className="bg-gray-400 text-white px-4 py-1.5 rounded text-sm hover:bg-gray-500 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
