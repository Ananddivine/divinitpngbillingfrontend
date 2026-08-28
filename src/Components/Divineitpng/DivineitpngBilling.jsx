import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import styles for toast
import axiosInstance from '../axiosInstance/axiosInstance'
import './DivineitpnginvoicePrint.css'
import { FaDownload, FaMailBulk, FaPrint, FaSave, FaWhatsapp } from "react-icons/fa";


const DivineitpngBilling = () => {
  const [products, setProducts] = useState([{ name: "", price: "", quantity: "" }]);
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split("T")[0]);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [lastJobNumber, setLastJobNumber] = useState("")
  const [jobNumber, setJobNumber] = useState("");
  const [lastInvoiceNumber, setLastInvoiceNumber] = useState("");
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerNumber, setCustomerNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [gstNumber, setGstNumber] = useState("");
  const [taxPercent, setTaxPercent] = useState(18);
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingPrint, setLoadingPrint] = useState(false);
  const [loadingDownload, setLoadingDownload] = useState(false);
  const [loadingWhatsapp, setloadingWhatsapp] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState("amount"); // Default to amount
  const [discountAmount, setDiscountAmount] = useState(0);
  const [jobSuggestions, setJobSuggestions] = useState([]);
  const sectionCardClass = "rounded-[28px] border border-white/20 bg-white/10 p-6 shadow-[0_8px_32px_rgba(31,38,135,0.18)] backdrop-blur-2xl ring-1 ring-white/10";
  const inputClass = "w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none transition duration-200 placeholder:text-white/50 backdrop-blur-xl focus:border-cyan-300/60 focus:ring-4 focus:ring-cyan-200/20";
  const secondaryButtonClass = "flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition duration-200 backdrop-blur-xl hover:bg-white/15";
  const primaryButtonClass = "flex items-center justify-center gap-2 rounded-2xl border border-cyan-200/20 bg-[linear-gradient(135deg,rgba(34,211,238,0.35),rgba(14,165,233,0.18))] px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_32px_rgba(14,165,233,0.35)] transition duration-200 backdrop-blur-xl hover:brightness-110";
  const warrantyOptions = [
    "1 month", "2 months", "3 months", "4 months", "5 months",
    "6 months", "7 months", "8 months", "9 months",
    "1 year", "2 years", "3 years", "4 years", "5 years",
    "6 years", "7 years", "8 years", "9 years", "10 years"
  ];

  const handleJobInput = async (e) => {
    const value = e.target.value;
    setJobNumber(value); // Still update the input field
  
    if (value.length > 1) {
      try {
        const res = await axiosInstance.get(`/api/invoices/search-job?query=${value}`);
        setJobSuggestions(res.data);
      } catch (err) {
        console.error("Job number search failed:", err);
      }
    } else {
      setJobSuggestions([]);
    }
  };
  

const handleSuggestionClick = (invoice) => {
  setJobNumber(invoice.jobNumber);
  setCustomerName(invoice.customerName);
  setCustomerEmail(invoice.customerEmail || "");
  setCustomerNumber(invoice.customerNumber || "");
  setGstNumber(invoice.gstNumber || "");
  setJobSuggestions([]); // Close the suggestion box
};


useEffect(() => {
  const fetchLastInvoiceNumber = async () => {
    try {
      const response = await axiosInstance.get("/api/invoices/last");

      if (response.status === 200) {
        const currentLastInvoiceNumber = response.data.currentLastInvoiceNumber || "";
        const nextInvoiceNumber = response.data.nextInvoiceNumber || "S00-0000";

        setLastInvoiceNumber(currentLastInvoiceNumber);
        setInvoiceNumber(nextInvoiceNumber);
      }
    } catch (error) {
      console.error("Error fetching last invoice number:", error);
    }
  };

  fetchLastInvoiceNumber();
}, []);


