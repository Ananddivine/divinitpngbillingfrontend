import { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance/axiosInstance";
import * as XLSX from 'xlsx';
import { DateRange } from 'react-date-range';
import { format } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { FaArrowUp, FaCalendar } from 'react-icons/fa'

function Products() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchSerials, setSearchSerials] = useState([]);
  const [searchError, setSearchError] = useState('');
  const [showSearch, setShowSearch] = useState(false);
   const [clickCount, setClickCount] = useState(0);
   const [showDateFilter, setShowDateFilter] = useState(false);
       const [dateRange, setDateRange] = useState({
         startDate: new Date(),
         endDate: new Date(),
         key: 'selection',
       });
       const [displayDate, setDisplayDate] = useState('');
  
  // Toggle Search Input
  const toggleSearch = () => {
    setShowSearch((prev) => !prev);
    if (!showSearch) {
      setSearchInput('');
      setSearchSerials([]);
      setSearchError('');
    }
  };

     // Toggle Date Filter
     const toggleDateFilter = () => {
      setShowDateFilter((prev) => !prev);
      if (!showDateFilter) {
        setDisplayDate('');
        setShowDateFilter(devices);
      }
    };

    // Handle Date Selection
  const handleDateChange = (ranges) => {
    const { startDate, endDate } = ranges.selection;
    
    // Ensure date range is properly set
    setDateRange({ startDate, endDate, key: "selection" });
    setDisplayDate(`${format(startDate, "yyyy-MM-dd")} to ${format(endDate, "yyyy-MM-dd")}`);
    
    // Filter devices by selected date range
    const filtered = devices.filter((device) => {
      const deviceDate = new Date(device.deviceDate);
      return deviceDate >= new Date(startDate).setHours(0, 0, 0, 0) && 
             deviceDate <= new Date(endDate).setHours(23, 59, 59, 999);
    });
  
    setShowDateFilter(filtered);
  
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

  // Handle Enter Key to Add Serial
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchInput.trim()) {
      const newSerial = searchInput.trim();
      if (searchSerials.includes(newSerial)) {
        setSearchError('Serial number already added!');
        return;
      }

      const matchedDevice = devices.find((device) => device.serial_number === newSerial);
      if (matchedDevice) {
        setSearchSerials([...searchSerials, newSerial]);
        setSearchInput('');
        setSearchError('');
      } else {
        setSearchError(`No match found for "${newSerial}"`);
      }
    }
  };

  // Remove Serial from List
  const removeSerial = (serial) => {
    setSearchSerials(searchSerials.filter((s) => s !== serial));
    setSearchError('');
  };

  // Filter devices based on entered serials
  const filteredDevices = searchSerials.length
    ? devices.filter((device) => searchSerials.includes(device.serial_number))
    : devices;

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await axiosInstance.get("/api/device");
        setDevices(response.data);
        console.log('fetched devices:', response.data)
      } catch (error) {
        console.error("Error fetching devices:", error);
      }
    };
    fetchDevices();
  }, []);

  // Get Location
  const getLocation = async (serialNumber) => {
    setLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await axiosInstance.post("/api/location", {
              serial_number: serialNumber,
              location: { latitude, longitude },
            });

            // Update location for the specific device
            setDevices((prevDevices) =>
              prevDevices.map((device) =>
                device.serial_number === serialNumber
                  ? {
                      ...device,
                      location: {
                        latitude,
                        longitude,
                        address: response.data.device.location.address,
                      },
                    }
                  : device
              )
            );
            setLoading(false);
          } catch (error) {
            console.error("Error updating location:", error);
            setLoading(false);
          }
        },
        (error) => {
          console.error("Error fetching location:", error);
          setLoading(false);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
      setLoading(false);
    }
  };

  // Export to Excel
  const exportToExcel = () => {
    const exportData = filteredDevices.map((device) => ({
      "Serial Number": device.serial_number,
      Model: device.model || "N/A",
      Config: device.config || "N/A",
      Latitude: device.location?.latitude || "N/A",
      Longitude: device.location?.longitude || "N/A",
      Address: device.location?.address || "N/A",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Devices");
    XLSX.writeFile(workbook, `Devices_${format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}.xlsx`);
  };

  // Handle Date Selection
  
 
  
  return (
    <div className="p-4 bg-gray-100 w-full">
      {/* 🔍 Toggle Search Button */}
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={toggleSearch}
          className="bg-gray-500 hover:bg-gray-700 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-300"
        >
          {showSearch ? "Hide Search" : "Search Devices 🔍"}
        </button>

       
        <button
            onClick={toggleDateFilter}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-300"
          >
            {showDateFilter ? "Hide Date Filter" : "Show Date Filter 📅"}
          </button>

         {/* 📤 Export to Excel Button */}
         <button
  onClick={exportToExcel}
  className="bg-gray-500 hover:bg-gray-700 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2"
>
  Export to Excel <FaArrowUp />
</button>


      </div>

      {/* 🔍 Search Input with Inline Serial Numbers (Visible when toggled) */}
      {showSearch && (
        <div className="mb-4 relative mt-3">
          <div className="flex flex-wrap items-center gap-2 border border-gray-400 px-3 py-2 rounded-lg w-full md:w-80 bg-white">
            {searchSerials.map((serial) => (
              <div
                key={serial}
                className="bg-blue-500 text-white px-2 py-1 rounded-full flex items-center space-x-1"
              >
                <span>{serial}</span>
                <button
                  className="ml-1 text-xs hover:bg-blue-700 px-2 rounded-full"
                  onClick={() => removeSerial(serial)}
                >
                  ✖️
                </button>
              </div>
            ))}

            <input
              type="text"
              placeholder="Enter Serial & Press Enter"
              className="flex-1 outline-none"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>
      )}

      {/* 📅 Date Range Selector */}
       {/* Date Picker */}
              {showDateFilter && (
                <div className="mb-4">
                  <DateRange
                    ranges={[dateRange]}
                    onChange={handleDateChange}
                    moveRangeOnFirstSelection={false}
                    className="border rounded"
                  />
                </div>
          )}
      {/* 🔔 Error Message */}
      {searchError && <p className="text-red-600 font-semibold mb-3">{searchError}</p>}

      {/* 📋 Table Display */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 bg-white shadow-lg rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="border border-gray-300 px-4 py-2 text-left">Serial Number</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Model & Config</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
              {/* <th className="border border-gray-300 px-4 py-2 text-left">Location</th> */}
            </tr>
          </thead>

          <tbody>
            {filteredDevices.length > 0 ? (
              filteredDevices.map((device, index) => (
                <tr
                  key={device.serial_number}
                  className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-slate-100'} hover:bg-gray-200 pb-10`}
                >
                  <td className="border border-gray-300 px-4 py-2">
                    {device.serial_number}
                  </td>
                  <td className="border border-gray-300 px-4 py-1 text-sm">
                    <p>{device.model || 'N/A'}</p>
                    <p>{device.config || 'N/A'}</p>
                  </td>
                  <td className="border border-gray-300 px-4 py-1 text-sm"> <p>In OFFICE</p></td>
                  {/* <td className="border border-gray-300 px-4 py-2">
                    {device.location ? (
                      <>
                        <p>{device.location.latitude}</p>
                        <p>{device.location.longitude}</p>
                        <p>{device.location.address}</p>
                        <a
                          href={`https://www.google.com/maps?q=${device.location.latitude},${device.location.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View on Map 🌍
                        </a>
                      </>
                    ) : (
                      <button
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
                        onClick={() => getLocation(device.serial_number)}
                        disabled={loading}
                      >
                        {loading ? 'Fetching Location...' : 'Get Location'}
                      </button>
                    )}
                  </td> */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center text-gray-500 py-4">
                  No devices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Products;
