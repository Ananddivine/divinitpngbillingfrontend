import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance/axiosInstance";
import * as XLSX from 'xlsx';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { FaDownload, FaMailBulk, FaSync, FaPrint, FaWhatsapp } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import styles for toast

const ManagePos = () => {
  const [pos, setPo] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null); // Track which dropdown is open
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clickCount, setClickCount] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPoId, setSelectedPoId] = useState(null);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [filteredPos, setFilteredPo] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7; // Adjust as needed
  const totalPages = Math.ceil(filteredPos.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const pageNumbers = [...Array(totalPages).keys()].map((num) => num + 1);
  const currentItems = filteredPos.slice(indexOfFirstItem, indexOfLastItem);

  const [dateRange, setDateRange] = useState({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
      });
  
    
      // Toggle Search Input
      const toggleSearch = () => {
        setShowSearch((prev) => !prev);
        if (!showSearch) {
          setSearchInput('');
          setFilteredPo(pos);
        }
      };
  
    // Toggle Date Filter
    const toggleDateFilter = () => {
      setShowDateFilter((prev) => !prev);
      if (!showDateFilter) {

        setFilteredPo(pos);
      }
    };

          // Function to trigger modal
      const confirmDeletePo = (poId) => {
        setSelectedPoId(poId);
        setShowDeleteModal(true);
      };
    
      // Handle Search Input Change
      const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchInput(query);
        filterpos(query);
      };
    
      // Filter pos Based on Search Input
      const filterpos = (query) => {
        if (!query.trim()) {
          setFilteredPo(pos);
          return;
        }
        const filtered = pos.filter((vender) =>
          Object.values(vender).some((value) =>
            String(value).toLowerCase().includes(query.toLowerCase())
          )
        );
        setFilteredPo(filtered);
      };
    
  
  // Handle Date Selection
  const handleDateChange = (ranges) => {
    const { startDate, endDate } = ranges.selection;
    
    // Ensure date range is properly set
    setDateRange({ startDate, endDate, key: "selection" });

    
    // Filter pos by selected date range
    const filtered = pos.filter((po) => {
      const poDate = new Date(po.poDate);
      return poDate >= new Date(startDate).setHours(0, 0, 0, 0) && 
             poDate <= new Date(endDate).setHours(23, 59, 59, 999);
    });
  
    setFilteredPo(filtered);
  
    // Handling closing logic
    if (startDate.getTime() === endDate.getTime()) {
      // Single date clicked, wait for double-click to close
      if (clickCount === 1) {
        setShowDateFilter(false);
        setClickCount(0);
      } else {
        setClickCount(1);
        setTimeout(() => setClickCount(0), 300); // Reset click count after delay
      }
    } else {
      // Multi-date selection: Close calendar after second date is selected
      setShowDateFilter(false);
    }
  };
  


      // Export data to Excel
      const exportToExcel = () => {
        if (filteredPos.length === 0) {
          alert('No data to export!');
          return;
        }
      
        // Format data to exclude '_id' and make 'products' readable
        const formattedData = filteredPos.map(item => ({
          poNumber: item.poNumber,
          venderName: item.venderName,
          venderEmail: item.venderEmail,
          venderNumber: item.venderNumber,
          gstNumber: item.gstNumber,
          poDate: item.poDate,
          taxPercent: item.taxPercent,
          products: item.products.map(p => `${p.name} (Qty: ${p.quantity}, Price: ${p.price})`).join('; '),
          subtotal: item.subtotal,
          tax: item.tax,
          total: item.total,
        }));
      
        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'pos');
        XLSX.writeFile(workbook, 'Filtered_pos.xlsx');
      };
  

      const fetchPo = async () => {
        setLoading(true);
        try {
          const response = await axiosInstance.get("/api/po/all");
          setPo(response.data);
          setFilteredPo(response.data);
          console.log("fetched po:", response.data)
        } catch (error) {
          console.error("Error fetching pos:", error);
          setError("Failed to fetch pos.");
        } finally {
          setLoading(false);
        }
      };
      
      // Initial fetch
      useEffect(() => {
        fetchPo();
      }, []);
      

  // Navigate to Download po Page
  const handleWhatsapp = (po) => {
    navigate(`/Divineitpng-po/${po._id}`);
  };
  

  // Delete po
  // Delete po function with modal confirmation
