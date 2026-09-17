import React, { useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './SkylapitinvoiceDownload.css';
import logo from '../../assets/logo.png'
import { FaMailBulk } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import axiosInstance from '../axiosInstance/axiosInstance';

const SkylapitSendEmailInvoicesCustom = () => {
  const location = useLocation();
  const { customerName, customerNumber, customerEmail, gstNumber, invoiceNumber, invoiceDate, products, subtotal, tax, total } = location.state || {};
  const invoiceRef = useRef();
  const [loading, setLoading] = useState(false)

  // Convert number to words
  const convertToWords = (amount) => {
    const units = ['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve',
    'Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
    const tens = ['','', 'Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];

    if (amount === 0) return 'Zero Rupees Only';
    if (amount < 0) return 'Negative amount is invalid';

    const numToWords = (num) => {
      if (num < 20) return units[num];
      if (num < 100) return tens[Math.floor(num/10)] + (num%10 !== 0 ? ' ' + units[num%10] : '');
      if (num < 1000) return units[Math.floor(num/100)] + ' Hundred' + (num%100 !== 0 ? ' ' + numToWords(num%100) : '');
      if (num < 100000) return numToWords(Math.floor(num/1000)) + ' Thousand' + (num%1000 !== 0 ? ' ' + numToWords(num%1000) : '');
      if (num < 10000000) return numToWords(Math.floor(num/100000)) + ' Lakh' + (num%100000 !== 0 ? ' ' + numToWords(num%100000) : '');
      return numToWords(Math.floor(num/10000000)) + ' Crore' + (num%10000000 !== 0 ? ' ' + numToWords(num%10000000) : '');
    };

    const words = numToWords(Math.floor(amount));
    const paise = Math.round((amount - Math.floor(amount)) * 100);
    return words + (paise > 0 ? ` and ${numToWords(paise)} Paise` : '') + ' Only';
  };

  // Generate PDF
// Generate PDF with proper margins and scaling
const handleSendEmail = async () => {
  setLoading(true);
  
  if (!invoiceRef.current) {
    toast.error('Invoice reference not found!');
    return;
  }

  // Hide the send email button before capturing
  const sendEmailButton = document.getElementById('send-email-btn');
  if (sendEmailButton) sendEmailButton.style.display = 'none';

  html2canvas(invoiceRef.current, { scale: 1, useCORS: true }).then(async (canvas) => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 190;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);

    // Restore button visibility
    if (sendEmailButton) sendEmailButton.style.display = 'flex';

    // Convert PDF to Blob
    const pdfBlob = pdf.output('blob');

    // Create FormData to send PDF file to backend
    const formData = new FormData();
    formData.append('pdf', pdfBlob, `Invoice_${invoiceNumber || 'unknown'}.pdf`);
    formData.append('email', customerEmail);

    try {
      const response = await axiosInstance.post('/api/skymail', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Invoice sent successfully!');
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send invoice.');
    } finally {
      setLoading(false);
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
          id="send-email-btn" 
          className='mt-2 w-full md:w-fit px-4 py-2 rounded-md bg-green-500 text-white flex items-center justify-center hover:bg-green-600 gap-2'
          type='submit'
          onClick={handleSendEmail}
          disabled={loading} 
        >
          {loading ? (
            <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5 mr-2"></span>
          ) : null}
          <FaMailBulk /> Send Email
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
           {/* Send Email Button */}

      <ToastContainer />
             </div>
           );
         };       

export default SkylapitSendEmailInvoicesCustom;
  