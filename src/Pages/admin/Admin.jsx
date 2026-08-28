import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../../Components/SideBar/Sidebar';
import AddProduct from '../../Components/addProduct/AddProduct';
import ListProduct from '../../Components/ListProduct/ListProduct';
import ClintOrders from '../../Components/Orders/ClintOrders';
import FileUpload from '../../Components/FileUpload/FileUpload';
import ManageFiles from '../../Components/ManageFiles/ManageFiles';
import Products from '../../Components/Products/Products';


// DivineitpngBILLING
import DivineitpngInvoice from '../../Components/Divineitpng/DivineitpngInvoice';
import DivineitpngBilling from '../../Components/Divineitpng/DivineitpngBilling';
import DivineitpngCustomers from '../../Components/Divineitpng/DivineitpngCustomers';
import DivineitpngPrint from '../../Components/Divineitpng/DivineitpngPrint'
import DivineitpngDownloadInvoice from '../../Components/Divineitpng/DivineitpngDownloadInvoice';
import DivineitpngDashboard from '../../Components/Dashboard/Divineitpngdashboard';
import DivineitpngStockManagement from '../../Components/Divineitpng/DivineitpngStockManagement';
import DivineitpngTrash from '../../Components/Trash/DivineitpngTrash';
import DivineitpngSendEmailInvoicesCustom from '../../Components/Divineitpng/DivineitpngSendEmailInvoicesCustom';
import DivineitpngTask from '../../Components/Tasks/DivineitpngTask';
import { BarChartSkeleton, PieChartSkeleton } from '../../Components/Skeleton/BarChartSkeleton';
import Divineitpngbillingediting from '../../Components/Divineitpng/Divineitpngbillingediting';
import DivineitpngCreateTask from '../../Components/Tasks/DivineitpngCreateTask';
import DivineitpngShowTask from '../../Components/Tasks/DivineitpngShowTask';
import CreatePo from '../../Components/DivineitpngPo/CreatePo';
import ManagePos from '../../Components/DivineitpngPo/ManagePos';
import DivineitpngPoTrash from '../../Components/DivineitpngPo/DivineitpngPoTrash';
import DivineitpngPoEdit from '../../Components/DivineitpngPo/DivineitpngPoEdit';
import DivineitpngReceipt from '../../Components/Divineitpng/DivineitpngReceipt';
import DivineitpngReceiptPrint from '../../Components/Divineitpng/DivineitpngReceiptPrint';
import DivineitpngReceiptList from '../../Components/Divineitpng/DivineitpngReceiptList';
import DivineitpngReceiptTrash from '../../Components/Divineitpng/DivineitpngReceiptTrash';




import Footer from '../../Components/Footer/Footer';
import DivineitpngTaskTrash from '../../Components/Tasks/DivineitpngTaskTrash';
import DivineitpngWhatsappInvoice from '../../Components/Divineitpng/DivineitpngWhatsappInvoice';







