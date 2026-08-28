import React, { useEffect, useState } from 'react';
import './ListProduct.css';
import cross_icon from '../../assets/cross_icon.png';
import axiosInstance from '../axiosInstance/axiosInstance'; // Import axiosInstance

const ListProduct = () => {
  const [allproduct, setAllProducts] = useState([]);

  const fetchInfo = async () => {
    try {
      const response = await axiosInstance.get('/api/products'); // Use axiosInstance
      console.log('Fetched products:', response.data); // Check response data
      setAllProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const remove_product = async (id) => {
    try {
      const response = await axiosInstance.post('/api/products/remove', { id }); // Use axiosInstance
      console.log('Product removed:', response.data); // Check response data

      if (response.data.success) {
        await fetchInfo(); // Refresh the product list
      } else {
        console.error('Failed to remove product:', response.data.message);
      }
    } catch (error) {
      console.error('Error removing product:', error);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  return (
    <div className="ListProduct">
      <h1>ALL PRODUCTS LIST</h1>
      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>
      <div className="listproduct-allproduct">
        <hr />
        {allproduct.map((product, index) => {
          console.log('Rendering product:', product); // Check product details
          return (
            <div key={product._id || index} className="listproduct-format-main listproduct-format">
              <img
                src={
                  product.images && product.images.length > 0
                    ? product.images[0]
                    : 'https://via.placeholder.com/150'
                }
                alt={product.name}
                className="listproduct-product-icon"
              />
              <p>{product.name}</p>
              <p>&{product.old_price}</p>
              <p>&{product.new_price}</p>
              <p>{product.category}</p>
              <img
                onClick={() => remove_product(product.id)}
                src={cross_icon}
                alt=""
                className="listproduct-remove-icon"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ListProduct;
