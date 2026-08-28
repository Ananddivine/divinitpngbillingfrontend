import React, { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './DivineitpnginvoiceDownload.css';
import logo from '../../assets/logo.png'
import { convertToWords } from '../utils/currencyUtils';


const DivineitpngDownloadInvoice = () => {
  const location = useLocation();
  const { customerName, customerNumber, gstNumber, invoiceNumber, invoiceDate, products, subtotal, tax, total } = location.state || {};
  const invoiceRef = useRef();
   // Generate PDF
// Generate PDF with proper margins and scaling
const handleDownload = () => {
  if (!invoiceRef.current) return;
  // Find the download button and hide it before taking a screenshot
  const downloadBtn = document.querySelector(".download-btn-container");
  if (downloadBtn) {
    downloadBtn.style.display = "none"; // Hide button
  }
  html2canvas(invoiceRef.current, { scale: 1, useCORS: true }).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 190; // A4 page width in mm with margins
    const pageHeight = 297; // A4 page height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let yPosition = 10; // Start 10mm from top
    if (imgHeight > pageHeight - 20) {
      // If content is longer than one page, split it
      let remainingHeight = imgHeight;
      let pageY = 10;

      while (remainingHeight > 0) {
        pdf.addImage(imgData, "PNG", 10, pageY, imgWidth, imgHeight);
        remainingHeight -= pageHeight - 20;
        pageY -= pageHeight;

        if (remainingHeight > 0) {
          pdf.addPage();
          pageY = 10; // Reset position for new page
        }
      }
    } else {
      pdf.addImage(imgData, "PNG", 10, yPosition, imgWidth, imgHeight);
    }
    pdf.save(`Invoice_${invoiceNumber}.pdf`);
    // Show the button again after PDF is downloaded
    if (downloadBtn) {
      downloadBtn.style.display = "block";
    }
  });
};
  if (!products || !Array.isArray(products)) {
    return <div>No product data available.</div>;
  }
  return(
          <div ref={invoiceRef} className="print-container w-full h-full p-6 font-sans text-sm relative min-h-[100vh]">  
          <div className="download-btn-container fixed top-0 right-4 overflow-hidden">
                <button
            onClick={handleDownload}
            className="bg-green-500 text-white p-3 rounded hover:bg-green-600 ml-60 mt-12"
          >
            ⬇️ Download Invoice
          </button>
          </div>           
             <div className="flex justify-between items-start mb-4 ">            
               <div className="w-1/2 font-poppins">
                 <img src={logo} className="w-[20vh] h-auto mb-2" alt="Company Logo"/>
                <h1 className="font-bold text-lg uppercase">Divine it png</h1>
                <p className="text-xs">The Service Excellence</p>
                <p className="text-xs">+675 78162860</p>
                <p className="text-xs"> #35 3d floor Tisa Ruma Building beside Holiday Inn Holiday, NCD, Port Moresby Papua New Guinea 121</p>
               </div>               
               <div className="w-1/2 text-right ml-12 pl-28 mt-12 pt-14">
                 <p className="font-semibold text-justify gap-2">CustomerName: {customerName}</p>
                 <p className="font-semibold text-justify gap-2">Phone <span> : </span> {customerNumber}</p>
                 <p className="font-semibold text-justify gap-2">Invoice No: {invoiceNumber}</p>
                 <p className="font-semibold text-justify gap-2">Date <span> : </span> {invoiceDate}</p>
               </div>
             </div>                        
           <div className="p-2">
             <table className="w-full border-collapse border border-gray-800 mt-6">
               <thead>
                 <tr className="bg-gray-200 text-left">
                   <th className="border border-gray-800 px-3 py-2 w-10">Sl.No</th>
                   <th className="border border-gray-800 px-3 py-2">Description</th>
                   <th className="border border-gray-800 px-3 py-2 text-center w-16">Qty</th>
                   <th className="border border-gray-800 px-3 py-2 text-right w-24">Price</th>
                 </tr>
               </thead>
               <tbody>
                 {products.map((product, index) => (
                   <tr key={index}  className="align-top">
                     <td className="border-l border-gray-800 px-3 py-3 text-center">{index + 1}</td>
                     <td className="border-l border-gray-800 px-3 py-3">{product.name}</td>
                     <td className="border-l border-gray-800 px-3 py-3 text-center">{product.quantity}</td>
                     <td className="border-l border-gray-800 px-3 py-3 text-right">K{parseFloat(product.price).toFixed(2)}</td>
                   </tr>
                 ))}
               </tbody>
             </table>       
             <div className="flex justify-between items-start mt-0">       
               <div className="w-1/2 text-left pt-3">
                 <p className="italic text-sm font-semibold">
                   <strong>Amount in words:</strong> {convertToWords(total)}
                 </p>
               </div>         
               <div className="w-60 border border-gray-800 border-t-transparent">
                 <p className="font-poppins border-b border-gray-800 px-3 py-2"><strong>Subtotal :</strong> K{subtotal?.toFixed(2) || 0}</p>
                 <p className="font-poppins border-b border-gray-800 px-3 py-2"><strong>Tax : </strong> K{tax?.toFixed(2) || 0} (18%)</p>
                 <p className="font-poppins  px-3 py-2"><strong>Total : </strong> K{total?.toFixed(2) || 0}</p>
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
 
           {/* Signature Row */}
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
 
           {/* Bottom Center Note */}
           <div className="w-full mt-8">
             <p className="font-semibold border-t border-gray-800 w-full text-center">
               This is a computer-generated bill.
             </p>
           </div>
         </div>
           </div>
         );
       };     
export default DivineitpngDownloadInvoice;
