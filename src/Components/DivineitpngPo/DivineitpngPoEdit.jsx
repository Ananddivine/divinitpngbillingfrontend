import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../axiosInstance/axiosInstance';
import { FaSave } from "react-icons/fa";

const DivineitpngPoEdit = () => {
    const location = useLocation();
    const navigate = useNavigate();
      const [loadingSave, setLoadingSave] = useState(false);

    const [formData, setFormData] = useState({
        venderName: '',
        gstNumber: '',
        venderNumber: '',        
        poDate: '',
        products: [{ name: '', price: '', quantity: 1 }],
        subtotal: 0,
        tax: 0,
        total: 0,
        venderEmail: '',
        venderAddress: '',
        taxPercent: 0
    });

    useEffect(() => {
        if (location.state) {
            setFormData(location.state);
        }
    }, [location]);

    // Calculate totals when products or taxPercent change
    useEffect(() => {
        const newSubtotal = formData.products.reduce(
            (total, product) =>
                total + (parseFloat(product.price || 0) * parseInt(product.quantity || 1)),
            0
        );
        const newTax = (newSubtotal * parseFloat(formData.taxPercent || 0)) / 100;
        const newTotal = newSubtotal + newTax;

        setFormData((prev) => ({
            ...prev,
            subtotal: newSubtotal.toFixed(2),
            tax: newTax.toFixed(2),
            total: newTotal.toFixed(2)
        }));
    }, [formData.products, formData.taxPercent]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleProductChange = (index, field, value) => {
        const updatedProducts = [...formData.products];
        updatedProducts[index][field] = value;
        setFormData((prev) => ({ ...prev, products: updatedProducts }));
    };

    const addProduct = () => {
        setFormData((prev) => ({
            ...prev,
            products: [...prev.products, { name: '', price: '', quantity: 1 }]
        }));
    };

    const removeProduct = (index) => {
        const updatedProducts = [...formData.products];
        updatedProducts.splice(index, 1);
        setFormData((prev) => ({ ...prev, products: updatedProducts }));
    };

    const handleSubmit = async (e) => {
        setLoadingSave(true);
        e.preventDefault();
        try {
            await axiosInstance.put('/api/po/updatePo', formData);
            toast.success('Po updated successfully!');
            navigate('/ManagePos'); // Navigate back after update
            setLoadingSave(false);
        } catch (error) {
            toast.error('Failed to update invoice. Please try again.');
            setLoadingSave(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-4xl">
                <h2 className="text-2xl font-bold mb-6 text-blue-600">Edit Po</h2>
                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* vender Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            name="venderName"
                            value={formData.venderName}
                            onChange={handleChange}
                            placeholder="vender Name"
                            className="p-3 border border-gray-300 rounded-lg w-full"
                        />
                        <input
                            type="text"
                            name="venderEmail"
                            value={formData.venderEmail}
                            onChange={handleChange}
                            placeholder="vender Email"
                            className="p-3 border border-gray-300 rounded-lg w-full"
                        />
                    </div>

                    {/* Products Section */}
                    <div>
                        <h3 className="text-lg font-semibold">Products</h3>
                        {formData.products.map((product, index) => (
                            <div key={index} className="flex space-x-4 items-center mb-2">
                                <input
                                    type="text"
                                    name="name"
                                    value={product.name}
                                    onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                                    placeholder="Product Name"
                                    className="p-2 border border-gray-300 rounded-lg w-1/3"
                                />
                                <input
                                    type="number"
                                    name="price"
                                    value={product.price}
                                    onChange={(e) => handleProductChange(index, 'price', e.target.value)}
                                    placeholder="Price"
                                    className="p-2 border border-gray-300 rounded-lg w-1/4"
                                />
                                <input
                                    type="number"
                                    name="quantity"
                                    value={product.quantity}
                                    onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                                    placeholder="Quantity"
                                    className="p-2 border border-gray-300 rounded-lg w-1/4"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeProduct(index)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    ❌
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addProduct}
                            className="bg-green-500 text-white px-3 py-1 rounded-lg mt-2"
                        >
                            ➕ Add Product
                        </button>
                    </div>

                    {/* Summary Section */}
                    <div className="grid grid-cols-3 gap-4">
                        <input
                            type="number"
                            name="subtotal"
                            value={formData.subtotal}
                            readOnly
                            placeholder="Subtotal"
                            className="p-3 border border-gray-300 rounded-lg w-full bg-gray-100"
                        />
                        <input
                            type="number"
                            name="tax"
                            value={formData.tax}
                            readOnly
                            placeholder="Tax"
                            className="p-3 border border-gray-300 rounded-lg w-full bg-gray-100"
                        />
                        <input
                            type="number"
                            name="total"
                            value={formData.total}
                            readOnly
                            placeholder="Total"
                            className="p-3 border border-gray-300 rounded-lg w-full bg-gray-100"
                        />
                    </div>

                     <button      
                          type='submit' 
                          className="px-4 py-2 rounded-md bg-gray-800 text-white flex items-center justify-center hover:bg-gray-500 gap-2" 
                          disabled={loadingSave} 
                        >
                          {loadingSave && (
                            <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5 mr-2"></span>
                          )}
                         <FaSave />  Save Invoice
                        </button>
                </form>
            </div>
                <ToastContainer />
        </div>
    );
};

export default DivineitpngPoEdit;