useEffect(() => {
  const fetchLastJobNumber = async () => {
    try {
      const response = await axiosInstance.get("/api/invoices/job/last");
      if (response.status === 200) {
        const data = response.data;
        console.log("Fetched last job number:", data);

        const lastJob = data.lastJobNumber || "DIP0000"; // Ensure default

        // Extract numeric part and increment
        const numericPart = parseInt(lastJob.replace("DIP", ""), 10) || 0;
        const nextJobNumber = `DIP${(numericPart + 1).toString().padStart(4, "0")}`;

        setLastJobNumber(lastJob);
        setJobNumber(nextJobNumber);
      } else {
        console.error("Failed to fetch last Job number");
      }
    } catch (error) {
      console.error("Error fetching last Job number:", error);
    }
  };

  fetchLastJobNumber();
}, []);




  // Calculate totals whenever products or taxPercent change
  useEffect(() => {
    const newSubtotal = products.reduce(
      (total, product) =>
        total + (parseFloat(product.price || 0) * parseInt(product.quantity || 1)),
      0
    );
  
    // Calculate Discount
    let calculatedDiscount = discountType === "percent" 
      ? (newSubtotal * discount) / 100 
      : discount;
  
    if (calculatedDiscount > newSubtotal) {
      calculatedDiscount = newSubtotal; // Ensure discount is not more than subtotal
    }
  
    const subtotalAfterDiscount = newSubtotal - calculatedDiscount;
    const newTax = (subtotalAfterDiscount * taxPercent) / 100;
    const newTotal = subtotalAfterDiscount + newTax;
  
    setDiscountAmount(calculatedDiscount);
    setSubtotal(subtotalAfterDiscount);
    setTax(newTax);
    setTotal(newTotal);
  }, [products, taxPercent, discount, discountType]);
  

  // Handle product changes
  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...products];
    updatedProducts[index][field] = value;
    setProducts(updatedProducts);
  };

  // Add new product row
  const addProduct = () => {
    setProducts([...products, { name: "", price: "", quantity: 1 }]);
  };

  // Remove product row
  const removeProduct = (index) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  // Handle invoice submission
 // Handle invoice submission
 const submitInvoice = async () => {
  setLoadingSave(true);
  if (!validateInputs()) return;

  console.log("🚀 Sending invoice with email:", customerEmail);
  
  const invoiceData = {
    invoiceDate,
    invoiceNumber,
    jobNumber,
    customerName,
    customerEmail,
    customerNumber,
    gstNumber,
    taxPercent,
    products,
    subtotal,
    tax,
    total,
  };

  try {
    const response = await axiosInstance.post("/api/invoices/create", invoiceData);

    if (response.status === 201 || response.status === 200) {
      console.log("✅ Invoice created successfully:", response.data);
      toast.success("Invoice saved successfully!");
      window.location.reload();
    } else {
      console.error("⚠️ Failed to save invoice:", response.data.message);
      toast.error(response.data.message || "Failed to save the invoice!");
    }
  } catch (error) {
    console.error("❌ Error saving invoice:", error);

    // Extract error response properly
    const errorMessage = error.response?.data?.message || "Something went wrong!";
    toast.error(errorMessage);
  } finally {
    setLoadingSave(false);
  }
};


// Print invoice
const handlePrint = async () => {
  setLoadingPrint(true);
  if (!validateInputs()) return; 
  await submitInvoice();
  sessionStorage.setItem("hasRefreshed", "false");
  navigate('/Divineitpngprint', { state: { 
    customerName, 
    customerNumber, 
    gstNumber,
    invoiceNumber, 
    jobNumber,
    invoiceDate, 
    products, 
    subtotal, 
    tax, 
    total 
  }});
  setLoadingPrint(false);
};

// Generate and download PDF
const handleDownloadPDF = async () => {
  setLoadingDownload(true);
  await submitInvoice();
  navigate("/Divineitpngdownload-invoice", { state: {
    customerName, 
    customerNumber, 
    invoiceNumber, 
    jobNumber,
    gstNumber,
    invoiceDate, 
    products, 
    subtotal, 
    tax, 
    total 
  }});
  setLoadingDownload(false);
};

