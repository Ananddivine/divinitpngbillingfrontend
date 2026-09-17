import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance/axiosInstance';
import { DateRange } from 'react-date-range';
import { format } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import styles for toast
import {exportCustomersExcel} from '../utils/ExportExcell'

const SkylapitCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  });
  const [showCalendar, setShowCalendar] = useState(false);
  const [displayDate, setDisplayDate] = useState('');

  // Toggle Search Input
  const toggleSearch = () => {
    setShowSearch((prev) => !prev);
    if (!showSearch) {
      setSearchInput('');
      setFilteredCustomers(customers);
    }
  };

  // Handle Search Input Change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchInput(query);
    filterCustomers(query);
  };

  // Filter Customers Based on Search Input
  const filterCustomers = (query) => {
    if (!query.trim()) {
      setFilteredCustomers(customers);
      return;
    }
    const filtered = customers.filter((customer) =>
      Object.values(customer).some((value) =>
        String(value).toLowerCase().includes(query.toLowerCase())
      )
    );
    setFilteredCustomers(filtered);
  };

  // Handle date range selection
  const handleDateChange = (ranges) => {
    const { startDate, endDate } = ranges.selection;
    setDateRange(ranges.selection);
    const formattedStart = format(startDate, 'yyyy-MM-dd');
    const formattedEnd = format(endDate, 'yyyy-MM-dd');
    setDisplayDate(`${formattedStart} to ${formattedEnd}`);
    setShowCalendar(true);

    // Filter customers based on the selected date range
    const filtered = customers.filter((customer) => {
      const invoiceDate = new Date(customer.invoiceDate);
      const start = new Date(startDate).setHours(0, 0, 0, 0);
      const end = new Date(endDate).setHours(23, 59, 59, 999);
      return invoiceDate >= start && invoiceDate <= end;
    });
    
    setFilteredCustomers(filtered);
  };

  // Fetch Customers from API
  const fetchCustomers = async () => {
    try {
      const response = await axiosInstance.get('/api/invoices/all');
      const data = response.data;
      setCustomers(data);
      setFilteredCustomers(data);
      console.log("Fetched customers data", data);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      toast.error('Failed to fetch customers:', error);
    }
  };
  
  // Fetch customers on component mount
  useEffect(() => {
    fetchCustomers();
  }, []);
  

  

  const markAsPaid = async (invoiceNumber) => {
    try {
      await axiosInstance.post('/api/update-payment', {
        invoiceNumber,
        paymentStatus: 'Paid',
      });
      toast.success('Payment Status Updated Successfully!')
      // Fetch updated customers list after marking as paid
      fetchCustomers();
    } catch (error) {
      console.error('Failed to update payment status:', error);
      toast.error('Failed to update payment status:', error);
    }
  };
  

    return (
      <div className="pb-14">
        {/* Fixed Header */}
        <div className="sticky mt-3 ml-2 mr-2 px-3 py-2  border bg-gray-300  shadow-md z-20">
          <h2 className="text-xl font-bold mb-4 font-poppins">Customers</h2>
    
          {/* Controls: Search, Date Range & Export */}
          <div className="flex items-center gap-4 mb-4">
            {/* Toggle Search Button */}
            <button
              onClick={toggleSearch}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-300 font-poppins"
            >
              {showSearch ? 'Hide Search' : 'Search Customers 🔍'}
            </button>
    
            {/* Date Range Picker */}
            <div className="relative w-64">
              <input
                type="text"
                readOnly
                placeholder="Select Date Range"
                value={displayDate}
                onClick={() => setShowCalendar(!showCalendar)}
                className="border border-gray-400 px-3 py-2 rounded-lg w-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins"
              />
              {displayDate && (
                <button
                  onClick={() => {
                    setDisplayDate('');
                    setFilteredCustomers(customers);
                  }}
                  className="absolute top-2 right-3 text-gray-500 hover:text-red-600 font-poppins"
                >
                  ❌
                </button>
              )}
              {showCalendar && (
                <div className="absolute z-50 bg-white shadow-lg">
                  <DateRange
                    ranges={[dateRange]}
                    onChange={handleDateChange}
                    moveRangeOnFirstSelection={false}
                    className="border rounded font-poppins"
                  />
                </div>
              )}
            </div>
    
            {/* Export Button */}
            <button
             onClick={() => exportCustomersExcel(filteredCustomers)}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-300 font-poppins"
            >
              Export to Excel 📄
            </button>
          </div>
    
          {/* Search Input */}
          {showSearch && (
            <div className="mb-4 mt-3">
              <input
                type="text"
                placeholder="Search customers..."
                className="border border-gray-400 px-3 py-2 rounded-lg w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins"
                value={searchInput}
                onChange={handleSearchChange}
              />
            </div>
          )}
        </div>
        <div className="overflow-none ml-2 mr-2">
        {/* Scrollable Table Container */}
        <div className="max-h-[400px] overflow-y-auto overflow-x-auto border rounded mt-4 -z-10">
          <table className="w-full border-collapse border border-gray-400">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="border p-2">Laptop Jobnumber</th>
                <th className="border p-2">Customer</th>
                <th className="border p-2">Total</th>
                <th className="border p-2">Payment Status</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.invoiceNumber} className='hover:bg-gray-100'>
                  <td className="border border-gray-300 px-2 py-3">{customer.jobNumber}</td>
                  <td className="border border-gray-300 px-2 py-3">{customer.customerName}</td>
                  <td className="border border-gray-300 px-2 py-3">K{customer.total}</td>
                  <td className="border border-gray-300 px-2 py-3">
                    <span
                      className={`px-2 py-1 text-white text-sm font-semibold rounded-md 
                        ${customer.paymentStatus === "Paid" ? "bg-green-500" : "bg-red-500"}`}
                    >
                      {customer.paymentStatus}
                    </span>
                  </td>
                  <td className="border p-2">
                    {customer.paymentStatus !== "Paid" && (
                      <button
                        onClick={() => markAsPaid(customer.invoiceNumber)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-4 py-1 rounded-md font-semibold"
                      >
                        Mark as Paid
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
          <ToastContainer />
      </div>
    );
  }

export default SkylapitCustomers;
