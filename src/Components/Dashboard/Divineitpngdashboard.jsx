import React, { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { FaMinusSquare , FaUsers, FaShoppingCart, FaEdit, FaTasks, FaPlusSquare} from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, AreaChart, Area, CartesianGrid, Legend, Line } from "recharts";
import { BarChartSkeleton } from "../Skeleton/BarChartSkeleton";
import { PieChartSkeleton } from "../Skeleton/BarChartSkeleton";
import {  fetchDashboardData, fetchDueInvoiceCount, fetchTodoCount, fetchPurchaseOverview } from "../utils/salesandsummary";

const DivineitpngDashboard = () => {
  const [totalSales, setTotalSales] = useState(0);
  const [stockItems, setStockItems] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [salesData, setSalesData] = useState([]);
  const [invoiceSummary, setInvoiceSummary] = useState([]);
  const [dueInvoiceCount, setDueInvoiceCount] = useState(0);
  const navigate = useNavigate();
  const [todoCount, setTodoCount] = useState(0);
  const SkeletonBox = ({ width = "w-full", height = "h-16" }) => (
    <div className={`bg-gray-300 animate-pulse rounded-md ${width} ${height} my-2`} />
  );
  const [loadingSales, setLoadingSales] = useState(true);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [loadingDueInvoices, setLoadingDueInvoices] = useState(true);
  const [loadingPendingTasks, setLoadingPendingTasks] = useState(true);
  const [loadingStocks, setLoadingStocks] = useState(true);
  const [loadingInvoiceSummary, setloadingInvoiceSummary] = useState(true);
  const [purchaseData, setPurchaseData] = useState([]);
  const [loadingPurchaseData, setLoadingPurchaseData] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchPurchaseOverview();
        setPurchaseData(data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoadingPurchaseData(false);
      }
    };

    getData();
  }, []);


  