const handleWhatsapp = async () => {
  setloadingWhatsapp(true);
  await submitInvoice();
  navigate("/DivineitpngWhatsappInvoice", { state: {
    customerName, 
    customerNumber, 
    invoiceNumber, 
    jobNumber,
    gstNumber,
    invoiceDate, 
    products, 
    subtotal, 
    tax, 
    total 
  }});
  setLoadingDownload(false);
};

// Send email
const handleSendEmail = async () => {
  setLoadingEmail(true);
  if (!validateInputs()) return; 
  await submitInvoice();
  navigate("/DivineitpngSendEmailInvoicesCustom", { state: {
    customerName, 
    customerNumber,
    customerEmail, 
    gstNumber,
    invoiceNumber, 
    jobNumber,
    invoiceDate, 
    products, 
    subtotal, 
    tax, 
    total 
  }});
  setLoadingEmail(false);
};

  const validateInputs = () => {
    if (!invoiceDate || !invoiceNumber || !customerName || !customerNumber) {
      toast.error("Please fill in all required fields.");
      setLoadingSave(false);
      setLoadingPrint(false);
      setLoadingDownload(false);
      setLoadingEmail(false);
      return false;
    }
  
    if (products.length === 0 || products.some(p => !p.name || p.price <= 0 || p.quantity <= 0)) {
      toast.error("Please add at least one product with a valid name, price, and quantity.");
      setLoadingSave(false);  
      setLoadingPrint(false);
      setLoadingDownload(false);
      setLoadingEmail(false);
      return false;
    }
   
    return true;
  };

  // Function to toggle the warranty dropdown
const toggleWarrantyDropdown = (index) => {
  setProducts((prevProducts) =>
    prevProducts.map((product, i) =>
      i === index ? { ...product, showWarranty: !product.showWarranty } : product
    )
  );
};

