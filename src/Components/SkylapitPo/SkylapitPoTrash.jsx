import { useEffect, useState } from "react";
import axiosInstance from '../axiosInstance/axiosInstance'

const SkylapitPoTrash = () => {
    const [trashedPO, setTrashedPO] = useState([]);


    const fetchTrashedPO = async () => {
      try {
        console.log("📌 Fetching trashed POs...");
        
        const res = await axiosInstance.get("/api/deleted-orders");
        console.log("✅ API Response:", res.data);
    
        setTrashedPO(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("❌ Error fetching trashed PO:", error.response ? error.response.data : error);
        setTrashedPO([]);
      }
    };
    

  const restorepo = async (id) => {
    try {
      await axiosInstance.put(`/api/po/restore/${id}`); // Corrected API endpoint
      fetchTrashedPO();
    } catch (error) {
      console.error("Error restoring po:", error);
    }
};

  const deletePermanently = async (id) => {
    try {
      await axiosInstance.delete(`/api/po/delete-permanent/${id}`);
      fetchTrashedPO();
    } catch (error) {
      console.error("Error deleting po permanently:", error);
    }
  };

  useEffect(() => {
    fetchTrashedPO();
  }, []);
  
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Trash - Deleted PO</h1>
      {trashedPO.length === 0 ? (
        <p>No deleted PO</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">PO No</th>
              <th className="p-2 border">Customer</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {trashedPO.map((po) => (
              <tr key={po._id}>
                <td className="p-2 border">{po.poNumber}</td>
                <td className="p-2 border">{po.venderName}</td>
                <td className="p-2 border">₹{po.total}</td>
                <td className="p-2 border flex gap-2">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                    onClick={() => restorepo(po._id)}
                  >
                    Restore
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => deletePermanently(po._id)}
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

export default SkylapitPoTrash;