const Admin = () => {
  const role = localStorage.getItem('role');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[radial-gradient(circle_at_top_right,_rgba(15,118,110,0.08),_transparent_24%),radial-gradient(circle_at_left,_rgba(192,137,47,0.1),_transparent_26%),linear-gradient(180deg,#fbf7f1_0%,#f4efe7_100%)] text-slate-900">
      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}/>

      {/* Main Content Adjusts Based on Sidebar */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-16"}`}>
        <Routes>

          {role === "admin" && <Route path='addproduct' element={<AddProduct />} />}
          {(role === "admin" || role === "manager") && <Route path='/Listproduct' element={<ListProduct />} />}
          {(role === "admin" || role === "manager") && <Route path='/Clintorders' element={<ClintOrders />} />}
          {(role === "admin" || role === "manager") && <Route path="/uploadfile" element={<FileUpload />} />}
          {(role === "admin" || role === "manager") && <Route path="/managefiles" element={<ManageFiles />} />}
          {(role === "admin" || role === "staff"  ) && <Route path='/Products' element={<Products />} />}
          {(role === "admin" || role === "staff" ) && <Route path='/BarChartSkeleton' element={<BarChartSkeleton />} />}
          {(role === "admin" || role === "staff" ) && <Route path='/PieChartSkeleton' element={<PieChartSkeleton />} />}
          

          {/* Divineitpng BILLINGS */}
          {(role === "admin" || role === "staff" ) && <Route path='/Divineitpngdashboard' element={<DivineitpngDashboard />} />}
          {(role === "admin" || role === "staff" ) && <Route path='/DivineitpngStockManagement' element={<DivineitpngStockManagement />} />}
          {(role === "admin" || role === "staff" ) && <Route path='/DivineitpngStockManagement/:stockId' element={<DivineitpngStockManagement />} />}
          {(role === "admin" || role === "staff" ) && <Route path='/DivineitpngInvoice' element={<DivineitpngInvoice />} />}
          {(role === "admin" || role === "staff" ) && <Route path='/Divineitpngbilling' element={<DivineitpngBilling />} />}
          {(role === "admin" || role === "staff" ) && <Route path='/DivineitpngCustomers' element={<DivineitpngCustomers />} />}
          {(role === "admin" || role === "staff" ) && <Route path='/Divineitpngprint' element={<DivineitpngPrint/>} />}
          {(role === "admin" || role === "staff" ) && <Route path='/Divineitpngdownload-invoice' element={<DivineitpngDownloadInvoice />} />}
          {(role === "admin" || role === "staff" ) && <Route path='/DivineitpngSendEmailInvoicesCustom' element={<DivineitpngSendEmailInvoicesCustom/>} />}
          {(role === "admin" || role === "staff" ) && <Route path='/DivineitpngTrash' element={<DivineitpngTrash/>} />}
          {(role === "admin" || role === "staff" ) && <Route path='/DivineitpngTask' element={<DivineitpngTask/>} />}
          {(role === "admin" || role === "staff" ) && <Route path='/Divineitpngbillingediting' element={<Divineitpngbillingediting/>} />}
          {(role === "admin" || role === "staff" ) && <Route path='/DivineitpngCreateTask' element={<DivineitpngCreateTask/>} />}
          {(role === "admin" || role === "staff" ) && <Route path='/Divineitpngshowtask/:taskId' element={<DivineitpngShowTask />} />}      
          {(role === "admin" || role === "staff" ) && <Route path='/createpo' element={<CreatePo />} />}
          {(role === "admin" || role === "staff" ) && <Route path='/Managepos' element={<ManagePos />} />}
          {(role === "admin" || role === "staff" ) && <Route path='/DivineitpngPoTrash' element={<DivineitpngPoTrash />} />}
          {(role === "admin" || role === "staff" ) && <Route path='/DivineitpngPoEdit' element={<DivineitpngPoEdit />} />}
          {(role === "admin" || role === "staff" ) && <Route path='/DivineitpngTaskTrash' element={<DivineitpngTaskTrash />} />}
          {(role === "admin" || role === "staff" ) && <Route path='/DivineitpngWhatsappInvoice' element={<DivineitpngWhatsappInvoice />} />}
          {(role === "admin") && <Route path='/DivineitpngReceipt' element={<DivineitpngReceipt />} />}
          {(role === "admin") && <Route path='/DivineitpngReceiptPrint' element={<DivineitpngReceiptPrint />} />}
          {(role === "admin") && <Route path="/DivineitpngReceiptList" element={<DivineitpngReceiptList />} />}
          {(role === "admin") && <Route path="/DivineitpngReceiptTrash" element={<DivineitpngReceiptTrash />} />}
          {/* End of Divineitpng BILLINGS */}
         



          <Route path="*" element={<Navigate to="/Divineitpngdashboard" />} />
        </Routes>
      </div>
      
    </div>
  );
};

export default Admin;
