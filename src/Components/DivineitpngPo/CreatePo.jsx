import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import styles for toast
import axiosInstance from '../axiosInstance/axiosInstance'
import { FaSave, FaWhatsapp } from "react-icons/fa";


const CreatePo = () => {
  const [products, setProducts] = useState([{ name: "", price: "", quantity: 1 }]);
  const [poDate, setPoDate] = useState(new Date().toISOString().split("T")[0]);
  const [poNumber, setPoNumber] = useState("");
  const [lastpoNumber, setLastPoNumber] = useState("");
  const [venderEmail, setvenderEmail] = useState('');
  const [venderAddress, setvenderAddress] = useState('');
  const [venderNumber, setvenderNumber] = useState('');
  const [venderName, setvenderName] = useState('');
  const [gstNumber, setGstNumber] = useState("");
  const [taxPercent, setTaxPercent] = useState(18);
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingWhatsapp, setLoadingWhatsapp] = useState(false);
  const [vendors, setVendors] = useState([]);
const [filteredVendors, setFilteredVendors] = useState([]);
const [showSuggestions, setShowSuggestions] = useState(false);

useEffect(() => {
  const fetchVendors = async () => {
    try {
      const res = await axiosInstance.get("/api/vendors");
      setVendors(res.data);
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }
  };
  fetchVendors();
}, []);


// Fetch last po number from backend on component mount
useEffect(() => {
  const fetchLastPoNumber = async () => {
    try {
      const response = await axiosInstance.get("/api/last-po-number");
      setLastPoNumber(response.data.poNumber);
    } catch (error) {
      console.error("Error fetching last PO number:", error);
    }
  };
  fetchLastPoNumber();
}, []);


  // Calculate totals whenever products or taxPercent change
  useEffect(() => {
    const newSubtotal = products.reduce(
      (total, product) =>
        total + (parseFloat(product.price || 0) * parseInt(product.quantity || 1)),
      0
    );
    const newTax = (newSubtotal * taxPercent) / 100;
    const newTotal = newSubtotal + newTax;

    setSubtotal(newSubtotal);
    setTax(newTax);
    setTotal(newTotal);
  }, [products, taxPercent]);

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

  // Handle po submission
  const submitPo = async () => {
    setLoadingSave(true);
    if (!validateInputs()) return;
  
    console.log("🚀 Sending po with email:", venderEmail);
    
    const poData = {
      poDate,
      poNumber,
      venderName,
      venderEmail,
      venderNumber,
      venderAddress,
      gstNumber,
      taxPercent,
      products,
      subtotal,
      tax,
      total,
    };
  
    try {
      const response = await axiosInstance.post("/api/po/create", poData);
  
      if (response.status === 201 || response.status === 200) {
        console.log("✅ PO created successfully:", response.data);
        toast.success("PO saved successfully!");
  
        // Store refresh status to sessionStorage (optional)
        sessionStorage.setItem("hasRefreshed", "false");
  
        // Redirect only after successful PO creation
        navigate(`/DivineitpngPoOrders/${poNumber}`);
      } else {
        console.error("⚠️ Failed to save PO:", response.data.message);
        toast.error(response.data.message || "Failed to save the PO!");
      }
    } catch (error) {
      console.error("❌ Error saving PO:", error);
  
      // Extract error response properly
      const errorMessage = error.response?.data?.message || "Something went wrong!";
      toast.error(errorMessage);
    } finally {
      setLoadingSave(false);
    }
  };
  
  // Remove navigation from handleWhatsapp
  const handleWhatsapp = () => {
    if (!validateInputs()) return;
    submitPo(); // Now, navigation happens inside submitPo
  };
  

  const validateInputs = () => {
    if (!poDate || !poNumber || !venderName || !venderNumber || !venderEmail ) {
      toast.error("Please fill in all required fields.");
      setLoadingSave(false);   
      setLoadingWhatsapp(false);
      return false;
    }
  
    if (products.length === 0 || products.some(p => !p.name || p.price <= 0 || p.quantity <= 0)) {
      toast.error("Please add at least one product with a valid name, price, and quantity.");
      setLoadingSave(false);  
      setLoadingWhatsapp(false);
      return false;
    }
   
    return true;
  };



  // Set poNumber automatically when lastpoNumber is fetched