// Function to select a warranty and update the product name
const selectWarranty = (index, warranty) => {
  setProducts((prevProducts) =>
    prevProducts.map((product, i) =>
      i === index
        ? { ...product, name: `${product.name} (${warranty} warranty)`, showWarranty: false }
        : product
    )
  );
};


  return (
<div className="relative min-h-screen w-full overflow-hidden rounded-[32px] bg-[radial-gradient(circle_at_top,#1e3a8a,#0f172a,#020617)] px-10 py-6">

  <div className="absolute top-10 left-10 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl"></div>

  <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl"></div>
  
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">Billing Studio</span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-gray-50 font-poppins">
            Divineitpng Laptop Services Billing
          </h2>
          <p className="mt-2 text-sm text-gray-200">Create invoices in a calmer workspace with better grouping, stronger totals, and clearer customer details.</p>
        </div>
        <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white/75 shadow-sm backdrop-blur-xl">
          Last invoice: <span className="font-semibold text-white">{lastInvoiceNumber || "None yet"}</span>
        </div>
      </div>
      
      {/* Left & Right Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2 ">
        {/* Left Column */}
        <div className={sectionCardClass}>
          <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.16em] text-white/80">Invoice Date</label>
          <input
            type="date"
            value={invoiceDate}
            onChange={(e) => setInvoiceDate(e.target.value)}
            className={inputClass}
          />

         <label className="mb-2 mt-5 block text-sm font-semibold uppercase tracking-[0.16em] text-white/80">Invoice Number <span className="text-amber-200">(Last: {lastInvoiceNumber || "None"})</span></label>
          <input
            type="text"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            className={inputClass}
            placeholder={`Next: ${(parseInt(lastInvoiceNumber || "0000", 10) + 1).toString().padStart(4, "0")}`}
            onWheel={(e) => e.target.blur()}
            required
          />    
         
  
          <label className="mb-2 mt-5 block text-sm font-semibold uppercase tracking-[0.16em] text-white/80">Tax Percentage (%)</label>
          <input
            type="number"
            value={taxPercent}
            onChange={(e) => setTaxPercent(Number(e.target.value))}
            className={inputClass}
          />

        <div className="relative">
          <label className="mb-2 mt-5 block text-sm font-semibold uppercase tracking-[0.16em] text-white/80">
            Laptop Job Number
            <span className="text-amber-200"> (Last: {lastJobNumber || "0000"})</span>
          </label>
          <input
            type="text"
            value={jobNumber}
            onChange={handleJobInput}
            className={inputClass}
            placeholder={`Next: ${(parseInt(lastJobNumber || "0000", 10) + 1).toString().padStart(4, "0")}`}
          />
          
          {jobSuggestions.length > 0 && (
            <ul className="absolute z-50 mt-2 max-h-40 w-full overflow-auto rounded-2xl border border-white/20 bg-slate-950/85 text-white shadow-lg backdrop-blur-xl">
              {jobSuggestions.map((invoice) => (
                <li
                  key={invoice._id}
                  className="cursor-pointer px-4 py-3 text-sm hover:bg-white/10"
                  onClick={() => handleSuggestionClick(invoice)}
                >
                  {invoice.jobNumber} - {invoice.customerName}
                </li>
              ))}
            </ul>
          )}
        </div>

        </div>

        
  
        {/* Right Column */}
        <div className={sectionCardClass}>
        <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.16em] text-white/80">Customer Name</label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className={inputClass}
            placeholder="Enter Customer Name"
            required
          />
  
          <label className="mb-2 mt-5 block text-sm font-semibold uppercase tracking-[0.16em] text-white/80">Customer Email Id <span className="text-amber-200">(Optional)</span></label>
          <input
            type="email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            className={inputClass}
            placeholder="Enter Customer Email Id"
            required
          />

         <label className="mb-2 mt-5 block text-sm font-semibold uppercase tracking-[0.16em] text-white/80">Customer Mobile Number</label>
          <input
            type="number"
            onWheel={(e) => e.target.blur()}
            value={customerNumber}
            onChange={(e) => setCustomerNumber(e.target.value)}
            className={inputClass}
            placeholder="Enter Customer Mobile Number"
            required
          />
  
          <label className="mb-2 mt-5 block text-sm font-semibold uppercase tracking-[0.16em] text-white/80">Customer GST Number <span className="text-amber-200">(Optional)</span></label>
          <input
            type="text"
            value={gstNumber}
            onChange={(e) => setGstNumber(e.target.value)}
            className={inputClass}
            placeholder="Enter GST Number"
          />
        </div>
      </div> 
     
