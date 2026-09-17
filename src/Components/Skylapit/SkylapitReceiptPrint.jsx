import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import "./SkylapitinvoicePrint.css";
import logo from "../../assets/logo.png";

const accessoryLabels = {
  charger: "Charger",
  chargerCable: "Charger Cable",
  bag: "Bag",
  mouse: "Mouse",
  adapter: "Adapter",
  battery: "Battery",
};

const SkylapitReceiptPrint = () => {
  const location = useLocation();
  const {
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
    accessories,
    reportedIssue,
    physicalCondition,
    estimatedCost,
  } = location.state || {};

  const [logoLoaded, setLogoLoaded] = useState(false);
  const printRef = React.useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: receiptNumber || "Skylapit-Acknowledgement",
  });

  const handleImageLoad = () => setLogoLoaded(true);

  React.useEffect(() => {
    if (!logoLoaded) return;
    const timer = window.setTimeout(() => {
      handlePrint();
    }, 500);
    return () => window.clearTimeout(timer);
  }, [handlePrint, logoLoaded]);

  if (!customerName) {
    return <div>No receipt data available.</div>;
  }

  const selectedAccessories = Object.entries(accessoryLabels)
    .filter(([key]) => accessories?.[key])
    .map(([, label]) => label);

  if (accessories?.other) {
    selectedAccessories.push(accessories.other);
  }

  return (
    <div className="w-full min-h-[100vh] bg-white">
      <div className="flex justify-end p-4 print:hidden">
        <button
          type="button"
          onClick={handlePrint}
          className="rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600"
        >
          Print Acknowledgement
        </button>
      </div>

      <div ref={printRef} className="print-container relative min-h-[100vh] w-full h-full p-6 font-sans text-sm">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="w-1/2 font-poppins">
            <img src={logo} className="mb-2 h-auto w-[20vh]" alt="Company Logo" onLoad={handleImageLoad} />
            <h1 className="text-lg font-bold uppercase">Divine it png</h1>
            <p className="text-xs">The Service Excellence</p>
            <p className="text-xs">+675 78162860</p>
            <p className="text-xs">
              #35 3d floor Tisa Ruma Building beside Holiday Inn Holiday, NCD, Port Moresby Papua New Guinea 121
            </p>
          </div>
          <div className="ml-12 mt-4 w-1/2 pl-16 text-right">
            <h2 className="text-xl font-bold uppercase tracking-wide">Device Acknowledgement</h2>
            <p className="font-semibold">Receipt No: {receiptNumber}</p>
            <p className="font-semibold">Job No: {jobNumber}</p>
            <p className="font-semibold">Date Received: {receivedDate}</p>
            {expectedDeliveryDate && (
              <p className="font-semibold">Expected Delivery: {expectedDeliveryDate}</p>
            )}
          </div>
        </div>

        {/* Customer + device details */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="rounded border border-gray-800 p-3">
            <h3 className="mb-2 border-b border-gray-800 pb-1 font-bold uppercase">Customer Details</h3>
            <p><strong>Name:</strong> {customerName}</p>
            <p><strong>Phone:</strong> {customerNumber}</p>
            {customerEmail && <p><strong>Email:</strong> {customerEmail}</p>}
          </div>
          <div className="rounded border border-gray-800 p-3">
            <h3 className="mb-2 border-b border-gray-800 pb-1 font-bold uppercase">Device Details</h3>
            <p><strong>Type:</strong> {deviceType}</p>
            {brand && <p><strong>Brand:</strong> {brand}</p>}
            {modelNumber && <p><strong>Model No:</strong> {modelNumber}</p>}
            {serialNumber && <p><strong>Serial No:</strong> {serialNumber}</p>}
            {color && <p><strong>Color:</strong> {color}</p>}
          </div>
        </div>

        {/* Accessories */}
        <div className="mt-4 rounded border border-gray-800 p-3">
          <h3 className="mb-2 border-b border-gray-800 pb-1 font-bold uppercase">Accessories Received</h3>
          <p>{selectedAccessories.length > 0 ? selectedAccessories.join(", ") : "None"}</p>
        </div>

        {/* Reported issue */}
        <div className="mt-4 rounded border border-gray-800 p-3">
          <h3 className="mb-2 border-b border-gray-800 pb-1 font-bold uppercase">Reported Issue</h3>
          <p>{reportedIssue}</p>
        </div>

        {/* Physical condition */}
        {physicalCondition && (
          <div className="mt-4 rounded border border-gray-800 p-3">
            <h3 className="mb-2 border-b border-gray-800 pb-1 font-bold uppercase">
              Physical Condition at Intake
            </h3>
            <p>{physicalCondition}</p>
          </div>
        )}

        {estimatedCost > 0 && (
          <div className="mt-4 rounded border border-gray-800 p-3">
            <p><strong>Estimated Cost:</strong> K{Number(estimatedCost).toFixed(2)}</p>
            <p className="mt-1 text-xs italic">Final cost may vary after diagnosis.</p>
          </div>
        )}

        {/* Terms */}
        <div className="absolute bottom-10 left-0 w-full bg-white px-6">
          <div className="mt-6 w-full">
            <p className="text-left text-xs font-semibold italic">
              <strong>Terms & Conditions:</strong>
              <br />1. This receipt must be presented when collecting the device.
              <br />2. Devices not collected within 30 days of the completion date may incur storage charges.
              <br />3. Divine it png is not responsible for data loss; please ensure your data is backed up.
              <br />4. The above device condition and accessories were verified with the customer at drop-off.
              <br />5. Estimated cost is indicative only and may change after full diagnosis.
            </p>
          </div>

          <div className="mt-12 flex w-full items-end justify-between">
            <div className="w-1/2 text-left">
              <p className="w-fit border-t border-gray-800 text-xs font-semibold italic">
                Customer Signature
              </p>
            </div>
            <div className="w-1/2 text-right">
              <p className="ml-auto w-fit border-t border-gray-800 text-center font-semibold">
                Authorized Signature
              </p>
            </div>
          </div>

          <div className="mt-8 w-full">
            <p className="w-full border-t border-gray-800 text-center font-semibold">
              This is a computer-generated acknowledgement receipt.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkylapitReceiptPrint;