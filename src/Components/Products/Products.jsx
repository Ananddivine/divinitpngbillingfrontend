import { useEffect, useMemo, useState } from "react";
import axiosInstance from "../axiosInstance/axiosInstance";
import * as XLSX from "xlsx";
import { DateRange } from "react-date-range";
import { format, formatDistanceToNow, startOfDay, endOfDay } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { FaArrowUp } from "react-icons/fa";

const STATUSES = ["In Office", "Rented", "Overdue", "Missing", "Maintenance"];

function Products() {
  const [devices, setDevices] = useState([]);
  const [fetchError, setFetchError] = useState("");

  const [showSearch, setShowSearch] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchSerials, setSearchSerials] = useState([]);
  const [searchError, setSearchError] = useState("");

  // FIX: date filter uses its own state (it used to store an array in a true/false state)
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [dateRange, setDateRange] = useState({ startDate: new Date(), endDate: new Date(), key: "selection" });
  const [appliedRange, setAppliedRange] = useState(null);

  const loadDevices = async () => {
    try {
      const response = await axiosInstance.get("/api/device");
      setDevices(response.data);
      setFetchError("");
    } catch (error) {
      console.error("Error fetching devices:", error);
      setFetchError("Could not load devices. Check that the server is running.");
    }
  };

  useEffect(() => {
    loadDevices();
    const timer = setInterval(loadDevices, 60000); // refresh every minute
    return () => clearInterval(timer);
  }, []);

  // Toggle Search Input
  const toggleSearch = () => {
    setShowSearch((prev) => !prev);
    setSearchInput("");
    setSearchSerials([]);
    setSearchError("");
  };

  // Handle Enter Key to Add Serial
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchInput.trim()) {
      const newSerial = searchInput.trim();
      if (searchSerials.includes(newSerial)) {
        setSearchError("Serial number already added!");
        return;
      }
      if (devices.some((device) => device.serial_number === newSerial)) {
        setSearchSerials([...searchSerials, newSerial]);
        setSearchInput("");
        setSearchError("");
      } else {
        setSearchError(`No match found for "${newSerial}"`);
      }
    }
  };

  const removeSerial = (serial) => {
    setSearchSerials(searchSerials.filter((s) => s !== serial));
    setSearchError("");
  };

  // Serial search + date filter (by the date the device was added)
  const filteredDevices = useMemo(
    () =>
      devices.filter((device) => {
        if (searchSerials.length && !searchSerials.includes(device.serial_number)) return false;
        if (appliedRange) {
          const added = new Date(device.createdAt);
          if (added < startOfDay(appliedRange.startDate) || added > endOfDay(appliedRange.endDate)) return false;
        }
        return true;
      }),
    [devices, searchSerials, appliedRange]
  );

  // Change status (FIX: status used to be hard-coded "In OFFICE")
  const changeStatus = async (serial, status) => {
    try {
      const { data } = await axiosInstance.patch(`/api/device/${encodeURIComponent(serial)}/status`, { status });
      setDevices((prev) => prev.map((d) => (d.serial_number === serial ? data : d)));
    } catch (error) {
      alert("Could not change status.");
    }
  };

  // Export to Excel
  const exportToExcel = () => {
    const exportData = filteredDevices.map((device) => ({
      "Serial Number": device.serial_number,
      Model: device.model || "N/A",
      Config: device.config || "N/A",
      Status: device.status,
      "Last Seen": device.lastSeen ? format(new Date(device.lastSeen), "yyyy-MM-dd HH:mm") : "Never",
      Latitude: device.location?.latitude ?? "N/A",
      Longitude: device.location?.longitude ?? "N/A",
      Address: device.location?.address || "N/A",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Devices");
    XLSX.writeFile(workbook, `Devices_${format(new Date(), "yyyy-MM-dd_HH-mm-ss")}.xlsx`);
  };

  const btn = "bg-gray-500 hover:bg-gray-700 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-300";

  return (
    <div className="p-4 bg-gray-100 w-full ml-6">
      <div className="flex items-center gap-4 mb-4">
        <button onClick={toggleSearch} className={btn}>
          {showSearch ? "Hide Search" : "Search Devices 🔍"}
        </button>
        <button onClick={() => setShowDateFilter((s) => !s)} className={btn}>
          {showDateFilter ? "Hide Date Filter" : "Show Date Filter 📅"}
        </button>
        <button onClick={exportToExcel} className={`${btn} flex items-center gap-2`}>
          Export to Excel <FaArrowUp />
        </button>
      </div>

      {showSearch && (
        <div className="mb-4 relative mt-3">
          <div className="flex flex-wrap items-center gap-2 border border-gray-400 px-3 py-2 rounded-lg w-full md:w-80 bg-white">
            {searchSerials.map((serial) => (
              <div key={serial} className="bg-blue-500 text-white px-2 py-1 rounded-full flex items-center space-x-1">
                <span>{serial}</span>
                <button className="ml-1 text-xs hover:bg-blue-700 px-2 rounded-full" onClick={() => removeSerial(serial)}>
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

      {showDateFilter && (
        <div className="mb-4 inline-block bg-white rounded border">
          <DateRange
            ranges={[dateRange]}
            onChange={(r) => setDateRange(r.selection)}
            moveRangeOnFirstSelection={false}
          />
          <div className="flex gap-2 p-2">
            <button className={btn} onClick={() => { setAppliedRange(dateRange); setShowDateFilter(false); }}>
              Apply
            </button>
            <button
              className="px-4 py-2 rounded-lg border border-gray-400"
              onClick={() => { setAppliedRange(null); setShowDateFilter(false); }}
            >
              Clear
            </button>
          </div>
        </div>
      )}
      {appliedRange && (
        <p className="mb-3 text-sm text-gray-700">
          Devices added {format(appliedRange.startDate, "yyyy-MM-dd")} to {format(appliedRange.endDate, "yyyy-MM-dd")}
        </p>
      )}

      {searchError && <p className="text-red-600 font-semibold mb-3">{searchError}</p>}
      {fetchError && <p className="text-red-600 font-semibold mb-3">{fetchError}</p>}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 bg-white shadow-lg rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="border border-gray-300 px-4 py-2 text-left">Serial Number</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Model & Config</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Last Seen</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Location</th>
            </tr>
          </thead>
          <tbody>
            {filteredDevices.length > 0 ? (
              filteredDevices.map((device, index) => (
                <tr
                  key={device.serial_number}
                  className={`${index % 2 === 0 ? "bg-gray-50" : "bg-slate-100"} hover:bg-gray-200`}
                >
                  <td className="border border-gray-300 px-4 py-2">{device.serial_number}</td>
                  <td className="border border-gray-300 px-4 py-1 text-sm">
                    <p>{device.model || "N/A"}</p>
                    <p>{device.config || "N/A"}</p>
                  </td>
                  <td className="border border-gray-300 px-4 py-1 text-sm">
                    <select
                      className="border border-gray-300 rounded px-2 py-1 bg-white"
                      value={device.status}
                      onChange={(e) => changeStatus(device.serial_number, e.target.value)}
                    >
                      {STATUSES.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="border border-gray-300 px-4 py-1 text-sm">
                    {device.lastSeen ? formatDistanceToNow(new Date(device.lastSeen), { addSuffix: true }) : "Never"}
                  </td>
                  {/* FIX: location is shown from what the device reported, not from this browser */}
                  <td className="border border-gray-300 px-4 py-1 text-sm">
                    {device.location?.latitude != null ? (
                      <>
                        <p>{device.location.address || `${device.location.latitude}, ${device.location.longitude}`}</p>
                        {device.location.source === "ip" && <p className="text-gray-600">Approximate (IP-based)</p>}
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
                      <span className="text-gray-500">No location yet</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-gray-500 py-4">
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