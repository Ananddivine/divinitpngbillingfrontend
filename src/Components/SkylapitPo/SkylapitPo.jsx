import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../Skylapit/SkylapitinvoicePrint.css';
import logo from '../../assets/logo.png';
import { convertToWords } from '../utils/allowedUsers';
import axiosInstance from '../axiosInstance/axiosInstance';
import verifyToken from "../utils/verifyToken";

const SkylapitPo = () => {
  const { id } = useParams();
  const [po, setPo] = useState(null);
  const [error, setError] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false); // ✅ Move this above useEffect

  useEffect(() => {
    const checkAuthorization = async () => {
      const { isAuthorized } = await verifyToken();
      setIsAuthorized(isAuthorized);
    };
  
    checkAuthorization();
  }, []);
  

  useEffect(() => {
    const fetchPoById = async () => {
      try {
        const response = await axiosInstance.get(`/api/po/${id}`);
        setPo(response.data);
      } catch (error) {
        console.error('Error fetching PO:', error);
        setError('Failed to fetch PO details.');
      }
    };

    if (id) {
      fetchPoById();
    }
  }, [id]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!po) {
    return <div>Loading...</div>;
  }

  if (!po.products || !Array.isArray(po.products)) {
    return <div>No product data available.</div>;
  }

  // Calculate subtotal, tax, and total
  const subtotal = po.products.reduce((sum, product) => sum + product.price * product.quantity, 0) || 0;
  const tax = subtotal * 0.18; // Assuming 18% tax
  const total = subtotal + tax;

  const whatsappShare = () => {
    const shareURL = `${window.location.origin}/Skylapit-po/${id}`;
    const whatsappURL = `https://api.whatsapp.com/send?text=Check out this Purchase Order: ${shareURL}`;
    window.open(whatsappURL, "_blank");
  };


  return (
       <div className="w-[900px] mx-auto border border-gray-800 p-6 font-sans text-sm bg-white shadow-md">
         {/* Header Section */}
         <div className="flex justify-between items-start border-b border-gray-800 pb-4 mb-4">
           {/* Left - Company Details */}
           <div>
             <img src={logo} className="w-32 h-auto mb-2" alt="Company Logo" />
             <h1 className="font-bold text-lg uppercase">Skylapit LAPTOP SERVICE</h1>
             <p className="text-xs">The Service Excellence</p>
             <p className="text-xs">+91 9606120007</p>
             <p className="text-xs">GST: 29CCGPM5472G1Z9</p>
           </div>
           {/* Right - PO Details */}
           <div className="text-right">
             <h2 className="font-bold text-xl uppercase">Purchase Order</h2>
             <p className="font-semibold">PO No: {po.poNumber}</p>
             <p className="font-semibold">Date: {po.poDate}</p>
           </div>
         </div>
   
         {/* Vendor & Customer Section */}
         <div className="grid grid-cols-2 gap-6 mb-6 border-b border-gray-800 pb-4">
         <div>
             <h3 className="font-bold bg-blue-950 p-2 text-gray-100">Skylapit</h3>
             <p>Name: Skylapit LAPTOP SERVICE</p>
             <p>Phone: +91 9606120007</p>
             <p>Address: 6/1,First floor, 63, Whitefield Main Rd, opposite to dress circle mall, above united farma, Whitefield, Bengaluru, Karnataka 560066</p>
           </div>
           <div>
             <h3 className="font-bold bg-blue-950 p-2 text-gray-100">VENDOR</h3>
             <p>Name: {po.venderName}</p>
             <p>Phone: {po.venderNumber}</p>
             <p>Address: {po.venderAddress}</p>
             <p>GST No: {po.gstNumber}</p>
           </div>           
         </div>
   
         {/* Table Section */}
         <table className="w-full border-collapse border border-gray-800 mb-4">
           <thead>
             <tr className="bg-blue-950 p-2 text-gray-100">
               <th className="border border-gray-800 px-3 py-2">Sl.No</th>
               <th className="border border-gray-800 px-3 py-2">Description</th>
               <th className="border border-gray-800 px-3 py-2 text-center">Qty</th>
               <th className="border border-gray-800 px-3 py-2 text-right">Price</th>
             </tr>
           </thead>
           <tbody>
             {po.products.map((product, index) => (
               <tr key={index}>
                 <td className="border border-gray-800 px-3 py-2 text-center">{index + 1}</td>
                 <td className="border border-gray-800 px-3 py-2">{product.name}</td>
                 <td className="border border-gray-800 px-3 py-2 text-center">{product.quantity}</td>
                 <td className="border border-gray-800 px-3 py-2 text-right">₹{parseFloat(product.price).toFixed(2)}</td>
               </tr>
             ))}
           </tbody>
         </table>
   
         {/* Amount Summary Section */}
         <div className="grid grid-cols-2 gap-4 border-t border-gray-800 pt-4">
           {/* Amount in Words */}
           <div>
             <p className="italic font-semibold">
               <strong>Amount in words:</strong> {convertToWords(total)}
             </p>
           </div>
           {/* Subtotal & Total */}
           <div className="text-right">
             <p className="border-b border-gray-800 px-3 py-2"><strong>Subtotal:</strong> ₹{subtotal.toFixed(2)}</p>
             <p className="border-b border-gray-800 px-3 py-2"><strong>Tax:</strong> ₹{tax.toFixed(2)}</p>
             <p className="text-lg font-bold text-blue-700 px-3 py-2"><strong>Total:</strong> ₹{total.toFixed(2)}</p>
           </div>
         </div>
   
         {/* Notes & Terms */}
         <div className="border-t border-gray-800 mt-4 pt-4 text-xs">
           <h3 className="font-bold bg-gray-200 p-2">Note:</h3>
           <p>Payment shall be made within 30 days upon receipt of the items.</p>
         </div>
   
         {/* Footer - Signature & WhatsApp Button */}
         <div className="flex justify-between items-center mt-6">
           <div className="text-left">
             <p className="mt-4 text-xs font-semibold">Terms & Conditions:</p>
             <p className="text-xs">1. Goods once sold cannot be returned.</p>
             <p className="text-xs">2. Payment should be made within due date.</p>
             <p className="text-xs">3. Warranty does not cover physical damage.</p>
           </div>
           <div className="text-right">
             <p className="mt-12 font-semibold border-t border-gray-800 w-48 text-center ml-auto">This is a computer-generated bill.</p>
           </div>
         </div>
   
         {/* WhatsApp Share Button */}
         {isAuthorized && (
           <div className="mt-6 text-center">
             <button
               onClick={whatsappShare}
               className="bg-green-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-600"
             >
               Share on WhatsApp
             </button>
           </div>
         )}
       </div>
     );
   };
   
export default SkylapitPo;
