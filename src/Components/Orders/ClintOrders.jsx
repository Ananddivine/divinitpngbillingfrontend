import React, { useEffect, useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
import axiosInstance from '../axiosInstance/axiosInstance'; // Import axiosInstance
import { toast } from 'react-toastify'; // Import toastify

const ClintOrders = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null); // To track which order is expanded

  // Fetch all orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Fetch all orders from the backend using axios
  const fetchOrders = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      toast.error('Session expired or invalid token. Please log in again.'); // Show toast error message
      return;
    }

    try {
      const response = await axiosInstance.get('/api/admin/getallorders', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Error fetching orders:', error); 
    }
  };

  // Update the order status using axios
  const updateOrderStatus = async (orderId, status) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axiosInstance.post('/api/admin/updateorderstatus', {
        orderId,
        status,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        fetchOrders(); // Refresh orders after status update
        toast.success('Order status updated successfully.'); // Show toast success message
      } else {
        toast.error('Failed to update order status.'); // Show toast error message
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Error updating order status.'); // Show toast error message
    }
  };

  // Toggle delivery address visibility
  const toggleDeliveryAddress = (orderId) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  return (
    <div className='p-8'>
      <h1 className='text-2xl font-bold mb-4'>Client Orders</h1>
      {orders.length === 0 ? (
        <p>No orders available</p>
      ) : (
        orders.map((order) => (
          <div key={order._id || Math.random()} className='grid grid-cols sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border border-gray-700 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700'>
            <h2 className='text-lg font-semibold'>Order ID: {order._id || 'N/A'}</h2>
            <p>User ID: {order.userId ? (typeof order.userId === 'object' ? order.userId._id : order.userId) : 'N/A'}</p>
            <p>Order Status: {order.status}</p>

            <div className='my-4'>
              <h3 className='font-bold'>Products:</h3>
              {order.products && order.products.length > 0 ? (
                order.products.map((prod, index) => (
                  <div key={`${order._id}-${prod.productId?._id || index}`}>
                    <p>Product ID: {prod.productId ? prod.productId._id : 'N/A'}</p>
                    <p>Quantity: {prod.quantity}</p>
                  </div>
                ))
              ) : (
                <p>No products available</p>
              )}
            </div>

            {/* Delivery address toggle section */}
            <div>
              <button onClick={() => toggleDeliveryAddress(order._id)} className="border border-gray-700 p-2 rounded">
                {expandedOrderId === order._id ? (
                  <ChevronUpIcon className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                )}
              </button>
            </div>

            {/* Show delivery address if expanded */}
            {expandedOrderId === order._id && order.deliveryInfo && (
              <div>
                <h3 className='font-bold'>Delivery Info:</h3>
                <p>Name: {order.deliveryInfo.firstName} {order.deliveryInfo.lastName}</p>
                <p>Email: {order.deliveryInfo.email}</p>
                <p>Address: {order.deliveryInfo.street}, {order.deliveryInfo.city}, {order.deliveryInfo.state}, {order.deliveryInfo.zipcode}, {order.deliveryInfo.country}</p>
                <p>Phone: {order.deliveryInfo.phone}</p>
                <p>Payment Method: {order.deliveryInfo.paymentMethod}</p>
              </div>
            )}

            {/* Dropdown for changing order status */}
            <select value={order.status} onChange={(e) => updateOrderStatus(order._id, e.target.value)} className="border border-gray-700 p-2 rounded">
              <option value='Pending'>Pending</option>
              <option value='Ready to Ship'>Ready to Ship</option>
              <option value='On the Way'>On the Way</option>
              <option value='Delivered'>Delivered</option>
              <option value='Canceled'>OrderCanceld</option>
            </select>
          </div>
        ))
      )}
    </div>
  );
};

export default ClintOrders;
