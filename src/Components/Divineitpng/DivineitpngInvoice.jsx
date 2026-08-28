import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance/axiosInstance";
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { FaDownload, FaMailBulk, FaSync, FaPrint, FaWhatsapp } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import {exportToExcel} from "../utils/ExportExcell"



const DivineitpngInvoice = () => {
  const [invoices, setInvoices] = useState([]);
  const [sendingMonthlyReport, setSendingMonthlyReport] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null); // { id, top, left }
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clickCount, setClickCount] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [filteredinvoices, setFilteredinvoices] = useState([]);
  const itemsPerPage = 20; // Adjust as needed
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredinvoices.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const pageNumbers = [...Array(totalPages).keys()].map((num) => num + 1);
  const currentItems = filteredinvoices.slice(indexOfFirstItem, indexOfLastItem);
  const dropdownRef = useRef(null);
  const buttonRefs = useRef({});
  const [dateRange, setDateRange] = useState({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
      });

  const ACTION_MENU_WIDTH = 192;
  const ACTION_MENU_HEIGHT = 260;
  const VIEWPORT_GAP = 12;
  
    
      // Toggle Search Input
      const toggleSearch = () => {
        setShowSearch((prev) => !prev);
        if (!showSearch) {
          setSearchInput('');
          setFilteredinvoices(invoices);
        }
      };
  
    // Toggle Date Filter
    const toggleDateFilter = () => {
      setShowDateFilter((prev) => !prev);
      if (!showDateFilter) {

        setFilteredinvoices(invoices);
      }
    };

          // Function to trigger modal
      const confirmDeleteInvoice = (invoiceId) => {
        setSelectedInvoiceId(invoiceId);
        setShowDeleteModal(true);
      };
    
      // Handle Search Input Change
      const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchInput(query);
        filterinvoices(query);
      };
    
      // Filter invoices Based on Search Input
      const filterinvoices = (query) => {
        if (!query.trim()) {
          setFilteredinvoices(invoices);
          return;
        }
        const filtered = invoices.filter((customer) =>
          Object.values(customer).some((value) =>
            String(value).toLowerCase().includes(query.toLowerCase())
          )
        );
        setFilteredinvoices(filtered);
      };
    
  
  // Handle Date Selection
  const handleDateChange = (ranges) => {
    const { startDate, endDate } = ranges.selection;    
    // Ensure date range is properly set
    setDateRange({ startDate, endDate, key: "selection" });    
    // Filter invoices by selected date range
    const filtered = invoices.filter((invoice) => {
      const invoiceDate = new Date(invoice.invoiceDate);
      return invoiceDate >= new Date(startDate).setHours(0, 0, 0, 0) && 
             invoiceDate <= new Date(endDate).setHours(23, 59, 59, 999);
    });  
    setFilteredinvoices(filtered); 
      if (startDate.getTime() === endDate.getTime()) {   
      if (clickCount === 1) {
        setShowDateFilter(false);
        setClickCount(0);
      } else {
        setClickCount(1);
        setTimeout(() => setClickCount(0), 300); 
      }
    } else {     
      setShowDateFilter(false);
    }
  };
    
      
 
  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/api/invoices/all");
      setInvoices(response.data);
      setFilteredinvoices(response.data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      setError("Failed to fetch invoices.");
    } finally {
      setLoading(false);
    }
  };
    useEffect(() => {
      fetchInvoices();
    }, []);

  useEffect(() => {
    if (!openDropdown) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      const menu = dropdownRef.current;
      const button = buttonRefs.current[openDropdown.id];

      if (menu?.contains(event.target) || button?.contains(event.target)) {
        return;
      }

      setOpenDropdown(null);
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [openDropdown]);

  

  const handlePrint = (invoice) => {sessionStorage.setItem('hasRefreshed', 'false');  navigate("/Divineitpngprint", { state: invoice });};
  const handleDownloadPDF = (invoice) => {navigate("/Divineitpngdownload-invoice", { state: invoice });};
  const handleSendEmail = (invoice) => {navigate("/DivineitpngSendEmailInvoicesCustom", { state: invoice });};
  const handleWhatsApp = (invoice) => {navigate("/DivineitpngWhatsappInvoice", { state: invoice });};

  const handleSendMonthlyReport = async () => {
    setSendingMonthlyReport(true);

    try {
      const response = await axiosInstance.post("/api/invoices/monthly-report/send", {
        period: "current",
      });

      toast.success(response.data.message || "Monthly report sent successfully!");
    } catch (error) {
      console.error("Error sending monthly report:", error);
      toast.error(error.response?.data?.message || "Failed to send monthly report.");
    } finally {
      setSendingMonthlyReport(false);
    }
  };


const deleteInvoice = async () => {
  if (!selectedInvoiceId) return;

  try {
    const response = await axiosInstance.delete(`/api/invoices/delete/${selectedInvoiceId}`);
    if (response.status === 200) {
      setInvoices((prevInvoices) => prevInvoices.filter((invoice) => invoice._id !== selectedInvoiceId));
      setFilteredinvoices((prevInvoices) => prevInvoices.filter((invoice) => invoice._id !== selectedInvoiceId));
      toast.success("Invoice deleted successfully!");
    } else {
      alert(response.data.message || "Failed to delete the invoice");
    }
  } catch (error) {
    console.error("Error deleting invoice:", error);
    toast.error("Failed to delete the invoice.");
  } finally {
    setShowDeleteModal(false);
    setSelectedInvoiceId(null);
  }
};

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const handelEditinvoice = (invoice) =>{
    navigate("/Divineitpngbillingediting", { state: invoice });
  }

  const toggleActionMenu = (invoiceId) => {
    if (openDropdown?.id === invoiceId) {
      setOpenDropdown(null);
      return;
    }

    const button = buttonRefs.current[invoiceId];
    if (!button) {
      return;
    }

    const rect = button.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const showAbove = spaceBelow < ACTION_MENU_HEIGHT && rect.top > ACTION_MENU_HEIGHT;

    let top = showAbove
      ? rect.top - ACTION_MENU_HEIGHT - 8
      : rect.bottom + 8;

    let left = rect.right - ACTION_MENU_WIDTH;

    if (left < VIEWPORT_GAP) {
      left = VIEWPORT_GAP;
    }

    if (left + ACTION_MENU_WIDTH > window.innerWidth - VIEWPORT_GAP) {
      left = window.innerWidth - ACTION_MENU_WIDTH - VIEWPORT_GAP;
    }

    if (top < VIEWPORT_GAP) {
      top = VIEWPORT_GAP;
    }

    if (top + ACTION_MENU_HEIGHT > window.innerHeight - VIEWPORT_GAP) {
      top = Math.max(VIEWPORT_GAP, window.innerHeight - ACTION_MENU_HEIGHT - VIEWPORT_GAP);
    }

    setOpenDropdown({ id: invoiceId, top, left });
  };

  return (
    <div className="w-full mx-auto px-4 pb-14 pt-6">
      {/* Fixed Header Section */}
      <div className="rounded-[28px] border border-[#dfd3c3] bg-[linear-gradient(180deg,rgba(255,253,250,0.98),rgba(255,248,239,0.96))] px-5 py-5 shadow-[0_18px_45px_rgba(73,47,24,0.08)]">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">Invoice Desk</span>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Invoices</h1>
            <p className="mt-2 text-sm text-stone-600">Search, filter, export, and manage all Divineitpng billing records.</p>
          </div>
          <div className="rounded-2xl border border-[#dfd3c3] bg-white/70 px-4 py-3 text-sm text-stone-600">
            Showing {currentItems.length} of {filteredinvoices.length} invoices
          </div>
        </div>
  
        {/* Controls: Search, Date Range & Export */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <button
            onClick={toggleSearch}
            className="rounded-2xl border border-[#dfd3c3] bg-white/80 px-4 py-3 text-sm font-semibold text-slate-900 transition duration-200 hover:bg-stone-50"
          >
            {showSearch ? "Hide Search" : "Search invoices 🔍"}
          </button>
  
          <button
            onClick={toggleDateFilter}
            className="rounded-2xl border border-[#dfd3c3] bg-white/80 px-4 py-3 text-sm font-semibold text-slate-900 transition duration-200 hover:bg-stone-50"
          >
            {showDateFilter ? "Hide Date Filter" : "Show Date Filter 📅"}
          </button>
  
          <button
             onClick={() => exportToExcel(filteredinvoices)}
            className="rounded-2xl border border-[#dfd3c3] bg-white/80 px-4 py-3 text-sm font-semibold text-slate-900 transition duration-200 hover:bg-stone-50"
          >
            Export to Excel 📄
          </button>

          <button
            onClick={handleSendMonthlyReport}
            disabled={sendingMonthlyReport}
            className="flex items-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#7c2d12,#9a3412)] px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(124,45,18,0.24)] transition duration-200 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <FaMailBulk /> {sendingMonthlyReport ? "Sending Monthly Report..." : "Send Monthly Report"}
          </button>
  
          <button
            onClick={fetchInvoices}
            className="flex items-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#0f766e,#115e59)] px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(15,118,110,0.24)] transition duration-200 hover:brightness-105">
           <FaSync /> Refresh Table
         </button>
        </div>  

        <div className="space-x-2">
  <button
    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
    disabled={currentPage === 1}
    className="rounded-2xl border border-[#dfd3c3] bg-white/80 px-4 py-2 text-sm font-semibold text-slate-900 disabled:opacity-50"
  > Prev
  </button>

  {/* Dynamically display page numbers */}
  {pageNumbers
    .filter((number) => {
      // Show range of pages around the current page
      return (
        number >= currentPage - 2 &&
        number <= currentPage + 2 &&
        number > 0 &&
        number <= totalPages
      );
    })
    .map((number) => (
      <button
        key={number}
        onClick={() => setCurrentPage(number)}
        className={`px-3 py-1 rounded-lg ${
          currentPage === number
            ? "bg-teal-700 text-white"
            : "border border-[#dfd3c3] bg-white/80 text-slate-900"
        }`}
      >
        {number}
      </button>
    ))}

  <button
    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
    disabled={currentPage >= totalPages}
    className="rounded-2xl border border-[#dfd3c3] bg-white/80 px-4 py-2 text-sm font-semibold text-slate-900 disabled:opacity-50"
  >
    Next
  </button>
</div>
  
        {/* Search Input */}
        {showSearch && (
          <div className="mb-4 mt-3">
            <input
              type="text"
              placeholder="Search invoices..."
              className="w-full rounded-2xl border border-[#dfd3c3] bg-white px-4 py-3 outline-none transition duration-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 md:w-96"
              value={searchInput}
              onChange={handleSearchChange}
            />
          </div>
        )}
  
        {/* Date Picker */}
      <div className="relative">
        {showDateFilter && (
          <div className="absolute top-full left-0 z-50 rounded-2xl border border-[#dfd3c3] bg-white shadow-lg">
            <DateRange
              ranges={[dateRange]}
              onChange={handleDateChange}
              moveRangeOnFirstSelection={false}
              className="border rounded"
            />
          </div>
        )}
      </div>
      </div>
  
      {/* Scrollable Table Section */}
      <div className="mt-6 overflow-hidden rounded-[28px] border border-[#dfd3c3] bg-[linear-gradient(180deg,rgba(255,253,250,0.98),rgba(255,248,239,0.96))] shadow-[0_18px_45px_rgba(73,47,24,0.08)]">
        {invoices.length === 0 ? (
          <p className="p-8 text-center text-stone-500">No invoices found</p>
        ) : (
          <table className="mt-0 w-full border-collapse font-semibold">
            <thead className="sticky top-0 z-10 bg-teal-50">
              <tr>
                <th className="border-b border-[#dfd3c3] p-4 text-left text-xs uppercase tracking-[0.14em] text-stone-600">Invoice No</th>
                <th className="border-b border-[#dfd3c3] p-4 text-left text-xs uppercase tracking-[0.14em] text-stone-600">Laptop JobNumber</th>
                <th className="border-b border-[#dfd3c3] p-4 text-left text-xs uppercase tracking-[0.14em] text-stone-600">Date</th>
                <th className="border-b border-[#dfd3c3] p-4 text-left text-xs uppercase tracking-[0.14em] text-stone-600">Customer</th>
                <th className="border-b border-[#dfd3c3] p-4 text-left text-xs uppercase tracking-[0.14em] text-stone-600">Total (K)</th>
                <th className="border-b border-[#dfd3c3] p-4 text-center text-xs uppercase tracking-[0.14em] text-stone-600">Actions</th>
              </tr>
            </thead>
            <tbody >
            {currentItems.length > 0 ? (
                currentItems.map((invoice, index) => (
                  <tr key={index} className="border-b border-[#ece1d4] bg-white/75 hover:bg-stone-50">
                    <td className="p-4">{invoice.invoiceNumber}</td>
                    <td className="p-4">{invoice.jobNumber}</td>
                    <td className="p-4">
                       {new Date(invoice.invoiceDate).toLocaleDateString('en-GB')}
                    </td>
                    <td className="p-4">{invoice.customerName || "N/A"}</td>
                    <td className="p-4">K{invoice.total}</td>
                    <td className="p-4 text-center">
                      <button
                        ref={(element) => {
                          if (element) {
                            buttonRefs.current[invoice._id] = element;
                          } else {
                            delete buttonRefs.current[invoice._id];
                          }
                        }}
                        onClick={() => toggleActionMenu(invoice._id)}
                        className="rounded-2xl border border-[#dfd3c3] bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition duration-200 hover:bg-stone-50"
                      >
                        ⚙️ Actions
                      </button>
  
                      {openDropdown?.id === invoice._id && (
                      <div
                        ref={dropdownRef}
                        className="fixed z-[90] w-48 rounded-2xl border border-[#dfd3c3] bg-white p-2 text-slate-900 shadow-lg"
                        style={{ top: `${openDropdown.top}px`, left: `${openDropdown.left}px` }}
                      >
                      <button
                        onClick={() => {
                          setOpenDropdown(null);
                          handlePrint(invoice);
                        }}
                        className="flex w-full items-center rounded-xl px-4 py-2 text-left hover:bg-stone-100"
                      >
                        <FaPrint className="mr-2" /> Print Invoice
                      </button>
                      <button
                        onClick={() => {
                          setOpenDropdown(null);
                          handleDownloadPDF(invoice);
                        }}
                        className="flex w-full items-center rounded-xl px-4 py-2 text-left hover:bg-stone-100"
                      >
                        <FaDownload className="mr-2" /> Download Invoice
                      </button>
  
                      <button
                        onClick={() => {
                          setOpenDropdown(null);
                          handleSendEmail(invoice);
                        }}
                        className="flex w-full items-center rounded-xl px-4 py-2 text-left hover:bg-stone-100"
                      >
                        <FaMailBulk className="mr-2" /> Send Email
                      </button>

                      <button
                        onClick={() => {
                          setOpenDropdown(null);
                          handleWhatsApp(invoice);
                        }}
                        className="flex w-full items-center rounded-xl px-4 py-2 text-left hover:bg-stone-100"
                      >
                        <FaWhatsapp className="mr-2" /> WhatsApp
                      </button>
  
                      <button
                        onClick={() => {
                          setOpenDropdown(null);
                          handelEditinvoice(invoice);
                        }}
                        className="flex w-full items-center rounded-xl px-4 py-2 text-left hover:bg-stone-100"
                      >
                        <FaMailBulk className="mr-2" /> Edit Invoice
                      </button>
  
                      <button onClick={() => {
                        setOpenDropdown(null);
                        confirmDeleteInvoice(invoice._id);
                      }} className="flex w-full items-center rounded-xl px-4 py-2 text-left text-rose-700 hover:bg-rose-50">
                          <span className="mr-2">🗑️</span> Move To Trash
                      </button>
                    </div>                      
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-10 text-center text-stone-500">
                    No invoices found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-[28px] border border-[#dfd3c3] bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold text-gray-700">Confirm Deletion</h2>
            <p className="text-gray-700">Are you sure you want to delete this invoice?</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="mr-2 rounded-2xl border border-[#dfd3c3] bg-white px-4 py-2 text-sm font-semibold text-slate-900"
              >
                Cancel
              </button>
              <button
                onClick={deleteInvoice}
                className="rounded-2xl bg-[linear-gradient(135deg,#cf3b2f,#b42318)] px-4 py-2 text-sm font-semibold text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
  
  };
  
  export default DivineitpngInvoice;
  
