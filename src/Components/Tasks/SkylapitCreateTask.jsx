import React, { useState } from "react";
import axiosInstance from "../axiosInstance/axiosInstance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { allowedUsers } from "../utils/allowedUsers";

const SkylapCreateTask = () => {
  const [taskData, setTaskData] = useState({
    title: "",
    company: "",
    serialnumber: "",
    companyId: "",
    department: "",
    assignedUser: "",
    createdBy: "",
    deadline: "",
    status: "TODO",
    priority: "MEDIUM",
  });

  const [errors, setErrors] = useState({
    assignedUser: "",
    createdBy: "",
  });

  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showDropdown, setShowDropdown] = useState({ assignedUser: false, createdBy: false });

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    setTaskData({ ...taskData, [name]: value });
  
    if (name === "assignedUser" || name === "createdBy") {
      const isValidUser = allowedUsers.includes(value);
      
      setErrors((prev) => ({ ...prev, [name]: isValidUser ? "" : "Invalid user!" }));
      
      setFilteredUsers(
        allowedUsers.filter((user) => user.toLowerCase().includes(value.toLowerCase()))
      );
      
      setShowDropdown((prev) => ({ ...prev, [name]: true }));
    }
  };
  

  const handleSelectUser = (name, user) => {
    setTaskData((prev) => ({ ...prev, [name]: user }));
    
    // Clear validation errors for the selected user
    setErrors((prev) => ({ ...prev, [name]: "" }));
  
    // Hide dropdown after selection
    setShowDropdown((prev) => ({ ...prev, [name]: false }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (errors.assignedUser || errors.createdBy) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    try {
      const response = await axiosInstance.post("/api/task/create", taskData);
      toast.success("Task created successfully! 🎉");
      console.log(response.data);
    } catch (error) {
      toast.error("Failed to create task. ❌");
      console.error("Error creating task:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 pb-10 pt-4">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="bg-white p-8 shadow-lg rounded-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Create Task</h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-600">Task Title</label>
            <input
              type="text"
              name="title"
              placeholder="Enter task title"
              value={taskData.title}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
                autoComplete="off"
            />
          </div>

          <div>
            <label className="block text-gray-600">Company</label>
            <input
              type="text"
              name="company"
              placeholder="Company Name"
              value={taskData.company}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
              autoComplete="off"
            />
          </div>

          <div>
            <label className="block text-gray-600">serialnumber</label>
            <input
              type="text"
              name="serialnumber"
              placeholder="serialnumber"
              value={taskData.serialnumber}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
              autoComplete="off"
            />
          </div>



          <div>
            <label className="block text-gray-600">Company ID</label>
            <input
              type="text"
              name="companyId"
              placeholder="Company ID"
              value={taskData.companyId}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
              autoComplete="off"
            />
          </div>

          <div>
            <label className="block text-gray-600">Department</label>
            <input
              type="text"
              name="department"
              placeholder="Department"
              value={taskData.department}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
                autoComplete="off"
            />
          </div>

          <div>
          <label className="block text-gray-600">Assigned User</label>
            <input
              type="text"
              name="assignedUser"
              placeholder="Anand, Divine, AmalRaj, David"
              value={taskData.assignedUser}
              onChange={handleChange}
              onFocus={() => setShowDropdown((prev) => ({ ...prev, assignedUser: true }))}
              className="w-full p-2 border border-gray-300 rounded"
                autoComplete="off"
            />
            {showDropdown.assignedUser && filteredUsers.length > 0 && (
              <ul className="border border-gray-300 mt-1 rounded bg-white shadow-lg absolute z-10 w-64">
                {filteredUsers.map((user, index) => (
                  <li
                    key={index}
                    className="p-2 cursor-pointer hover:bg-gray-200"
                    onClick={() => handleSelectUser("assignedUser", user)}
                  >
                    {user}
                  </li>
                ))}
              </ul>
            )}
            {errors.assignedUser && <p className="text-red-500 text-sm">{errors.assignedUser}</p>}
          </div>

          <div>
            <label className="block text-gray-600">Created By</label>
            <input
              type="text"
              name="createdBy"
              placeholder="Anand, Divine, AmalRaj, David"
              value={taskData.createdBy}
              onChange={handleChange}
              onFocus={() => setShowDropdown((prev) => ({ ...prev, createdBy: true }))}
              className="w-full p-2 border border-gray-300 rounded"
                autoComplete="off"
            />
            {showDropdown.createdBy && filteredUsers.length > 0 && (
              <ul className="border border-gray-300 mt-1 rounded bg-white shadow-lg absolute z-10 w-64">
                {filteredUsers.map((user, index) => (
                  <li
                    key={index}
                    className="p-2 cursor-pointer hover:bg-gray-200"
                    onClick={() => handleSelectUser("createdBy", user)}
                  >
                    {user}
                  </li>
                ))}
              </ul>
            )}
            {errors.createdBy && <p className="text-red-500 text-sm">{errors.createdBy}</p>}
          </div>

          <div>
            <label className="block text-gray-600">Deadline</label>
            <input
              type="date"
              name="deadline"
              value={taskData.deadline}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
                autoComplete="off"
            />
          </div>

          <div>
            <label className="block text-gray-600">Status</label>
            <select
              name="status"
              value={taskData.status}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="TODO">To Do</option>
              <option value="PROCESSING">Processing</option>
              <option value="FAILED">Failed</option>
              <option value="BLOCKED">Blocked</option>
              <option value="DONE">Done</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-600">Priority</label>
            <select
              name="priority"
              value={taskData.priority}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="HIGHEST">HIGHEST</option>
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="LOW">LOW</option>
            </select>
          </div>

          <div className="col-span-2">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SkylapCreateTask;