<div className={`${sectionCardClass} mt-6`}>
  <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
    <div>
      <h3 className="text-xl font-semibold text-white">Products</h3>
      <p className="mt-1 text-sm text-white/70">Add line items, warranty notes, and pricing in one place.</p>
    </div>
    <div className="rounded-2xl border border-emerald-200/20 bg-emerald-400/15 px-4 py-2 text-sm font-medium text-emerald-100 backdrop-blur-xl">
      Discount applied: K {discountAmount.toFixed(2)}
    </div>
  </div>
  {products.map((product, index) => (
    <div key={index} className="mb-4 grid gap-3 rounded-[24px] border border-white/20 bg-white/10 p-4 backdrop-blur-xl lg:grid-cols-[1fr_140px_140px_auto_auto_auto] lg:items-center">
      <input
        type="text"
        placeholder="Product Name"
        value={product.name}
        onChange={(e) => handleProductChange(index, "name", e.target.value)}
        className={inputClass}
      />

      <input
        type="number"
        onWheel={(e) => e.target.blur()}
        placeholder="Price"
        value={product.price}
        onChange={(e) => handleProductChange(index, "price", e.target.value)}
        className={inputClass}
      />
      <input
        type="number"
        onWheel={(e) => e.target.blur()}
        placeholder="Quantity"
        value={product.quantity}
        onChange={(e) => handleProductChange(index, "quantity", e.target.value)}
        className={inputClass}
      />

      {/* Warranty Dropdown */}
      <div className="relative">
        <button
          onClick={() => toggleWarrantyDropdown(index)}
          className={secondaryButtonClass}
        >
          Warranty
        </button>

        {/* Warranty Options Dropdown */}
        {product.showWarranty && (
          <div className="absolute top-14 left-0 z-10 h-[25vh] w-44 overflow-y-scroll rounded-2xl border border-white/20 bg-slate-950/85 text-white shadow-lg backdrop-blur-xl">
            {warrantyOptions.map((warranty) => (
              <p
                key={warranty}
                onClick={() => selectWarranty(index, warranty)}
                className="cursor-pointer px-3 py-2 hover:bg-white/10"
              >
                {warranty}
              </p>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={addProduct}
        className={primaryButtonClass}
      >
        Add Product
      </button>

      <button
        onClick={() => removeProduct(index)}
        className={secondaryButtonClass}
      >
        Remove
      </button>
    </div>
  ))}

       
        <label className="mb-2 mt-6 block text-sm font-semibold uppercase tracking-[0.16em] text-white/80">Discount</label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
           type="number"
           onWheel={(e) => e.target.blur()}
            value={discount}
           onChange={(e) => setDiscount(Number(e.target.value))}
           className={`${inputClass} max-w-xs`}
           placeholder="Enter discount"
           />
           <div className="relative">
                <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value)}
                className="w-40 appearance-none rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none transition duration-200 backdrop-blur-xl focus:border-cyan-300/60 focus:ring-4 focus:ring-cyan-200/20"
                >
              <option value="amount" className="bg-slate-900 text-white">
                K  Amount
              </option>
              <option value="percent" className="bg-slate-900 text-white">
                % Percentage
              </option>
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-white/60">
              </div>            ▼
            </div>
          </div>
      </div>     
     
      {/* Totals Section */}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-[28px] border border-white/20 bg-white/10 p-5 shadow-[0_18px_45px_rgba(73,47,24,0.08)] backdrop-blur-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Subtotal</p>
          <p className="mt-2 text-2xl font-semibold text-white">K {subtotal.toFixed(2)}</p>
        </div>
        <div className="rounded-[28px] border border-white/20 bg-white/10 p-5 shadow-[0_18px_45px_rgba(73,47,24,0.08)] backdrop-blur-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Tax ({taxPercent}%)</p>
          <p className="mt-2 text-2xl font-semibold text-white">K {tax.toFixed(2)}</p>
        </div>
        <div className="rounded-[28px] bg-[linear-gradient(135deg,#115e59,#0f766e)] p-5 text-white shadow-[0_18px_45px_rgba(15,118,110,0.24)]">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">Total</p>
          <p className="mt-2 text-2xl font-semibold">K {total.toFixed(2)}</p>
          <p className="mt-2 text-sm text-white/80">Tax and discount already included.</p>
        </div>
      </div>
  
      {/* Buttons Section */}
      <div className="mb-7 pb-10">
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={handlePrint}
          className={secondaryButtonClass}
          disabled={loadingPrint}
        >
          {loadingPrint && (
            <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5 mr-2"></span>
          )}
          <FaPrint /> Print Invoice
        </button>
  
        <button
          onClick={handleDownloadPDF}
          className={secondaryButtonClass}
          disabled={loadingDownload}
        >
          {loadingDownload && (
            <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5 mr-2"></span>
          )}
          <FaDownload /> Download PDF
        </button>

        <button
          onClick={handleWhatsapp}
          className={secondaryButtonClass}
          disabled={loadingWhatsapp}
        >
          {loadingWhatsapp && (
            <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5 mr-2"></span>
          )}
          <FaWhatsapp /> Whatsapp
        </button>
  
        <button
          onClick={handleSendEmail}
          className={secondaryButtonClass}
          disabled={loadingEmail}
        >
          {loadingEmail && (
            <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5 mr-2"></span>
          )}
          <FaMailBulk /> Send Email
        </button>
  
        <button
          onClick={submitInvoice}
          className={primaryButtonClass}
          disabled={loadingSave}
        >
          {loadingSave && (
            <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5 mr-2"></span>
          )}
          <FaSave /> Save Invoice
        </button>
      </div>
      </div>
  
      <ToastContainer />
    </div>
  );  
};

export default DivineitpngBilling;
