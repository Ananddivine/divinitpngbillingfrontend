import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../axiosInstance/axiosInstance';
import { FaSave } from "react-icons/fa";

const Skylapitbillingediting = () => {
    const location = useLocation();
    const navigate = useNavigate();
            const [loadingSave, setLoadingSave] = useState(false);
        const [originalInvoiceNumber, setOriginalInvoiceNumber] = useState('');
    const sectionCardClass = "rounded-[28px] border border-[#dfd3c3] bg-[linear-gradient(180deg,rgba(255,253,250,0.98),rgba(255,248,239,0.96))] p-6 shadow-[0_18px_45px_rgba(73,47,24,0.08)]";
    const inputClass = "w-full rounded-2xl border border-[#dfd3c3] bg-white px-4 py-3 text-slate-900 outline-none transition duration-200 placeholder:text-stone-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100";
    const secondaryButtonClass = "flex items-center justify-center gap-2 rounded-2xl border border-[#dfd3c3] bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition duration-200 hover:bg-stone-50";
    const primaryButtonClass = "flex items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#0f766e,#115e59)] px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(15,118,110,0.24)] transition duration-200 hover:brightness-105";

    const [formData, setFormData] = useState({
        customerName: '',
        gstNumber: '',
        customerNumber: '',
        invoiceNumber: '',
        jobNumber: '',
        invoiceDate: '',
        products: [{ name: '', price: '', quantity: 1 }],
        subtotal: 0,
        tax: 0,
        total: 0,
        customerEmail: '',
        customerAddress: '',
        taxPercent: 0
    });

    useEffect(() => {
        if (location.state) {
            setFormData(location.state);
            setOriginalInvoiceNumber(location.state.invoiceNumber || '');
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
            await axiosInstance.put('/api/invoices/updateInvoice', {
                ...formData,
                originalInvoiceNumber,
            });
            toast.success('Invoice updated successfully!');
            navigate('/SkylapitInvoice'); // Navigate back after update
            setLoadingSave(false);
        } catch (error) {
            toast.error('Failed to update invoice. Please try again.');
            setLoadingSave(false);
        }
    };

    return (
        <div className="min-h-screen px-4 py-6">
            <div className="mx-auto w-full max-w-7xl">
                <div className="mb-6">
                    <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">Billing Studio</span>
                    <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Edit Invoice</h2>
                    <p className="mt-2 text-sm text-stone-600">Update invoice details in the same calm workspace used for creating new billing records.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Customer Info */}
                    <div className="grid gap-6 lg:grid-cols-2">
                        <div className={sectionCardClass}>
                        <div className="grid gap-4 md:grid-cols-2">
                        <input
                            type="text"
                            name="customerName"
                            value={formData.customerName}
                            onChange={handleChange}
                            placeholder="Customer Name"
                            className={inputClass}
                        />
                        <input
                            type="text"
                            name="customerEmail"
                            value={formData.customerEmail}
                            onChange={handleChange}
                            placeholder="Customer Email"
                            className={inputClass}
                        />
                        <input
                            type="text"
                            name="invoiceNumber"
                            value={formData.invoiceNumber}
                            onChange={handleChange}
                            placeholder="Invoice Number"
                            className={inputClass}
                        />
                         <input
                            type="text"
                            name="jobNumber"
                            value={formData.jobNumber}
                            onChange={handleChange}
                            placeholder="Job Number"
                            className={inputClass}
                        />
                        <input
                            type="date"
                            name="invoiceDate"
                            value={formData.invoiceDate ? formData.invoiceDate.split("T")[0] : ""}
                            onChange={handleChange}
                            className={inputClass}
                        />
                    </div>
                    </div>

                    <div className={sectionCardClass}>
                        <div className="grid gap-4 md:grid-cols-3">
                            <input
                                type="number"
                                name="subtotal"
                                value={formData.subtotal}
                                readOnly
                                placeholder="Subtotal"
                                className={`${inputClass} bg-stone-50`}
                            />
                            <input
                                type="number"
                                name="tax"
                                value={formData.tax}
                                readOnly
                                placeholder="Tax"
                                className={`${inputClass} bg-stone-50`}
                            />
                            <input
                                type="number"
                                name="total"
                                value={formData.total}
                                readOnly
                                placeholder="Total"
                                className={`${inputClass} bg-stone-50`}
                            />
                        </div>
                    </div>
                    </div>

                    {/* Products Section */}
                    <div className={sectionCardClass}>
                        <div className="mb-4 flex items-end justify-between gap-4">
                            <div>
                                <h3 className="text-xl font-semibold text-slate-900">Products</h3>
                                <p className="mt-1 text-sm text-stone-600">Adjust item descriptions, price, and quantity without leaving the invoice page.</p>
                            </div>
                            <button
                                type="button"
                                onClick={addProduct}
                                className={primaryButtonClass}
                            >
                                Add Product
                            </button>
                        </div>
                        {formData.products.map((product, index) => (
                            <div key={index} className="mb-4 grid gap-3 rounded-[24px] border border-[#dfd3c3] bg-white/75 p-4 md:grid-cols-[1fr_160px_160px_auto] md:items-center">
                                <input
                                    type="text"
                                    name="name"
                                    value={product.name}
                                    onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                                    placeholder="Product Name"
                                    className={inputClass}
                                />
                                <input
                                    type="number"
                                    name="price"
                                    value={product.price}
                                    onChange={(e) => handleProductChange(index, 'price', e.target.value)}
                                    placeholder="Price"
                                    className={inputClass}
                                />
                                <input
                                    type="number"
                                    name="quantity"
                                    value={product.quantity}
                                    onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                                    placeholder="Quantity"
                                    className={inputClass}
                                />
                                <button
                                    type="button"
                                    onClick={() => removeProduct(index)}
                                    className={secondaryButtonClass}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>

                     <button      
                          type='submit' 
                          className={primaryButtonClass}
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

export default Skylapitbillingediting;
