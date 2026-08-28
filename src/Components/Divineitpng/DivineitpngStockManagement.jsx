import React, { useState, useEffect } from "react";
import { FaEdit, FaPlus } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from "../axiosInstance/axiosInstance";
import { useParams } from "react-router-dom";

const DivineitpngStockManagement = () => {
  const [stocks, setStocks] = useState([]);
  const [products, setProducts] = useState([]);
  const { stockId } = useParams();
  const [editing, setEditing] = useState(null);
  const [editData, setEditData] = useState({ name: "", category: "", quantity: "", price: "" });
  const [newStock, setNewStock] = useState({ name: "", category: "", quantity: "", price: "" });

  useEffect(() => {
    fetchStocks();
    fetchProducts();
  }, []);

  useEffect(() => {
    if (stockId) {
      const stockToEdit = stocks.find(stock => stock._id === stockId);
      if (stockToEdit) {
        setEditing(stockId);
        setEditData(stockToEdit);
      }
    }
  }, [stockId, stocks]);

  const fetchStocks = async () => {
    try {
      const response = await axiosInstance.get("/api/stock/items");
      setStocks(response.data);
    } catch (error) {
      console.error("Error fetching stocks", error);
      toast.error("Error fetching stocks", error)
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get("/api/ProductsandQuantity");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products", error);
      toast.error("Error fetching products", error)
    }
  };

  const moveToStocks = async (product) => {
    try {
      await axiosInstance.post("/api/stock/makeentery", {
        orderId: product._id,
        name: product.name,
        quantity: product.quantity,
      });
      toast.success('Stock Moved Successfully')
      fetchStocks();
      fetchProducts(); // Refresh products list
    } catch (error) {
      console.error("Error moving product to stock", error);
      toast.error("Error moving product to stock", error)
    }
  };
  
  const addStock = async (e) => {
    e.preventDefault();
    if (!newStock.name || !newStock.category || !newStock.quantity || !newStock.price) {
      alert("Please fill all fields!");
      return;
    }
    try {
      await axiosInstance.post("/api/stock/items", newStock);
      toast.success('New Stock Add Successfully')
      fetchStocks();
      setNewStock({ name: "", category: "", quantity: "", price: "" });
    } catch (error) {
      console.error("Error adding stock", error);
      toast.error("Error adding stock", error)
    }
  };


  const startEditing = (stock) => {
    setEditing(stock._id);
    setEditData(stock);
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const saveEdit = async () => {
    if (!editData.name || !editData.category || !editData.quantity || !editData.price) {
      alert("All fields are required!");
      return;
    }
  
    try {
      console.log("Updating stock:", editing, editData); // Debugging
      await axiosInstance.put(`/api/stock/items/${editing}`, editData);
      toast.success('Stock updated successfully!');
      fetchStocks();
      setEditing(null);
    } catch (error) {
      console.error("Error updating stock", error);
      toast.error("Error updating stock", error)
    }
  };
  

  const deleteStock = async (id) => {
      
    try {
      console.log("Deleting stock:", id); // Debugging
      await axiosInstance.delete(`/api/stock/items/${id}`);
      fetchStocks();
    } catch (error) {
      console.error("Error deleting stock", error);
    }
  };
  

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Stock Management</h2>

       {/* Add Stock Form */}
       <form onSubmit={addStock} className="mb-6 flex flex-wrap gap-3 bg-white p-4 rounded-lg shadow">
        <input type="text" placeholder="Product Name" name="name" value={newStock.name} onChange={(e) => setNewStock({ ...newStock, name: e.target.value })} className="border p-2 rounded w-full md:w-1/5" />
        <input type="text" placeholder="Category" name="category" value={newStock.category} onChange={(e) => setNewStock({ ...newStock, category: e.target.value })} className="border p-2 rounded w-full md:w-1/5" />
        <input type="number" placeholder="Quantity" name="quantity" value={newStock.quantity} onChange={(e) => setNewStock({ ...newStock, quantity: e.target.value })} className="border p-2 rounded w-full md:w-1/5" />
        <input type="number" placeholder="Price" name="price" value={newStock.price} onChange={(e) => setNewStock({ ...newStock, price: e.target.value })} className="border p-2 rounded w-full md:w-1/5" />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full md:w-auto">Add Stock</button>
      </form>

      {/* Products Table */}
      <h3 className="text-lg font-semibold mb-2">Available Products</h3>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Name</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.name} className="text-center border">
                <td className="border p-2">{product.name}</td>
                <td className="border p-2">{product.quantity}</td>
                <td className="border p-2">
                  <button
                    onClick={() => moveToStocks(product)}
                    className="bg-blue-500 text-white px-3 py-1 rounded flex items-center gap-1 mx-auto"
                  >
                    <FaPlus /> Move to Stocks
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stocks Table */}
      <h3 className="text-lg font-semibold mt-6 mb-2">Stock Items</h3>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Name</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock) => (
              <tr key={stock._id} className="text-center border">
                {editing === stock._id ? (
                  <>
                    <td className="border p-2">
                      <input type="text" name="name" value={editData.name} onChange={handleEditChange} className="border p-1 w-full" />
                    </td>
                    <td className="border p-2">
                      <input type="text" name="category" value={editData.category} onChange={handleEditChange} className="border p-1 w-full" />
                    </td>
                    <td className="border p-2">
                      <input type="number" name="quantity" value={editData.quantity} onChange={handleEditChange} className="border p-1 w-full" />
                    </td>
                    <td className="border p-2">
                      <input type="number" name="price" value={editData.price} onChange={handleEditChange} className="border p-1 w-full" />
                    </td>
                    <td className="border p-2">
                      <button onClick={saveEdit} className="bg-green-500 text-white px-3 py-1 rounded">Save</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="border p-2">{stock.name}</td>
                    <td className="border p-2">{stock.category}</td>
                    <td className="border p-2">{stock.quantity}</td>
                    <td className="border p-2">K{stock.price}</td>
                    <td className="border p-2 inline-flex items-center gap-2">
                    <FaEdit className="cursor-pointer text-green-500" onClick={() => startEditing(stock)} />
                    <button 
                      onClick={() => deleteStock(stock._id)} 
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>

                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        <ToastContainer />
    </div>
  );
};

export default DivineitpngStockManagement;
