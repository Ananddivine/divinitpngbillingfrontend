import { useEffect, useState } from "react";
import axiosInstance from '../axiosInstance/axiosInstance'

const SkylapitTrash = () => {
    const [trashedInvoices, setTrashedInvoices] = useState([]);



  const fetchTrashedInvoices = async () => {
    try {
      const res = await axiosInstance.get("/api/trash");
      console.log("API Response:", res.data);
      setTrashedInvoices(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching trashed invoices:", error);
      setTrashedInvoices([]); // Fallback to an empty array
    }
  };
  

  const restoreInvoice = async (id) => {
    try {
      await axiosInstance.put(`/api/restore/${id}`); // Corrected API endpoint
      fetchTrashedInvoices();
    } catch (error) {
      console.error("Error restoring invoice:", error);
    }
};

  const deletePermanently = async (id) => {
    try {
      await axiosInstance.delete(`/api/delete-permanent/${id}`);
      fetchTrashedInvoices();
    } catch (error) {
      console.error("Error deleting invoice permanently:", error);
    }
  };

  useEffect(() => {
    fetchTrashedInvoices();
  }, []);
  
  return (
    <div className="pb-10">
      <h1 className="text-xl font-bold mb-4">Trash - Deleted Invoices</h1>
      {trashedInvoices.length === 0 ? (
        <p>No deleted invoices</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Invoice No</th>
              <th className="p-2 border">Laptop JobNumber</th>
              <th className="p-2 border">Customer</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {trashedInvoices.map((invoice) => (
              <tr key={invoice._id} >
                <td className="p-2 border">{invoice.invoiceNumber}</td>
                <td className="p-2 border">{invoice.jobNumber}</td>
                <td className="p-2 border">{invoice.customerName}</td>
                <td className="p-2 border">₹{invoice.total}</td>
                <td className="p-2 border flex gap-2">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                    onClick={() => restoreInvoice(invoice._id)}
                  >
                    Restore
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => deletePermanently(invoice._id)}
                  >
                    Delete Permanently
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SkylapitTrash;
