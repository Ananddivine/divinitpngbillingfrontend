import React, { useRef, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './DivineitpnginvoicePrint.css';
import logo from '../../assets/logo.png';
import { convertToWords } from '../utils/currencyUtils';
import { toPng } from 'html-to-image';

const DivineitpngWhatsappInvoice = () => {
    const location = useLocation();
    const {customerName, gstNumber, customerNumber, invoiceNumber, invoiceDate, products, subtotal, tax, total } = location.state || {};  
    const invoiceRef = useRef(null);  
    const handleShareWhatsApp = async () => {
        if (!navigator.share) {
          alert('Sharing not supported on this browser. Try on a mobile browser.');
          return;
        }      
        if (invoiceRef.current === null) return;      
        try {
          const dataUrl = await toPng(invoiceRef.current, { cacheBust: true, pixelRatio: 4, });
          const res = await fetch(dataUrl);
          const blob = await res.blob();
          const file = new File([blob], `Invoice-${invoiceNumber || 'Divineitpng'}.png`, {
            type: blob.type,
          });      
          await navigator.share({
            title: 'Invoice',
            text: 'Here is your invoice.',
            files: [file],
          });
        } catch (err) {
          console.error('Sharing failed:', err);
        }
      };      
  
    if (!products || !Array.isArray(products)) {
      return <div>No product data available.</div>;
    }
  
    return (
        <div className="w-full min-h-screen p-4 bg-gray-100 flex justify-center">     
          <div className="fixed top-4 right-4 overflow-hidden">
            <button
              onClick={handleShareWhatsApp}
              className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
            >
              Shear the invoice to whatsapp
            </button>
          </div>              
          <div
            ref={invoiceRef}
            className="print-container bg-white shadow-md font-semibold text-sm p-6 max-w-[794px] w-full min-h-[1123px] relative">          
            <div className="flex justify-between items-start mb-4">
              <div className="w-1/2 font-semibold">
                <img src={logo} className="w-[100px] h-auto mb-2" alt="Company Logo" />
                <h1 className="font-bold text-lg uppercase">Divine it png</h1>
                <p className="text-xs">The Service Excellence</p>
                <p className="text-xs">+675 78162860</p>
                <p className="text-xs"> #35 3d floor Tisa Ruma Building beside Holiday Inn Holiday, NCD, Port Moresby Papua New Guinea 121</p>
              </div>      
              <div className="w-1/2 text-right pt-10 pl-8">
                <p className="font-semibold text-xs">Customer Name: {customerName}</p>
                <p className="font-semibold text-xs">Phone: {customerNumber}</p>
                <p className="font-semibold text-xs">Invoice No: {invoiceNumber}</p>
                <p className="font-semibold text-xs">Date: {invoiceDate}</p>
              </div>
            </div>               
            <div className="p-1">
              <table className="w-full border-collapse border border-gray-800 mt-4">
                <thead>
                  <tr className="bg-gray-200 text-left">
                    <th className="border border-gray-800 px-2 py-1 w-10 text-center">Sl.</th>
                    <th className="border border-gray-800 px-2 py-1">Description</th>
                    <th className="border border-gray-800 px-2 py-1 w-12 text-center">Qty</th>
                    <th className="border border-gray-800 px-2 py-1 w-20 text-right">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={index} className="align-top">
                      <td className="border-l border-gray-800 px-2 py-2 text-center">{index + 1}</td>
                      <td className="border-l border-gray-800 px-2 py-2">{product.name}</td>
                      <td className="border-l border-gray-800 px-2 py-2 text-center">{product.quantity}</td>
                      <td className="border-l border-gray-800 px-2 py-2 text-right">K{parseFloat(product.price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>      
              <div className="flex justify-between mt-2">
                <div className="w-1/2 text-left pt-2">
                  <p className="italic text-xs font-semibold">
                    <strong>Amount in words:</strong> {convertToWords(total)}
                  </p>
                </div>
                <div className="w-56 border border-gray-800 border-t-transparent text-xs">
                  <p className="font-semibold border-b border-gray-800 px-2 py-1"><strong>Subtotal:</strong> K{subtotal?.toFixed(2) || 0}</p>
                  <p className="font-semibold border-b border-gray-800 px-2 py-1"><strong>Tax:</strong> K{tax?.toFixed(2) || 0} (18%)</p>
                  <p className="font-semibold px-2 py-1"><strong>Total:</strong> K{total?.toFixed(2) || 0}</p>
                </div>
              </div>
            </div>                
            <div className="absolute bottom-10 left-0 w-full px-6 bg-white">
              {/* Terms & Conditions */}
              <div className="w-full mt-6">
                <p className="italic text-xs font-semibold text-left">
                  <strong>Terms & Conditions:</strong>
                  <br />1. Goods once sold cannot be returned.  
                  <br />2. Payment should be made within due date.  
                  <br />3. Warranty does not cover physical damage.  
                </p>
              </div>       
          <div className="w-full flex justify-between items-end mt-12">
            <div className="w-1/2 text-left">
              <p className="italic text-xs font-semibold border-t border-gray-800 w-fit">
                Customer Signature
              </p>
            </div>
            <div className="w-1/2 text-right">
              <p className="font-semibold border-t border-gray-800 w-fit text-center ml-auto">
                Authorized Signature
              </p>
            </div>
          </div>        
          <div className="w-full mt-8">
            <p className="font-semibold border-t border-gray-800 w-full text-center">
              This is a computer-generated bill.
            </p>
          </div>
        </div>
        </div>
        </div>
      );      
      };     
export default DivineitpngWhatsappInvoice;
