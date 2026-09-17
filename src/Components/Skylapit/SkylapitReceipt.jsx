import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../axiosInstance/axiosInstance";
import "./SkylapitinvoicePrint.css";
import { FaPrint, FaSave } from "react-icons/fa";

const SkylapitReceipt = () => {
  const navigate = useNavigate();

  const [receiptNumber, setReceiptNumber] = useState("");
  const [lastReceiptNumber, setLastReceiptNumber] = useState("");
  const [jobNumber, setJobNumber] = useState("");
  const [lastJobNumber, setLastJobNumber] = useState("");
  const [jobSuggestions, setJobSuggestions] = useState([]);

  const [receivedDate, setReceivedDate] = useState(new Date().toISOString().split("T")[0]);
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [customerNumber, setCustomerNumber] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  const [deviceType, setDeviceType] = useState("Laptop");
  const [brand, setBrand] = useState("");
  const [modelNumber, setModelNumber] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [color, setColor] = useState("");
  const [devicePassword, setDevicePassword] = useState("");

  const [accessories, setAccessories] = useState({
    charger: false,
    chargerCable: false,
    bag: false,
    mouse: false,
    adapter: false,
    battery: false,
    other: "",
  });

  const [reportedIssue, setReportedIssue] = useState("");
  const [physicalCondition, setPhysicalCondition] = useState("");
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [technicianName, setTechnicianName] = useState("");

  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingPrint, setLoadingPrint] = useState(false);

  const sectionCardClass =
    "rounded-[28px] border border-white/20 bg-white/10 p-6 shadow-[0_8px_32px_rgba(31,38,135,0.18)] backdrop-blur-2xl ring-1 ring-white/10";
  const inputClass =
    "w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none transition duration-200 placeholder:text-white/50 backdrop-blur-xl focus:border-cyan-300/60 focus:ring-4 focus:ring-cyan-200/20";
  const secondaryButtonClass =
    "flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition duration-200 backdrop-blur-xl hover:bg-white/15";
  const primaryButtonClass =
    "flex items-center justify-center gap-2 rounded-2xl border border-cyan-200/20 bg-[linear-gradient(135deg,rgba(34,211,238,0.35),rgba(14,165,233,0.18))] px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_32px_rgba(14,165,233,0.35)] transition duration-200 backdrop-blur-xl hover:brightness-110";
  const checkboxLabelClass = "flex items-center gap-2 text-sm text-white/85";

  // Fetch next receipt number
  useEffect(() => {
    const fetchLastReceiptNumber = async () => {
      try {
        const response = await axiosInstance.get("/api/receipts/last");
        if (response.status === 200) {
          setLastReceiptNumber(response.data.currentLastReceiptNumber || "");
          setReceiptNumber(response.data.nextReceiptNumber || "ACK00-0000");
        }
      } catch (error) {
        console.error("Error fetching last receipt number:", error);
      }
    };
    fetchLastReceiptNumber();
  }, []);

  // Fetch next job number
  useEffect(() => {
    const fetchLastJobNumber = async () => {
      try {
        const response = await axiosInstance.get("/api/receipts/job/last");
        if (response.status === 200) {
          setLastJobNumber(response.data.lastJobNumber || "SKY0000");
          setJobNumber(response.data.nextJobNumber || "SKY0001");
        }
      } catch (error) {
        console.error("Error fetching last job number:", error);
      }
    };
    fetchLastJobNumber();
  }, []);

  const handleJobInput = async (e) => {
    const value = e.target.value;
    setJobNumber(value);

    if (value.length > 1) {
      try {
        const res = await axiosInstance.get(`/api/receipts/search-job?query=${value}`);
        setJobSuggestions(res.data);
      } catch (err) {
        console.error("Job number search failed:", err);
      }
    } else {
      setJobSuggestions([]);
    }
  };

  const handleSuggestionClick = (receipt) => {
    setJobNumber(receipt.jobNumber);
    setCustomerName(receipt.customerName);
    setCustomerNumber(receipt.customerNumber || "");
    setCustomerEmail(receipt.customerEmail || "");
    setJobSuggestions([]);
  };

  const toggleAccessory = (key) => {
    setAccessories((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const validateInputs = () => {
    if (!receivedDate || !receiptNumber || !jobNumber || !customerName || !customerNumber) {
      toast.error("Please fill in date, receipt/job number, customer name and phone.");
      return false;
    }
    if (!deviceType || !reportedIssue) {
      toast.error("Please select a device type and describe the reported issue.");
      return false;
    }
    return true;
  };

  const buildReceiptData = () => ({
    receiptNumber,
    jobNumber,
    receivedDate,
    expectedDeliveryDate,
    customerName,
    customerNumber,
    customerEmail,
    deviceType,
    brand,
    modelNumber,
    serialNumber,
    color,
    devicePassword,
    accessories,
    reportedIssue,
    physicalCondition,
    estimatedCost,
    technicianName,
  });

  const submitReceipt = async () => {
    setLoadingSave(true);
    if (!validateInputs()) {
      setLoadingSave(false);
      return null;
    }

    try {
      const response = await axiosInstance.post("/api/receipts/create", buildReceiptData());
      if (response.status === 201 || response.status === 200) {
        toast.success("Acknowledgement receipt saved!");
        return response.data.receipt;
      }
      toast.error(response.data.message || "Failed to save the receipt!");
      return null;
    } catch (error) {
      console.error("❌ Error saving receipt:", error);
      toast.error(error.response?.data?.message || "Something went wrong!");
      return null;
    } finally {
      setLoadingSave(false);
    }
  };

  const handleSaveOnly = async () => {
    const saved = await submitReceipt();
    if (saved) {
      window.location.reload();
    }
  };

  const handleSaveAndPrint = async () => {
    setLoadingPrint(true);
    if (!validateInputs()) {
      setLoadingPrint(false);
      return;
    }
    const saved = await submitReceipt();
    setLoadingPrint(false);
    if (!saved) return;

    navigate("/Skylapitreceiptprint", { state: buildReceiptData() });
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden rounded-[32px] bg-[radial-gradient(circle_at_top,#1e3a8a,#0f172a,#020617)] px-10 py-6">
      <div className="absolute top-10 left-10 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl"></div>
      <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl"></div>

      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
            Intake Desk
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-gray-50 font-poppins">
            Device Drop-off Acknowledgement
          </h2>
          <p className="mt-2 text-sm text-gray-200">
            Record device condition and accessories at intake, then hand the customer a signed acknowledgement.
          </p>
        </div>
        <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white/75 shadow-sm backdrop-blur-xl">
          Last receipt: <span className="font-semibold text-white">{lastReceiptNumber || "None yet"}</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column: Receipt + Customer */}
        <div className={sectionCardClass}>
          <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.16em] text-white/80">
            Date Received
          </label>
          <input
            type="date"
            value={receivedDate}
            onChange={(e) => setReceivedDate(e.target.value)}
            className={inputClass}
          />

          <label className="mb-2 mt-5 block text-sm font-semibold uppercase tracking-[0.16em] text-white/80">
            Receipt Number
          </label>
          <input
            type="text"
            value={receiptNumber}
            onChange={(e) => setReceiptNumber(e.target.value)}
            className={inputClass}
          />

          <div className="relative">
            <label className="mb-2 mt-5 block text-sm font-semibold uppercase tracking-[0.16em] text-white/80">
              Job Number <span className="text-amber-200">(Last: {lastJobNumber || "0000"})</span>
            </label>
            <input
              type="text"
              value={jobNumber}
              onChange={handleJobInput}
              className={inputClass}
            />
            {jobSuggestions.length > 0 && (
              <ul className="absolute z-50 mt-2 max-h-40 w-full overflow-auto rounded-2xl border border-white/20 bg-slate-950/85 text-white shadow-lg backdrop-blur-xl">
                {jobSuggestions.map((receipt) => (
                  <li
                    key={receipt._id}
                    className="cursor-pointer px-4 py-3 text-sm hover:bg-white/10"
                    onClick={() => handleSuggestionClick(receipt)}
                  >
                    {receipt.jobNumber} - {receipt.customerName}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <label className="mb-2 mt-5 block text-sm font-semibold uppercase tracking-[0.16em] text-white/80">
            Expected Delivery Date <span className="text-amber-200">(Optional)</span>
          </label>
          <input
            type="date"
            value={expectedDeliveryDate}
            onChange={(e) => setExpectedDeliveryDate(e.target.value)}
            className={inputClass}
          />

          <label className="mb-2 mt-5 block text-sm font-semibold uppercase tracking-[0.16em] text-white/80">
            Customer Name
          </label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className={inputClass}
            placeholder="Enter Customer Name"
          />

          <label className="mb-2 mt-5 block text-sm font-semibold uppercase tracking-[0.16em] text-white/80">
            Customer Mobile Number
          </label>
          <input
            type="text"
            value={customerNumber}
            onChange={(e) => setCustomerNumber(e.target.value)}
            className={inputClass}
            placeholder="Enter Customer Mobile Number"
          />

          <label className="mb-2 mt-5 block text-sm font-semibold uppercase tracking-[0.16em] text-white/80">
            Customer Email <span className="text-amber-200">(Optional)</span>
          </label>
          <input
            type="email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            className={inputClass}
            placeholder="Enter Customer Email"
          />
        </div>

        {/* Right Column: Device details */}
        <div className={sectionCardClass}>
          <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.16em] text-white/80">
            Device Type
          </label>
          <select
            value={deviceType}
            onChange={(e) => setDeviceType(e.target.value)}
            className={`${inputClass} appearance-none`}
          >
            <option value="Laptop" className="bg-slate-900 text-white">Laptop</option>
            <option value="Desktop" className="bg-slate-900 text-white">Desktop</option>
            <option value="Printer" className="bg-slate-900 text-white">Printer</option>
            <option value="Other" className="bg-slate-900 text-white">Other</option>
          </select>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div>
              <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.16em] text-white/80">
                Brand
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className={inputClass}
                placeholder="e.g. HP, Dell"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.16em] text-white/80">
                Model Number
              </label>
              <input
                type="text"
                value={modelNumber}
                onChange={(e) => setModelNumber(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div>
              <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.16em] text-white/80">
                Serial Number
              </label>
              <input
                type="text"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.16em] text-white/80">
                Color
              </label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <label className="mb-2 mt-5 block text-sm font-semibold uppercase tracking-[0.16em] text-white/80">
            Device Password / Pattern <span className="text-amber-200">(Optional, for technician use)</span>
          </label>
          <input
            type="text"
            value={devicePassword}
            onChange={(e) => setDevicePassword(e.target.value)}
            className={inputClass}
          />

          <label className="mb-2 mt-5 block text-sm font-semibold uppercase tracking-[0.16em] text-white/80">
            Accessories Received
          </label>
          <div className="grid grid-cols-2 gap-2 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-xl sm:grid-cols-3">
            {[
              ["charger", "Charger"],
              ["chargerCable", "Charger Cable"],
              ["bag", "Bag"],
              ["mouse", "Mouse"],
              ["adapter", "Adapter"],
              ["battery", "Battery"],
            ].map(([key, label]) => (
              <label key={key} className={checkboxLabelClass}>
                <input
                  type="checkbox"
                  checked={accessories[key]}
                  onChange={() => toggleAccessory(key)}
                  className="h-4 w-4 rounded border-white/30 bg-white/10 accent-cyan-400"
                />
                {label}
              </label>
            ))}
          </div>
          <input
            type="text"
            value={accessories.other}
            onChange={(e) => setAccessories((prev) => ({ ...prev, other: e.target.value }))}
            className={`${inputClass} mt-2`}
            placeholder="Other accessories (optional)"
          />
        </div>
      </div>

      {/* Issue + condition */}
      <div className={`${sectionCardClass} mt-6`}>
        <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.16em] text-white/80">
          Reported Issue / Customer Complaint
        </label>
        <textarea
          value={reportedIssue}
          onChange={(e) => setReportedIssue(e.target.value)}
          rows={3}
          className={inputClass}
          placeholder="e.g. Laptop not powering on, screen flickers, keyboard keys not working..."
        />

        <label className="mb-2 mt-5 block text-sm font-semibold uppercase tracking-[0.16em] text-white/80">
          Physical Condition at Intake <span className="text-amber-200">(Optional)</span>
        </label>
        <textarea
          value={physicalCondition}
          onChange={(e) => setPhysicalCondition(e.target.value)}
          rows={2}
          className={inputClass}
          placeholder="Note any visible scratches, dents, or missing screws/keys"
        />

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.16em] text-white/80">
              Estimated Cost (K) <span className="text-amber-200">(Optional)</span>
            </label>
            <input
              type="number"
              onWheel={(e) => e.target.blur()}
              value={estimatedCost}
              onChange={(e) => setEstimatedCost(Number(e.target.value))}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.16em] text-white/80">
              Technician Name <span className="text-amber-200">(Optional)</span>
            </label>
            <input
              type="text"
              value={technicianName}
              onChange={(e) => setTechnicianName(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mb-7 mt-6 flex flex-wrap gap-3 pb-10">
        <button onClick={handleSaveOnly} className={secondaryButtonClass} disabled={loadingSave}>
          {loadingSave && (
            <span className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
          )}
          <FaSave /> Save Only
        </button>

        <button onClick={handleSaveAndPrint} className={primaryButtonClass} disabled={loadingPrint}>
          {loadingPrint && (
            <span className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
          )}
          <FaPrint /> Save &amp; Print Acknowledgement
        </button>
      </div>

      <ToastContainer />
    </div>
  );
};

export default SkylapitReceipt;