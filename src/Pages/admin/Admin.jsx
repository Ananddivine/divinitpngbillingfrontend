import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../../Components/SideBar/Sidebar';
import AddProduct from '../../Components/addProduct/AddProduct';
import ListProduct from '../../Components/ListProduct/ListProduct';
import ClintOrders from '../../Components/Orders/ClintOrders';
import FileUpload from '../../Components/FileUpload/FileUpload';
import ManageFiles from '../../Components/ManageFiles/ManageFiles';
import Products from '../../Components/Products/Products';


// SkylapitBILLING
import SkylapitInvoice from '../../Components/Skylapit/SkylapitInvoice';
import SkylapitBilling from '../../Components/Skylapit/SkylapitBilling';
import SkylapitCustomers from '../../Components/Skylapit/SkylapitCustomers';
import SkylapitPrint from '../../Components/Skylapit/SkylapitPrint'
import SkylapitDownloadInvoice from '../../Components/Skylapit/SkylapitDownloadInvoice';
import SkylapitDashboard from '../../Components/Dashboard/Skylapitdashboard';
import SkylapitStockManagement from '../../Components/Skylapit/SkylapitStockManagement';
import SkylapitTrash from '../../Components/Trash/SkylapitTrash';
import SkylapitSendEmailInvoicesCustom from '../../Components/Skylapit/SkylapitSendEmailInvoicesCustom';
import SkylapitTask from '../../Components/Tasks/SkylapitTask';
import { BarChartSkeleton, PieChartSkeleton } from '../../Components/Skeleton/BarChartSkeleton';
import Skylapitbillingediting from '../../Components/Skylapit/Skylapitbillingediting';
import SkylapitCreateTask from '../../Components/Tasks/SkylapitCreateTask';
import SkylapitShowTask from '../../Components/Tasks/SkylapitShowTask';
import CreatePo from '../../Components/SkylapitPo/CreatePo';
import ManagePos from '../../Components/SkylapitPo/ManagePos';
import SkylapitPoTrash from '../../Components/SkylapitPo/SkylapitPoTrash';
import SkylapitPoEdit from '../../Components/SkylapitPo/SkylapitPoEdit';
import SkylapitReceipt from '../../Components/Skylapit/SkylapitReceipt';
import SkylapitReceiptPrint from '../../Components/Skylapit/SkylapitReceiptPrint';
import SkylapitReceiptList from '../../Components/Skylapit/SkylapitReceiptList';
import SkylapitReceiptTrash from '../../Components/Skylapit/SkylapitReceiptTrash';




import Footer from '../../Components/Footer/Footer';
import SkylapitTaskTrash from '../../Components/Tasks/SkylapitTaskTrash';
import SkylapitWhatsappInvoice from '../../Components/Skylapit/SkylapitWhatsappInvoice';







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
          

          {/* Skylapit BILLINGS */}
          {(role === "admin" || role === "staff" ) && <Route path='/Skylapitdashboard' element={<SkylapitDashboard />} />}
          {(role === "admin" || role === "staff" ) && <Route path='/SkylapitStockManagement' element={<SkylapitStockManagement />} />}
          {(role === "admin" || role === "staff" ) && <Route path='/SkylapitStockManagement/:stockId' element={<SkylapitStockManagement />} />}
          {(role === "admin" || role === "staff" ) && <Route path='/SkylapitInvoice' element={<SkylapitInvoice />} />}
          {(role === "admin" || role === "staff" ) && <Route path='/Skylapitbilling' element={<SkylapitBilling />} />}
          {(role === "admin" || role === "staff" ) && <Route path='/SkylapitCustomers' element={<SkylapitCustomers />} />}
          {(role === "admin" || role === "staff" ) && <Route path='/Skylapitprint' element={<SkylapitPrint/>} />}
          {(role === "admin" || role === "staff" ) && <Route path='/Skylapitdownload-invoice' element={<SkylapitDownloadInvoice />} />}
          {(role === "admin" || role === "staff" ) && <Route path='/SkylapitSendEmailInvoicesCustom' element={<SkylapitSendEmailInvoicesCustom/>} />}
          {(role === "admin" || role === "staff" ) && <Route path='/SkylapitTrash' element={<SkylapitTrash/>} />}
          {(role === "admin" || role === "staff" ) && <Route path='/SkylapitTask' element={<SkylapitTask/>} />}
          {(role === "admin" || role === "staff" ) && <Route path='/Skylapitbillingediting' element={<Skylapitbillingediting/>} />}
          {(role === "admin" || role === "staff" ) && <Route path='/SkylapitCreateTask' element={<SkylapitCreateTask/>} />}
          {(role === "admin" || role === "staff" ) && <Route path='/Skylapitshowtask/:taskId' element={<SkylapitShowTask />} />}      
          {(role === "admin" || role === "staff" ) && <Route path='/createpo' element={<CreatePo />} />}
          {(role === "admin" || role === "staff" ) && <Route path='/Managepos' element={<ManagePos />} />}
          {(role === "admin" || role === "staff" ) && <Route path='/SkylapitPoTrash' element={<SkylapitPoTrash />} />}
          {(role === "admin" || role === "staff" ) && <Route path='/SkylapitPoEdit' element={<SkylapitPoEdit />} />}
          {(role === "admin" || role === "staff" ) && <Route path='/SkylapitTaskTrash' element={<SkylapitTaskTrash />} />}
          {(role === "admin" || role === "staff" ) && <Route path='/SkylapitWhatsappInvoice' element={<SkylapitWhatsappInvoice />} />}
          {(role === "admin") && <Route path='/SkylapitReceipt' element={<SkylapitReceipt />} />}
          {(role === "admin") && <Route path='/SkylapitReceiptPrint' element={<SkylapitReceiptPrint />} />}
          {(role === "admin") && <Route path="/SkylapitReceiptList" element={<SkylapitReceiptList />} />}
          {(role === "admin") && <Route path="/SkylapitReceiptTrash" element={<SkylapitReceiptTrash />} />}
          {/* End of Skylapit BILLINGS */}
         



          <Route path="*" element={<Navigate to="/Skylapitdashboard" />} />
        </Routes>
      </div>
      
    </div>
  );
};

export default Admin;
