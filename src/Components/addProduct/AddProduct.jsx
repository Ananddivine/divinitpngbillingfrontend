import React, { useState } from 'react';
import './AddProduct.css';
import upload_area from '../../assets/upload_area.svg';
import axiosInstance from '../axiosInstance/axiosInstance';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import styles for toast
import { RingLoader } from 'react-spinners'; // Install react-spinners for a loader

const AddProduct = () => {
    const [images, setImages] = useState([null, null, null, null]);  
    
    const token = localStorage.getItem('token');
if (!token) {
  toast.error('Session expired. Please log in again.');
  return;
}


    const [productDetails, setProductDetails] = useState({
        name: "",
        category: "laptop",
        new_price: "",
        old_price: "",
        description: ""
    });
    const [loading, setLoading] = useState(false); // State to handle loading

    const imageHandler = (e, index) => {
        const file = e.target.files[0];
        const updatedImages = [...images];
        updatedImages[index] = file;
        setImages(updatedImages);
    };

    const changeHandler = (e) => {
        setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
    };

    const Add_Product = async () => {
        let responseData;
        setLoading(true); // Start loading animation

        let formData = new FormData();
        images.forEach((image) => {
            if (image) formData.append('product_images', image); // Ensure this matches your multer setup
        });

        // Append product details to the form data
        formData.append('name', productDetails.name);
        formData.append('category', productDetails.category);
        formData.append('new_price', productDetails.new_price);
        formData.append('old_price', productDetails.old_price);
        formData.append('description', productDetails.description);

        

        try {
            // Send images to the upload endpoint
            const response = await axiosInstance.post('/api/files/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                   'Authorization': `Bearer ${token}`,
                },
            });

            responseData = response.data;

            if (responseData.success) {
                // Prepare product details with image URLs
                const updatedProductDetails = {
                    ...productDetails,
                    images: responseData.image_urls, // Use image URLs returned from upload
                };

                // Send product details to add product endpoint
                const productResponse = await axiosInstance.post('/api/products/add', updatedProductDetails);

                if (productResponse.data.success) {
                    toast.success("Product Added Successfully!"); // Success toast
                } else {
                    toast.error("Failed to Add Product");
                }
            } else {
                console.error('Failed to upload images:', responseData.message);
                toast.error(responseData.message || 'Image upload failed');
            }
        } catch (error) {
            console.error('Error during fetch:', error);
            toast.error('An error occurred. Access denied.');
        } finally {
            setLoading(false); // Stop loading animation
        }
    };

    return (
        <div className='AddProduct'>
            <div className="addproduct-itemfield">
                <p>Product title</p>
                <input value={productDetails.name} onChange={changeHandler} type="text" name='name' placeholder='Type Here' />
            </div>
            <div className="addproduct-price">
                <div className="addproduct-itemfield">
                    <p>Price</p>
                    <input value={productDetails.old_price} onChange={changeHandler} type="text" name='old_price' placeholder='Type Here ' />
                </div>
                <div className="addproduct-itemfield">
                    <p>Offer Price</p>
                    <input value={productDetails.new_price} onChange={changeHandler} type="text" name='new_price' placeholder='Type Here ' />
                </div>
            </div>
            <div className="addproduct-itemfield">
                <p>Product Category</p>
                <select value={productDetails.category} onChange={changeHandler} name='category' className='addproduct-selector'>
                    <option value='laptop'>Laptop</option>
                    <option value='battery'>Battery</option>
                    <option value='screen'>Screen</option>
                    <option value='charger'>Charger</option>
                    <option value='keyboard'>Keyboard</option>
                </select>
            </div>
            <div className="addproduct-itemfield">
                <p>Description</p>
                <textarea value={productDetails.description} onChange={changeHandler} name='description' placeholder='Type Here' />
            </div>

            {/* Image upload fields */}
            <div className="addproduct-images-container">
                {images.map((image, index) => (
                    <div key={index} className="addproduct-itemfield">
                        <label htmlFor={`file-input-${index}`}>
                            <img src={image ? URL.createObjectURL(image) : upload_area} className='addproduct-thumbnail-img' alt="" />
                        </label>
                        <input type="file" onChange={(e) => imageHandler(e, index)} id={`file-input-${index}`} hidden />
                    </div>
                ))}
            </div>

            <div className='addproduct-btn-container'>
                {/* Display loading spinner if uploading */}
                {loading ? (
                    <RingLoader color="#4CAF50" size={60} />
                ) : (
                    <button onClick={Add_Product} className='addproduct-btn'>ADD</button>
                )}
            </div>

            {/* Toast notifications */}
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        </div>
    );
};

export default AddProduct;
