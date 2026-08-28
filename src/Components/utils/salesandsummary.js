// src/utils/salesAndSummary.js
import axiosInstance from "../axiosInstance/axiosInstance";
import { formatDate } from "./dateUtils";

// Fetch dashboard summary data
export const fetchDashboardData = async () => {
  try {
    const [salesRes, stockRes, customersRes, salesDataRes, invoiceRes] = await Promise.all([
      axiosInstance.get("/api/sales/total"),
      axiosInstance.get("/api/getstock/items"),
      axiosInstance.get("/api/getcustomers/total"),
      axiosInstance.get("/api/sales/data"),
      axiosInstance.get("/api/summary"),
    ]);

    const totalSales = salesRes.data.totalSales || 0;
    const stockItems = stockRes.data || [];
    const totalCustomers = customersRes.data.totalCustomers || 0;

    const salesData = salesDataRes.data && typeof salesDataRes.data === "object"
      ? [
          { name: "Total Sales", value: salesDataRes.data.totalSales || 0 },
          { name: "Total Customers", value: salesDataRes.data.totalCustomers || 0 },
          { name: "Total Invoices", value: salesDataRes.data.totalInvoices || 0 },
        ]
      : [{ name: "No Data", value: 0 }];

      
      const invoiceSummary = invoiceRes.data?.invoiceSummary || [];

    return {
      totalSales,
      stockItems,
      totalCustomers,
      salesData,
      invoiceSummary,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
};

// Fetch due invoice count
export const fetchDueInvoiceCount = async () => {
  try {
    const response = await axiosInstance.get("/api/due-count");
    return response.data.dueCount;
  } catch (error) {
    console.error("Error fetching due invoices count:", error);
    throw error;
  }
};

// Fetch TODO task count
export const fetchTodoCount = async () => {
  try {
    const response = await axiosInstance.get("/api/task/todo-count");
    return response.data.count;
  } catch (error) {
    console.error("Error fetching todo task count:", error);
    throw error;
  }
};


export const fetchPurchaseOverview = async () => {
  try {
    const res = await axiosInstance.get(`/api/overview`);
    return res.data.map(item => ({
      ...item,
      date: formatDate(item.date),
    }));
  } catch (error) {
    console.error("Failed to fetch purchase data:", error);
    throw error;
  }
};