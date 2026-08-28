import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance/axiosInstance";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { FaPrint, FaSync, FaEye } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { exportToExcel } from "../utils/ExportExcell";

const STATUS_OPTIONS = ["Received", "In Progress", "Completed", "Delivered"];

const statusBadgeClass = (status) => {
  switch (status) {
    case "Received":
      return "bg-amber-100 text-amber-700";
    case "In Progress":
      return "bg-sky-100 text-sky-700";
    case "Completed":
      return "bg-teal-100 text-teal-700";
    case "Delivered":
      return "bg-emerald-100 text-emerald-700";
    default:
      return "bg-stone-100 text-stone-700";
  }
};

const DivineitpngReceiptList = () => {
  const [receipts, setReceipts] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null); // { id, top, left }
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clickCount, setClickCount] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReceiptId, setSelectedReceiptId] = useState(null);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [filteredReceipts, setFilteredReceipts] = useState([]);
  const itemsPerPage = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredReceipts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const pageNumbers = [...Array(totalPages).keys()].map((num) => num + 1);
  const currentItems = filteredReceipts.slice(indexOfFirstItem, indexOfLastItem);
  const dropdownRef = useRef(null);
  const buttonRefs = useRef({});
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  const ACTION_MENU_WIDTH = 208;
  const ACTION_MENU_HEIGHT = 220;
  const VIEWPORT_GAP = 12;

  const toggleSearch = () => {
    setShowSearch((prev) => !prev);
    if (!showSearch) {
      setSearchInput("");
      setFilteredReceipts(receipts);
    }
  };

  const toggleDateFilter = () => {
    setShowDateFilter((prev) => !prev);
    if (!showDateFilter) {
      setFilteredReceipts(receipts);
    }
  };

  const confirmDeleteReceipt = (receiptId) => {
    setSelectedReceiptId(receiptId);
    setShowDeleteModal(true);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchInput(query);
    filterReceipts(query);
  };

  const filterReceipts = (query) => {
    if (!query.trim()) {
      setFilteredReceipts(receipts);
      return;
    }
    const filtered = receipts.filter((receipt) =>
      Object.values(receipt).some((value) =>
        String(value).toLowerCase().includes(query.toLowerCase())
      )
    );
    setFilteredReceipts(filtered);
  };

  const handleDateChange = (ranges) => {
    const { startDate, endDate } = ranges.selection;
    setDateRange({ startDate, endDate, key: "selection" });

    const filtered = receipts.filter((receipt) => {
      const receivedDate = new Date(receipt.receivedDate);
      return (
        receivedDate >= new Date(startDate).setHours(0, 0, 0, 0) &&
        receivedDate <= new Date(endDate).setHours(23, 59, 59, 999)
      );
    });
    setFilteredReceipts(filtered);

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

  const fetchReceipts = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/api/receipts");
      setReceipts(response.data);
      setFilteredReceipts(response.data);
    } catch (error) {
      console.error("Error fetching receipts:", error);
      setError("Failed to fetch receipts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceipts();
  }, []);

  useEffect(() => {
    if (!openDropdown) return undefined;

    const handlePointerDown = (event) => {
      const menu = dropdownRef.current;
      const button = buttonRefs.current[openDropdown.id];
      if (menu?.contains(event.target) || button?.contains(event.target)) return;
      setOpenDropdown(null);
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") setOpenDropdown(null);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [openDropdown]);

  const handleViewPrint = (receipt) => {
    navigate("/Divineitpngreceiptprint", { state: receipt });
  };

  const handleStatusChange = async (receipt, newStatus) => {
    try {
      await axiosInstance.put("/api/receipts/status", {
        receiptNumber: receipt.receiptNumber,
        status: newStatus,
      });
      setReceipts((prev) =>
        prev.map((r) => (r._id === receipt._id ? { ...r, status: newStatus } : r))
      );
      setFilteredReceipts((prev) =>
        prev.map((r) => (r._id === receipt._id ? { ...r, status: newStatus } : r))
      );
      toast.success("Status updated!");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status.");
    }
  };

  const deleteReceipt = async () => {
    if (!selectedReceiptId) return;

    try {
      const response = await axiosInstance.delete(`/api/receipts/${selectedReceiptId}`);
      if (response.status === 200) {
        setReceipts((prev) => prev.filter((r) => r._id !== selectedReceiptId));
        setFilteredReceipts((prev) => prev.filter((r) => r._id !== selectedReceiptId));
        toast.success("Receipt moved to trash!");
      } else {
        toast.error(response.data.message || "Failed to delete the receipt");
      }
    } catch (error) {
      console.error("Error deleting receipt:", error);
      toast.error("Failed to delete the receipt.");
    } finally {
      setShowDeleteModal(false);
      setSelectedReceiptId(null);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const toggleActionMenu = (receiptId) => {
    if (openDropdown?.id === receiptId) {
      setOpenDropdown(null);
      return;
    }

    const button = buttonRefs.current[receiptId];
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const showAbove = spaceBelow < ACTION_MENU_HEIGHT && rect.top > ACTION_MENU_HEIGHT;

    let top = showAbove ? rect.top - ACTION_MENU_HEIGHT - 8 : rect.bottom + 8;
    let left = rect.right - ACTION_MENU_WIDTH;

    if (left < VIEWPORT_GAP) left = VIEWPORT_GAP;
    if (left + ACTION_MENU_WIDTH > window.innerWidth - VIEWPORT_GAP) {
      left = window.innerWidth - ACTION_MENU_WIDTH - VIEWPORT_GAP;
    }
    if (top < VIEWPORT_GAP) top = VIEWPORT_GAP;
    if (top + ACTION_MENU_HEIGHT > window.innerHeight - VIEWPORT_GAP) {
      top = Math.max(VIEWPORT_GAP, window.innerHeight - ACTION_MENU_HEIGHT - VIEWPORT_GAP);
    }

    setOpenDropdown({ id: receiptId, top, left });
  };

  return (
    <div className="w-full mx-auto px-4 pb-14 pt-6">
      {/* Fixed Header Section */}
      <div className="rounded-[28px] border border-[#dfd3c3] bg-[linear-gradient(180deg,rgba(255,253,250,0.98),rgba(255,248,239,0.96))] px-5 py-5 shadow-[0_18px_45px_rgba(73,47,24,0.08)]">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
              Intake Desk
            </span>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Acknowledgement Receipts</h1>
            <p className="mt-2 text-sm text-stone-600">Search, filter, export, and track every device drop-off.</p>
          </div>
          <div className="rounded-2xl border border-[#dfd3c3] bg-white/70 px-4 py-3 text-sm text-stone-600">
            Showing {currentItems.length} of {filteredReceipts.length} receipts
          </div>
        </div>

        {/* Controls */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <button
            onClick={toggleSearch}
            className="rounded-2xl border border-[#dfd3c3] bg-white/80 px-4 py-3 text-sm font-semibold text-slate-900 transition duration-200 hover:bg-stone-50"
          >
            {showSearch ? "Hide Search" : "Search receipts 🔍"}
          </button>

          <button
            onClick={toggleDateFilter}
            className="rounded-2xl border border-[#dfd3c3] bg-white/80 px-4 py-3 text-sm font-semibold text-slate-900 transition duration-200 hover:bg-stone-50"
          >
            {showDateFilter ? "Hide Date Filter" : "Show Date Filter 📅"}
          </button>

          <button
            onClick={() => exportToExcel(filteredReceipts)}
            className="rounded-2xl border border-[#dfd3c3] bg-white/80 px-4 py-3 text-sm font-semibold text-slate-900 transition duration-200 hover:bg-stone-50"
          >
            Export to Excel 📄
          </button>

          <button
            onClick={() => navigate("/Divineitpngreceipt")}
            className="flex items-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#7c2d12,#9a3412)] px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(124,45,18,0.24)] transition duration-200 hover:brightness-105"
          >
            <FaPrint /> New Acknowledgement
          </button>

          <button
            onClick={() => navigate("/DivineitpngReceiptTrash")}
            className="rounded-2xl border border-[#dfd3c3] bg-white/80 px-4 py-3 text-sm font-semibold text-slate-900 transition duration-200 hover:bg-stone-50"
          >
            🗑️ Trash
          </button>

          <button
            onClick={fetchReceipts}
            className="flex items-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#0f766e,#115e59)] px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(15,118,110,0.24)] transition duration-200 hover:brightness-105"
          >
            <FaSync /> Refresh Table
          </button>
        </div>

        <div className="space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="rounded-2xl border border-[#dfd3c3] bg-white/80 px-4 py-2 text-sm font-semibold text-slate-900 disabled:opacity-50"
          >
            Prev
          </button>

          {pageNumbers
            .filter(
              (number) =>
                number >= currentPage - 2 &&
                number <= currentPage + 2 &&
                number > 0 &&
                number <= totalPages
            )
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
              placeholder="Search receipts..."
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
        {receipts.length === 0 ? (
          <p className="p-8 text-center text-stone-500">No receipts found</p>
        ) : (
          <table className="mt-0 w-full border-collapse font-semibold">
            <thead className="sticky top-0 z-10 bg-teal-50">
              <tr>
                <th className="border-b border-[#dfd3c3] p-4 text-left text-xs uppercase tracking-[0.14em] text-stone-600">Receipt No</th>
                <th className="border-b border-[#dfd3c3] p-4 text-left text-xs uppercase tracking-[0.14em] text-stone-600">Job No</th>
                <th className="border-b border-[#dfd3c3] p-4 text-left text-xs uppercase tracking-[0.14em] text-stone-600">Date Received</th>
                <th className="border-b border-[#dfd3c3] p-4 text-left text-xs uppercase tracking-[0.14em] text-stone-600">Customer</th>
                <th className="border-b border-[#dfd3c3] p-4 text-left text-xs uppercase tracking-[0.14em] text-stone-600">Device</th>
                <th className="border-b border-[#dfd3c3] p-4 text-left text-xs uppercase tracking-[0.14em] text-stone-600">Status</th>
                <th className="border-b border-[#dfd3c3] p-4 text-center text-xs uppercase tracking-[0.14em] text-stone-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((receipt) => (
                  <tr key={receipt._id} className="border-b border-[#ece1d4] bg-white/75 hover:bg-stone-50">
                    <td className="p-4">{receipt.receiptNumber}</td>
                    <td className="p-4">{receipt.jobNumber}</td>
                    <td className="p-4">
                      {receipt.receivedDate
                        ? new Date(receipt.receivedDate).toLocaleDateString("en-GB")
                        : "N/A"}
                    </td>
                    <td className="p-4">{receipt.customerName || "N/A"}</td>
                    <td className="p-4">
                      {receipt.deviceType}
                      {receipt.brand ? ` - ${receipt.brand}` : ""}
                    </td>
                    <td className="p-4">
                      <select
                        value={receipt.status}
                        onChange={(e) => handleStatusChange(receipt, e.target.value)}
                        className={`rounded-full border-0 px-3 py-1 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-200 ${statusBadgeClass(
                          receipt.status
                        )}`}
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        ref={(element) => {
                          if (element) {
                            buttonRefs.current[receipt._id] = element;
                          } else {
                            delete buttonRefs.current[receipt._id];
                          }
                        }}
                        onClick={() => toggleActionMenu(receipt._id)}
                        className="rounded-2xl border border-[#dfd3c3] bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition duration-200 hover:bg-stone-50"
                      >
                        ⚙️ Actions
                      </button>

                      {openDropdown?.id === receipt._id && (
                        <div
                          ref={dropdownRef}
                          className="fixed z-[90] w-52 rounded-2xl border border-[#dfd3c3] bg-white p-2 text-slate-900 shadow-lg"
                          style={{ top: `${openDropdown.top}px`, left: `${openDropdown.left}px` }}
                        >
                          <button
                            onClick={() => {
                              setOpenDropdown(null);
                              handleViewPrint(receipt);
                            }}
                            className="flex w-full items-center rounded-xl px-4 py-2 text-left hover:bg-stone-100"
                          >
                            <FaEye className="mr-2" /> View / Reprint
                          </button>

                          <button
                            onClick={() => {
                              setOpenDropdown(null);
                              confirmDeleteReceipt(receipt._id);
                            }}
                            className="flex w-full items-center rounded-xl px-4 py-2 text-left text-rose-700 hover:bg-rose-50"
                          >
                            <span className="mr-2">🗑️</span> Move To Trash
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-4 py-10 text-center text-stone-500">
                    No receipts found
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
            <p className="text-gray-700">Are you sure you want to move this receipt to trash?</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="mr-2 rounded-2xl border border-[#dfd3c3] bg-white px-4 py-2 text-sm font-semibold text-slate-900"
              >
                Cancel
              </button>
              <button
                onClick={deleteReceipt}
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

export default DivineitpngReceiptList;