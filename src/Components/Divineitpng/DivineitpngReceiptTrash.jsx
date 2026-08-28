import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance/axiosInstance";
import { FaTrashRestore, FaSync } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DivineitpngReceiptTrash = () => {
  const [trashedReceipts, setTrashedReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPermanentModal, setShowPermanentModal] = useState(false);
  const [selectedReceiptId, setSelectedReceiptId] = useState(null);
  const navigate = useNavigate();

  const fetchTrashedReceipts = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/api/receipts/trash");
      setTrashedReceipts(response.data);
    } catch (error) {
      console.error("Error fetching trashed receipts:", error);
      setError("Failed to fetch trashed receipts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrashedReceipts();
  }, []);

  const restoreReceipt = async (receiptId) => {
    try {
      await axiosInstance.put(`/api/receipts/restore/${receiptId}`);
      setTrashedReceipts((prev) => prev.filter((r) => r._id !== receiptId));
      toast.success("Receipt restored!");
    } catch (error) {
      console.error("Error restoring receipt:", error);
      toast.error("Failed to restore the receipt.");
    }
  };

  const confirmPermanentDelete = (receiptId) => {
    setSelectedReceiptId(receiptId);
    setShowPermanentModal(true);
  };

  const permanentlyDeleteReceipt = async () => {
    if (!selectedReceiptId) return;
    try {
      const response = await axiosInstance.delete(`/api/receipts/permanent/${selectedReceiptId}`);
      if (response.status === 200) {
        setTrashedReceipts((prev) => prev.filter((r) => r._id !== selectedReceiptId));
        toast.success("Receipt permanently deleted!");
      } else {
        toast.error(response.data.message || "Failed to permanently delete the receipt");
      }
    } catch (error) {
      console.error("Error permanently deleting receipt:", error);
      toast.error("Failed to permanently delete the receipt.");
    } finally {
      setShowPermanentModal(false);
      setSelectedReceiptId(null);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="w-full mx-auto px-4 pb-14 pt-6">
      {/* Header */}
      <div className="rounded-[28px] border border-[#dfd3c3] bg-[linear-gradient(180deg,rgba(255,253,250,0.98),rgba(255,248,239,0.96))] px-5 py-5 shadow-[0_18px_45px_rgba(73,47,24,0.08)]">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="inline-flex rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-rose-700">
              Trash
            </span>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Receipt Trash</h1>
            <p className="mt-2 text-sm text-stone-600">
              Restore a receipt back to the active list, or permanently delete it. Permanent deletion cannot be undone.
            </p>
          </div>
          <div className="rounded-2xl border border-[#dfd3c3] bg-white/70 px-4 py-3 text-sm text-stone-600">
            {trashedReceipts.length} receipt{trashedReceipts.length === 1 ? "" : "s"} in trash
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => navigate("/DivineitpngReceiptList")}
            className="rounded-2xl border border-[#dfd3c3] bg-white/80 px-4 py-3 text-sm font-semibold text-slate-900 transition duration-200 hover:bg-stone-50"
          >
            ← Back to Receipts
          </button>

          <button
            onClick={fetchTrashedReceipts}
            className="flex items-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#0f766e,#115e59)] px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(15,118,110,0.24)] transition duration-200 hover:brightness-105"
          >
            <FaSync /> Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="mt-6 overflow-hidden rounded-[28px] border border-[#dfd3c3] bg-[linear-gradient(180deg,rgba(255,253,250,0.98),rgba(255,248,239,0.96))] shadow-[0_18px_45px_rgba(73,47,24,0.08)]">
        {trashedReceipts.length === 0 ? (
          <p className="p-8 text-center text-stone-500">Trash is empty</p>
        ) : (
          <table className="mt-0 w-full border-collapse font-semibold">
            <thead className="sticky top-0 z-10 bg-rose-50">
              <tr>
                <th className="border-b border-[#dfd3c3] p-4 text-left text-xs uppercase tracking-[0.14em] text-stone-600">Receipt No</th>
                <th className="border-b border-[#dfd3c3] p-4 text-left text-xs uppercase tracking-[0.14em] text-stone-600">Job No</th>
                <th className="border-b border-[#dfd3c3] p-4 text-left text-xs uppercase tracking-[0.14em] text-stone-600">Date Received</th>
                <th className="border-b border-[#dfd3c3] p-4 text-left text-xs uppercase tracking-[0.14em] text-stone-600">Customer</th>
                <th className="border-b border-[#dfd3c3] p-4 text-left text-xs uppercase tracking-[0.14em] text-stone-600">Device</th>
                <th className="border-b border-[#dfd3c3] p-4 text-center text-xs uppercase tracking-[0.14em] text-stone-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {trashedReceipts.map((receipt) => (
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
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => restoreReceipt(receipt._id)}
                        className="flex items-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#0f766e,#115e59)] px-3 py-2 text-sm font-semibold text-white transition duration-200 hover:brightness-105"
                      >
                        <FaTrashRestore /> Restore
                      </button>
                      <button
                        onClick={() => confirmPermanentDelete(receipt._id)}
                        className="rounded-2xl bg-[linear-gradient(135deg,#cf3b2f,#b42318)] px-3 py-2 text-sm font-semibold text-white transition duration-200 hover:brightness-105"
                      >
                        Delete Forever
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showPermanentModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-[28px] border border-[#dfd3c3] bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold text-gray-700">Permanently Delete Receipt?</h2>
            <p className="text-gray-700">
              This cannot be undone. The receipt record will be removed permanently.
            </p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowPermanentModal(false)}
                className="mr-2 rounded-2xl border border-[#dfd3c3] bg-white px-4 py-2 text-sm font-semibold text-slate-900"
              >
                Cancel
              </button>
              <button
                onClick={permanentlyDeleteReceipt}
                className="rounded-2xl bg-[linear-gradient(135deg,#cf3b2f,#b42318)] px-4 py-2 text-sm font-semibold text-white"
              >
                Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default DivineitpngReceiptTrash;