const deletePo = async () => {
  if (!selectedPoId) return;

  try {
    const response = await axiosInstance.delete(`/api/po/delete/${selectedPoId}`);
    if (response.status === 200) {
      setPo((prevPos) => prevPos.filter((po) => po._id !== selectedPoId));
      setFilteredPo((prevPos) => prevPos.filter((po) => po._id !== selectedPoId));
      toast.success("po deleted successfully!");
    } else {
      alert(response.data.message || "Failed to delete the po");
    }
  } catch (error) {
    console.error("Error deleting po:", error);
    toast.error("Failed to delete the po.");
  } finally {
    setShowDeleteModal(false);
    setSelectedPoId(null);
  }
};

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const handelEditpo = (po) =>{
    navigate("/DivineitpngPoEdit", { state: po });
  }


    return (
      <div className="w-full mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">PARTS ORDER</h1>
  
       <div className="bg-gray-300 ml-2 mr-2 py-2 px-3">
         {/* Controls: Search, Date Range & Export */}
         <div className="sticky top-0 z-10 p-4 flex items-center gap-4 font-bold">
          <button
            onClick={toggleSearch}
            className="ml-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold px-4 py-2 rounded transition-all duration-300"
          >
            {showSearch ? "Hide Search" : "Search Pos 🔍"}
          </button>
  
          <button
            onClick={toggleDateFilter}
            className="bg-gray-800 hover:bg-gray-700 text-white font-semibold px-4 py-2 rounded transition-all duration-300 "
          >
            {showDateFilter ? "Hide Date Filter" : "Show Date Filter 📅"}
          </button>
  
          <button
            onClick={exportToExcel}
            className="bg-gray-800 hover:bg-gray-700 text-white font-semibold px-4 py-2 rounded transition-all duration-300"
          >
            Export to Excel 📄
          </button>

          <button
  onClick={fetchPo}
  className="bg-gray-800 hover:bg-gray-700 text-white font-semibold px-4 py-2 rounded flex items-center gap-2 transition-all duration-300"
>
  <FaSync /> Refresh Table
</button>
  </div>

    {/* Search Input */}
    {showSearch && (
          <div className="mb-4 mt-3">
            <input
              type="text"
              placeholder="Search pos..."
              className="border border-gray-400 px-3 py-2 rounded-lg w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchInput}
              onChange={handleSearchChange}
            />
          </div>
        )}
  
        {/* Date Picker */}
        {/* Date Picker Container */}
<div className="relative">
  {showDateFilter && (
    <div className="absolute top-full left-0 bg-white shadow-lg border rounded-lg z-50">
      <DateRange
        ranges={[dateRange]}
        onChange={handleDateChange}
        moveRangeOnFirstSelection={false}
        className="border rounded"
      />
    </div>
  )}
</div>


        
  <div className=" space-x-2 ml-10">
      <button
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className="px-3 py-1 bg-gray-800 text-white rounded disabled:opacity-50"
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
          className={`px-3 py-1 rounded ${
            currentPage === number
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-black"
          }`}
        >
          {number}
        </button>
      ))}

      <button
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage >= totalPages}
        className="px-3 py-1 bg-gray-800 text-white rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>      
       </div>

        {pos.length === 0 ? (
          <p>No pos found</p>
        ) : (
          <div className="overflow-visible pb-12 mr-4 mt-4">
            <table className="w-full border-collapse border border-gray-300 bg-white shadow-md font-semibold ml-2">
              <thead>
                <tr className="bg-gray-100 font-semibold">
                  <th className="border p-3 text-left">PO No</th>
                  <th className="border p-3 text-left">Date</th>
                  <th className="border p-3 text-left">vender</th>
                  <th className="border p-3 text-left">Total (₹)</th>
                  <th className="border p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((po, index) => (

                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="border p-3">{po.poNumber}</td>
                      <td className="border p-3">
                        {new Date(po.poDate).toLocaleDateString()}
                      </td>
                      <td className="border p-3">{po.venderName || "N/A"}</td>
                      <td className="border p-3">₹{po.total}</td>
                      <td className="border p-3 text-center relative">
                        <button
                          onClick={() =>
                            setOpenDropdown(
                              openDropdown === po._id ? null : po._id
                            )
                          }
                          className="bg-gray-900 text-white p-2 rounded hover:bg-gray-700"
                        >
                          ⚙️ Actions
                        </button>
  
                        {openDropdown === po._id && (
                        <div className="absolute left-0 mt-2 w-40 bg-gray-950 text-white border rounded shadow-lg z-10">
                      

                        <button
                          onClick={() => handleWhatsapp(po)}
                          className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-700"
                        >
                          <FaWhatsapp className="mr-2" /> Whatsapp
                        </button>

                        <button
                          onClick={() => handelEditpo(po)}
                          className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-700"
                        >
                          <FaMailBulk className="mr-2" /> Edit po
                        </button>

                        <button onClick={() => confirmDeletePo(po._id)} className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-700">
                            <span className="mr-2">🗑️</span> Move To Trash
                        </button>
                        {showDeleteModal && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                              <div className="bg-white p-6 rounded-lg shadow-lg">
                                <h2 className="text-lg font-semibold mb-4 text-gray-700">Confirm Deletion</h2>
                                <p className="text-gray-700">Are you sure you want to delete this po?</p>
                                <div className="flex justify-end mt-4">
                                  <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-4 py-2 mr-2 bg-gray-900 text-white rounded-lg hover:bg-gray-600"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={deletePo}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                      </div>                      
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="border px-4 py-2 text-center">
                      No pos found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        <ToastContainer />
      </div>
    );
  };
  
  export default ManagePos;
  