import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance/axiosInstance";
import { useNavigate } from "react-router-dom";
import { getUserImage, isUserAllowed } from "../utils/allowedUsers";
import { allowedUsers } from "../utils/allowedUsers";
import { useLocation } from "react-router-dom";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // Main style file
import "react-date-range/dist/theme/default.css"; // Theme file

const SkylapTask = () => {
  const location = useLocation();
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7; // Adjust as needed
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const pageNumbers = [...Array(totalPages).keys()].map((num) => num + 1);
  const currentItems = filteredTasks.slice(indexOfFirstItem, indexOfLastItem);
  const [filters, setFilters] = useState({ date: "", connect: "", status: location.state?.status || "", assigned: "",  });
  const [showFilters, setShowFilters] = useState({ date: false, connect: false, status: false, assigned: false, });
  const [userError, setUserError] = useState("");
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState({
          startDate: new Date(),
          endDate: new Date(),
          key: 'selection',
        });
         // Toggle Date Filter
    const toggleDateFilter = () => {
      setShowDateFilter((prev) => !prev);
      if (!showDateFilter) {
        setFilteredTasks(tasks);
      }
    };

    // Handle Date Selection
    const handleDateChange = (ranges) => {
      const { startDate, endDate } = ranges.selection;
    
      setDateRange({ startDate, endDate, key: "selection" });
    
      // Ensure dates are properly formatted for comparison
      const filtered = tasks.filter((task) => {
        if (!task.deadline) return false; // Skip if no date exists
    
        const deadline = new Date(task.deadline);
        const start = new Date(startDate).setHours(0, 0, 0, 0);
        const end = new Date(endDate).setHours(23, 59, 59, 999);
    
        return deadline >= start && deadline <= end;
      });
    
      setFilteredTasks(filtered);
    
      // Close the filter when two different dates are selected
      if (startDate.getTime() === endDate.getTime()) {
        if (clickCount === 1) {
          setShowDateFilter(false);
          setClickCount(0);
        } else {
          setClickCount(1);
          setTimeout(() => setClickCount(0), 300);
        }
      } else {
        setShowDateFilter(false);
      }
    };
    

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axiosInstance.get("/api/task/all");
        setTasks(response.data);
        setFilteredTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const handleRowClick = (task) => {
    navigate(`/skylapshowtask/${task.taskId}`);
  };

  const toggleFilter = (filter) => {
    setShowFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    if (name === "assigned") {
      if (value && !allowedUsers.some((user) => user.toLowerCase().includes(value.toLowerCase()))) {
        setUserError("User not found");
      } else {
        setUserError("");
      }
    }

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    let filtered = tasks.filter((task) => {
      return (
        (!filters.date || new Date(task.deadline).toDateString().includes(filters.date)) &&
        (!filters.connect || task.company.toLowerCase().includes(filters.connect.toLowerCase())) &&
        (!filters.status || task.status === filters.status) &&
        (!filters.assigned || task.assignedUser.toLowerCase().includes(filters.assigned.toLowerCase()))
      );
    });
    setFilteredTasks(filtered);
  }, [filters, tasks]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-semibold mb-4">Manage Task</h2>

      {/* Search Filters */}
      <div className="bg-gray-300 py-4 px-2">
      <div className="flex space-x-6 mb-4">
        {/* Date Filter */}
        <div>
          <button
            onClick={toggleDateFilter}
            className="bg-gray-800 hover:bg-gray-700 text-white font-semibold px-4 py-2 rounded transition-all duration-300"
          >
            {showDateFilter ? "Hide Date Filter" : "Show Date Filter 📅"}
          </button>

          
        </div>

        {/* Connect Filter */}
        <div>
          <button onClick={() => toggleFilter("connect")} className="font-semibold text-gray-100 border-gray-100 bg-gray-700 rounded px-3 py-2 hover:bg-gray-500">
            Connect
          </button>
          {showFilters.connect && (
            <input
              type="text"
              name="connect"
              value={filters.connect}
              onChange={handleFilterChange}
              placeholder="Search by Connect"
              className="px-4 py-2 border rounded block mt-2"
            />
          )}
        </div>

        {/* Status Filter */}
         {/* Status Filter */}
      <div>
        <button
          onClick={() => setShowFilters({ ...showFilters, status: !showFilters.status })}
          className="font-semibold text-gray-100 border-gray-100 bg-gray-700 rounded px-3 py-2 hover:bg-gray-500"
        >
          Status
        </button>
        {showFilters.status && (
          <select
            name="status"
            value={filters.status} // Default set to "TODO"
            onChange={handleFilterChange}
            className="px-4 py-2 border rounded block mt-2"
          >
            <option value="">All Status</option>
            <option value="TODO">To Do</option>
            <option value="PROCESSING">Processing</option>
            <option value="FAILED">Failed</option>
            <option value="BLOCKED">Blocked</option>
            <option value="DONE">Done</option>
          </select>
        )}
      </div>

        {/* Assigned User Filter */}
        <div>
          <button onClick={() => toggleFilter("assigned")} className="font-semibold text-gray-100 border-gray-100 bg-gray-700 rounded px-3 py-2 hover:bg-gray-500">
            Assigned User
          </button>
          {showFilters.assigned && (
            <div>
              <input
                type="text"
                name="assigned"
                value={filters.assigned}
                onChange={handleFilterChange}
                 autoComplete="off"
                list="allowedUsers"
                placeholder="Search Assigned User"
                className="px-4 py-2 border rounded block mt-2"
              />
              <datalist id="allowedUsers">
                {allowedUsers.map((user) => (
                  <option key={user} value={user} />
                ))}
              </datalist>
              {userError && <p className="text-red-500 text-sm">{userError}</p>}
            </div>
          )}
        </div>     

      </div>
       {/* Date Picker */}
       <div className="relative">
                  {showDateFilter && (
                    <div className="absolute top-full left-0 bg-white shadow-lg border rounded-lg z-50">
                     <DateRange
                      ranges={[dateRange]}
                      onChange={handleDateChange}
                      moveRangeOnFirstSelection={false} // This prop is valid
                      className="border rounded"
                    />
                    </div>
                  )}
                </div>

      <div className=" space-x-2 ml-10">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-900 text-white rounded-lg disabled:opacity-50"
          > Prev
          </button>

          {/* Dynamically display page numbers */}
          {pageNumbers
            .filter((number) => {
              // Show range of pages around the current page
              return (
                number >= currentPage - 2 &&
                number <= currentPage + 2 &&
                number > 0 &&
                number <= totalPages
                );
                })
                .map((number) => (
               <button
                key={number}
                onClick={() => setCurrentPage(number)}
                className={`px-3 py-1 rounded-lg ${
                currentPage === number
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {number}
            </button>
          ))}
      <button
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage >= totalPages}
        className="px-3 py-1 bg-gray-900 text-white rounded-lg disabled:opacity-50" >
        Next
      </button>
    </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow-md rounded overflow-hidden font-poppins mt-3">
        <table className="w-full border-collapse">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="py-2 px-4 text-left border-r">DATE</th>
              <th className="py-2 px-4 text-left border-r">FROM / TO</th>
              <th className="py-2 px-4 text-left border-r">STATUS</th>
              <th className="py-2 px-4 text-left border-r">TITLE</th>
              <th className="py-2 px-4 text-left border-r">CONNECT</th>
              <th className="py-2 px-4 text-left">ACTIVITY</th>
            </tr>
          </thead>
          <tbody>
          {currentItems.length > 0 ? (
                currentItems.map((task, index) => (
              <tr 
              key={task._id}  
              className={`border-b pb-10 hover:bg-gray-100 cursor-pointer ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              }`} 
              onClick={() => handleRowClick(task)}
            >
              {/* DATE */}
              <td className="py-2 px-4 border-r">{new Date(task.deadline).toDateString()}</td>
        
              {/* FROM / TO (Assigned and Created User) */}
              <td className="py-2 px-4 border-r">
                <div className="flex flex-col gap-1">
                  {/* Assigned User */}
                  <div className="flex items-center gap-2">
                  <img
                    src={getUserImage(task?.assignedUser)}
                    alt={task?.assignedUser}
                    className="w-8 h-8 rounded-full"
                  />
                  <p className="text-sm text-gray-700">{task?.assignedUser}</p>
                  </div>
        
                  {/* Created By */}
                  <div className="flex items-center gap-2">
                  <img
                    src={getUserImage(task?.createdBy)}
                    alt={task?.createdBy}
                    className="w-8 h-8 rounded-full"
                  />
                  <p className="text-sm text-gray-700">
                    {isUserAllowed(task?.createdBy) ? task?.createdBy : "Unknown"}
                  </p>
                  </div>
                </div>
              </td>
        
              {/* STATUS */}
              <td className="py-2 px-4 border-r">
  <span
    className={`px-2 py-1 text-sm font-semibold rounded 
      ${task.status === "DONE" ? "bg-green-500 text-white" : ""}
      ${task.status === "PROCESSING" ? "bg-yellow-500 text-white" : ""}
      ${task.status === "FAILED" ? "bg-red-500 text-white" : ""}
      ${task.status === "BLOCKED" ? "bg-black text-white" : ""}
      ${task.status === "TODO" ? "bg-blue-500 text-white" : ""}`}
  >
    {task.status}
  </span>
</td>

        
              {/* TITLE */}
              <td className="py-2 px-4 font-semibold border-r">{task.title}</td>
        
              {/* CONNECT */}
              <td className="py-2 px-4 border-r">{task.company}</td>
        
              {/* ACTIVITY */}
              <td className="py-2 px-4 text-red-500">
                Deadline: {new Date(task.deadline).toDateString()}
              </td>
            </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No tasks found</td>
            </tr>
          )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SkylapTask;