useEffect(() => {
  if (lastpoNumber) {
    setPoNumber((parseInt(lastpoNumber, 10) + 1).toString().padStart(4, "0"));
  }
}, [lastpoNumber]);

return (
  <div className="px-4 py-6 max-w-screen-xl mx-auto">
    <h2 className="text-xl font-bold mb-6 font-poppins text-center">Create PO</h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Po Date */}
      <div>
        <label className="block font-semibold">PO Date</label>
        <input
          type="date"
          value={poDate}
          onChange={(e) => setPoDate(e.target.value)}
          className="w-full border rounded p-2 bg-gray-300 hover:bg-gray-100 outline-none"
        />
      </div>

      {/* PO Number */}
      <div>
        <label className="block font-semibold">
          PO Number
          <span className="text-red-500"> (Last: {(lastpoNumber || '0000')})</span>
        </label>
        <input
          type="number"
          value={poNumber}
          onChange={(e) => setPoNumber(e.target.value)}
          onWheel={(e) => e.target.blur()}
          placeholder={`Next: ${(parseInt(lastpoNumber || "0000", 10) + 1).toString().padStart(4, "0")}`}
          className="w-full border rounded p-2 bg-gray-300 hover:bg-gray-100 outline-none"
          required
        />
      </div>

      {/* Vender Name */}
      <div className="relative">
  <label className="block font-semibold">Vendor Name</label>
  <input
    type="text"
    value={venderName}
    onChange={(e) => {
      const value = e.target.value;
      setvenderName(value);
      if (value.trim() === "") {
        setFilteredVendors([]);
        setShowSuggestions(false);
        return;
      }
      const filtered = vendors.filter(v =>
        v.venderName.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredVendors(filtered);
      setShowSuggestions(true);
    }}
    onBlur={() => {
      setTimeout(() => setShowSuggestions(false), 200); // Delay to allow click
    }}
    onFocus={() => {
      if (filteredVendors.length > 0) setShowSuggestions(true);
    }}
    className="w-full border rounded p-2 bg-gray-300 hover:bg-gray-100 outline-none"
    placeholder="Enter Vendor Name"
    required
  />
  {showSuggestions && filteredVendors.length > 0 && (
    <ul className="absolute z-10 bg-white border border-gray-300 mt-1 w-full max-h-40 overflow-y-auto shadow-lg rounded">
      {filteredVendors.map((vendor, index) => (
        <li
          key={index}
          className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
          onClick={() => {
            setvenderName(vendor.venderName);
            setvenderEmail(vendor.venderEmail);
            setvenderNumber(vendor.venderNumber);
            setvenderAddress(vendor.venderAddress);
            setGstNumber(vendor.gstNumber);
            setShowSuggestions(false);
          }}
        >
          {vendor.venderName}
        </li>
      ))}
    </ul>
  )}
</div>


      {/* Vender Number */}
      <div>
        <label className="block font-semibold">Vendor Mobile Number</label>
        <input
          type="number"
          value={venderNumber}
          onChange={(e) => setvenderNumber(e.target.value)}
          onWheel={(e) => e.target.blur()}
          className="w-full border rounded p-2 bg-gray-300 hover:bg-gray-100 outline-none"
          placeholder="Enter Vendor Mobile Number"
          required
        />
      </div>

      {/* Vender Email */}
      <div>
        <label className="block font-semibold">Vendor Email ID</label>
        <input
          type="email"
          value={venderEmail}
          onChange={(e) => setvenderEmail(e.target.value)}
          className="w-full border rounded p-2 bg-gray-300 hover:bg-gray-100 outline-none"
          placeholder="Enter Vendor Email ID"
          required
        />
      </div>

      {/* Address */}
      <div>
        <label className="block font-semibold">Vendor Address</label>
        <input
          type="text"
          value={venderAddress}
          onChange={(e) => setvenderAddress(e.target.value)}
          className="w-full border rounded p-2 bg-gray-300 hover:bg-gray-100 outline-none"
          placeholder="Enter Vendor Address"
          required
        />
      </div>

      {/* GST Number */}
      <div>
        <label className="block font-semibold">GST Number</label>
        <input
          type="text"
          value={gstNumber}
          onChange={(e) => setGstNumber(e.target.value)}
          className="w-full border rounded p-2 bg-gray-300 hover:bg-gray-100 outline-none"
          placeholder="Enter GST Number"
        />
      </div>

      {/* Tax */}
      <div>
        <label className="block font-semibold">Tax Percentage (%)</label>
        <input
          type="number"
          value={taxPercent}
          onChange={(e) => setTaxPercent(Number(e.target.value))}
          className="w-full border rounded p-2 bg-gray-300 hover:bg-gray-100 outline-none"
        />
      </div>
    </div>

    {/* Products Section */}
    <div className="mt-8">
      <h3 className="font-bold mb-2">Products</h3>
      {products.map((product, index) => (
        <div key={index} className="flex flex-col md:flex-row items-center gap-4 mb-2 outline-none">
          <input
            type="text"
            placeholder="Product Name"
            value={product.name}
            onChange={(e) => handleProductChange(index, "name", e.target.value)}
            className="flex-1 border rounded p-2 bg-gray-300 hover:bg-gray-100 outline-none"
          />
          <input
            type="number"
            placeholder="Price"
            onWheel={(e) => e.target.blur()}
            value={product.price}
            onChange={(e) => handleProductChange(index, "price", e.target.value)}
            className="w-32 border rounded p-2 bg-gray-300 hover:bg-gray-100 outline-none"
          />
          <input
            type="number"
            placeholder="Quantity"
            onWheel={(e) => e.target.blur()}
            value={product.quantity}
            onChange={(e) => handleProductChange(index, "quantity", e.target.value)}
            className="w-32 border rounded p-2 bg-gray-300 hover:bg-gray-100 outline-none"
          />
          <button onClick={() => removeProduct(index)} className="text-white px-4 py-2 bg-gray-950 hover:bg-gray-700 rounded">
            Remove
          </button>
        </div>
      ))}
      <button onClick={addProduct} className="mt-2 text-white px-4 py-2 bg-gray-950 hover:bg-gray-700 rounded">
        Add Product
      </button>
    </div>

    {/* Totals */}
    <div className="mt-6 space-y-1 text-lg font-medium">
      <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
      <p>Tax ({taxPercent}%): ₹{tax.toFixed(2)}</p>
      <p>Total: ₹{total.toFixed(2)}</p>
    </div>

    {/* Action Buttons */}
    <div className="mt-6 flex flex-col sm:flex-row gap-4 pb-12">
      <button
        onClick={handleWhatsapp}
        disabled={loadingWhatsapp}
        className="w-full sm:w-auto px-4 py-2 rounded-md bg-gray-800 text-white flex items-center justify-center hover:bg-gray-500 gap-2"
      >
        {loadingWhatsapp && (
          <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5 mr-2"></span>
        )}
        <FaWhatsapp /> Whatsapp
      </button>

      <button
        onClick={submitPo}
        disabled={loadingSave}
        className="w-full sm:w-auto px-4 py-2 rounded-md bg-gray-800 text-white flex items-center justify-center hover:bg-gray-500 gap-2"
      >
        {loadingSave && (
          <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5 mr-2"></span>
        )}
        <FaSave /> Save PO
      </button>
    </div>

    <ToastContainer />
  </div>
);
}

export default CreatePo;