useEffect(() => {
  const loadDashboard = async () => {
    try {
      const {
        totalSales,
        stockItems,
        totalCustomers,
        salesData,
        invoiceSummary,
      } = await fetchDashboardData();

      setTotalSales(totalSales);
      setStockItems(stockItems);
      setTotalCustomers(totalCustomers);
      setSalesData(salesData);
      setInvoiceSummary(invoiceSummary);   
      
    } catch (err) {
      console.error("Error loading dashboard:", err);
    } finally {
      setLoadingSales(false);
      setLoadingCustomers(false);
      setLoadingDueInvoices(false);
      setLoadingPendingTasks(false);
      setLoadingStocks(false);
      setloadingInvoiceSummary(false);
    }
  };

  loadDashboard();
}, []);

   
  useEffect(() => {
    const loadDueInvoiceCount = async () => {
      try {
        const count = await fetchDueInvoiceCount();
        setDueInvoiceCount(count);
      } catch (err) {
        console.error("Error loading due invoice count:", err);
      }
    };
  
    loadDueInvoiceCount();
  }, []); 

  const handleClick = () => {
    navigate("/DivineitpngCustomers"); // Redirect to Customer page
  };
  const handeltask = () => {
    navigate("/DivineitpngTask", { state: { status: "TODO" } }); // Pass "TODO" as state
  }; 

  useEffect(() => {
    const loadTodoCount = async () => {
      try {
        const count = await fetchTodoCount();
        setTodoCount(count);
      } catch (err) {
        console.error("Error loading todo count:", err);
      }
    };
  
    loadTodoCount();
  }, []);  
  

  return (
    <div className="min-h-screen p-6">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">Operations Overview</span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Divineitpng Dashboard</h2>
          <p className="mt-2 text-sm text-stone-600">Track revenue, customers, pending work, stock, and purchasing from one view.</p>
        </div>
      </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
           <div className="rounded-[28px] border border-[#dfd3c3] bg-[linear-gradient(180deg,rgba(255,253,250,0.98),rgba(255,248,239,0.96))] p-5 shadow-[0_18px_45px_rgba(73,47,24,0.08)] transition duration-200 hover:-translate-y-1">
           {loadingSales ? (
      <SkeletonBox />
    ) : (
      <div className="flex items-center gap-4">
        <div className="rounded-2xl bg-teal-100 p-4 text-3xl text-teal-700">
          <FaShoppingCart />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Total Sales</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">₹{Number(totalSales).toFixed(2)}</p>
        </div>
      </div>
    )}
           </div>


           <div className="cursor-pointer rounded-[28px] border border-[#dfd3c3] bg-[linear-gradient(180deg,rgba(255,253,250,0.98),rgba(255,248,239,0.96))] p-5 shadow-[0_18px_45px_rgba(73,47,24,0.08)] transition duration-200 hover:-translate-y-1" onClick={handleClick}>
           {loadingCustomers ? (
      <SkeletonBox />
    ) : (
      <div className="flex items-center gap-4">
        <div className="rounded-2xl bg-emerald-100 p-4 text-3xl text-emerald-700">
          <FaUsers />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Total Customers</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{totalCustomers}</p>
        </div>
      </div>
    )}
    </div>
          <div className="cursor-pointer rounded-[28px] border border-[#dfd3c3] bg-[linear-gradient(180deg,rgba(255,253,250,0.98),rgba(255,248,239,0.96))] p-5 shadow-[0_18px_45px_rgba(73,47,24,0.08)] transition duration-200 hover:-translate-y-1" onClick={handleClick}>
          {loadingDueInvoices ? (
      <SkeletonBox />
    ) : (
      <div className="flex items-center gap-4">
        <div className="rounded-2xl bg-rose-100 p-4 text-3xl text-rose-700">
          <FaUsers />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Payment Due</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{dueInvoiceCount}</p>
        </div>
      </div>
    )}
        </div>

        <div>
           <div className="cursor-pointer rounded-[28px] border border-[#dfd3c3] bg-[linear-gradient(180deg,rgba(255,253,250,0.98),rgba(255,248,239,0.96))] p-5 shadow-[0_18px_45px_rgba(73,47,24,0.08)] transition duration-200 hover:-translate-y-1" onClick={handeltask}>
            {loadingPendingTasks? ( 
               <SkeletonBox />             
            ) : (
              <div className="flex items-center gap-4">          
              <div className="rounded-2xl bg-amber-100 p-4 text-3xl text-amber-700">
                <FaTasks />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Pending Tasks</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{todoCount}</p>
              </div>
              </div>
            )}
           </div>
       </div>
       
      </div>

{/* Stock Items Section */}
<div className="mt-6 rounded-[28px] border border-[#dfd3c3] bg-[linear-gradient(180deg,rgba(255,253,250,0.98),rgba(255,248,239,0.96))] p-5 shadow-[0_18px_45px_rgba(73,47,24,0.08)]">
  <div className="flex justify-between items-center">
    <h3 className="text-xl font-semibold text-gray-800">Stock Items</h3>
    {loadingStocks ? (
      <SkeletonBox />
    ) : (
      <>
        {expanded ? (
          <FaMinusSquare
            className="cursor-pointer text-gray-500 hover:text-gray-700 h-10"
            onClick={() => setExpanded(false)}
          />
        ) : (
          <FaPlusSquare
            className="cursor-pointer text-gray-500 hover:text-gray-700 h-10"
            onClick={() => setExpanded(true)}
          />
        )}
      </>
    )}
  </div>

  {expanded && (
    <div className="overflow-x-auto mt-4">
      <table className="w-full border-collapse overflow-hidden rounded-2xl">
        <thead>
          <tr className="bg-teal-50 text-stone-600">
            <th className="border-b border-[#dfd3c3] p-3">Name</th>
            <th className="border-b border-[#dfd3c3] p-3">Category</th>
            <th className="border-b border-[#dfd3c3] p-3">Quantity</th>
            <th className="border-b border-[#dfd3c3] p-3">Price (₹)</th>
            <th className="border-b border-[#dfd3c3] p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {stockItems.map((item) => (
            <tr key={item._id} className="text-center bg-white/70 hover:bg-stone-50">
              <td className="border-b border-[#e8dfd4] p-3">{item.name}</td>
              <td className="border-b border-[#e8dfd4] p-3">{item.category}</td>
              <td className="border-b border-[#e8dfd4] p-3">{item.quantity}</td>
              <td className="border-b border-[#e8dfd4] p-3">{item.price}</td>
              <td
                className="border-b border-[#e8dfd4] p-3 cursor-pointer"
                onClick={() => navigate(`/DivineitpngStockManagement/${item._id}`)}
              >
                <FaEdit className="text-teal-700 ml-3" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>
      

<div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Sales Overview Bar Chart - Left Side on Larger Screens */}
  <div className="rounded-[28px] border border-[#dfd3c3] bg-[linear-gradient(180deg,rgba(255,253,250,0.98),rgba(255,248,239,0.96))] p-5 shadow-[0_18px_45px_rgba(73,47,24,0.08)]">
    <h3 className="text-xl font-semibold text-gray-800">Sales Overview</h3>
    {loadingSales ? (
      <BarChartSkeleton />
    ) : (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={salesData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#4A90E2" />
        </BarChart>
      </ResponsiveContainer>
    )}
  </div>

  <div className="rounded-[28px] border border-[#dfd3c3] bg-[linear-gradient(180deg,rgba(255,253,250,0.98),rgba(255,248,239,0.96))] p-5 shadow-[0_18px_45px_rgba(73,47,24,0.08)]">
  <h3 className="text-xl font-semibold text-gray-800 mb-4">Invoice Summary</h3>
  {loadingInvoiceSummary ? (
    <PieChartSkeleton />
  ) : (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={invoiceSummary} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="lable" stroke="#8884d8" />
        <YAxis stroke="#8884d8" />
        <Tooltip />
        <Legend verticalAlign="top" height={36} />
        <Line
          type="monotone"
          dataKey="Invoiced"
          stroke="#0088FE"
          strokeWidth={2.5}
          activeDot={{ r: 6 }}
          dot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="Received"
          stroke="#00C49F"
          strokeWidth={2.5}
          activeDot={{ r: 6 }}
          dot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="Outstanding"
          stroke="#FFBB28"
          strokeWidth={2.5}
          activeDot={{ r: 6 }}
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )}
</div>

      </div>   

      <div className="mt-6 rounded-[28px] border border-[#dfd3c3] bg-[linear-gradient(180deg,rgba(255,253,250,0.98),rgba(255,248,239,0.96))] p-5 shadow-[0_18px_45px_rgba(73,47,24,0.08)]">
  <h3 className="text-xl font-semibold text-gray-800">Purchase Overview</h3>
  {loadingPurchaseData ? (
    <BarChartSkeleton />
  ) : (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={purchaseData}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="amount"
          stroke="#10B981"
          fill="#D1FAE5"
          strokeWidth={3}
        />
      </AreaChart>
    </ResponsiveContainer>
  )}
</div>
    </div>
  );
};

export default DivineitpngDashboard;
