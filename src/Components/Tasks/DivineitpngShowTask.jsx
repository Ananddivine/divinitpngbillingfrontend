import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance/axiosInstance";
import { FaTrash, FaEdit  } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import verifyToken from "../utils/verifyToken";
import { profileData, getUserImage, isUserAllowed, allowedUsers  } from "../utils/allowedUsers";



const SkylapShowTask = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [error, setError] = useState("");
  const [editedTask, setEditedTask] = useState({
    title: task?.title || "",
    serialnumber: task?.serialnumber || "",
    company: task?.company || "",
    assignedUser: task?.assignedUser || ""
  });
  
  useEffect(() => {
    if (task) {
      setEditedTask({
        title: task.title || "",
        serialnumber: task.serialnumber || "",
        company: task.company || "",
        assignedUser: task.assignedUser || ""
      });
    }
  }, [task]);
  
const handleEdit = () => {
  setIsEditOpen(true);
};


const handleInputChange = (e) => {
  const { name, value } = e.target;
  setEditedTask({ ...editedTask, [name]: value });

  // Check if assignedUser field is being updated
  if (name === "assignedUser") {
    if (value.trim() === "") {
      setFilteredUsers([]);
      setShowSuggestions(false);
      setError(""); // Clear error when input is empty
    } else {
      const filtered = allowedUsers.filter((user) =>
        user.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredUsers(filtered);
      setShowSuggestions(true);

      // Check if the input is a valid allowed user
      if (!allowedUsers.includes(value)) {
        setError("User not found"); // Set error if input is not a valid user
      } else {
        setError(""); // Clear error if user is valid
      }
    }
  }
};

const handleSelectUser = (user) => {
  setEditedTask({ ...editedTask, assignedUser: user });
  setFilteredUsers([]);
  setShowSuggestions(false);
  setError(""); // Clear error on valid selection
};


  useEffect(() => {
    const checkAuthorization = async () => {
      const { isAuthorized, userRole } = await verifyToken();
      setIsAuthorized(isAuthorized);
      setUserRole(userRole);
    };

    checkAuthorization();
  }, []);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axiosInstance.get(`/api/task/task/${taskId}`);
        setTask(response.data);
      } catch (error) {
        console.error("Error fetching task:", error);
        toast.error("Failed to fetch task details");
      }
    };

    fetchTask();
  }, [taskId]);


  const fetchComments = async () => {
    if (!task || !task.taskId) return;

    try {
      const response = await axiosInstance.get(`/api/task/comments/${task.taskId}`);
      setComments(response.data.comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to fetch comments");
    }
  };

  useEffect(() => {
    if (task && task.taskId) {
      fetchComments();
    }
  }, [task]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
  
    // Get user email from localStorage
    const userEmail = localStorage.getItem("userEmail");
  
    // Get user name from profileData, defaulting to "User" if not found
    const userProfile = profileData[userEmail] || { name: "User" };
    const username = userProfile.name;
  
    try {
      const response = await axiosInstance.post("/api/task/comment", {
        taskId: task.taskId,
        user: username, // ✅ Dynamically assign username
        text: newComment,
      });
  
      setComments(response.data.task.conversations);
      setNewComment("");
      toast.success("Comment added successfully!");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    }
  };
  

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    try {
      await axiosInstance.put(`/api/task/update-status/${task.taskId}`, { status: newStatus });
      setTask((prevTask) => ({ ...prevTask, status: newStatus }));
      toast.success("Task status updated!");
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleDeleteTask = async () => {
    try {
        console.log("Deleting task with ID:", taskId);

        const userEmail = localStorage.getItem("userEmail");
        const uniqToken = localStorage.getItem("uniqToken");

        if (!userEmail || !uniqToken) {
            toast.error("Authentication failed! Please log in again.");
            return;
        }

        await axiosInstance.delete(`/api/task/deleteTask/${taskId}`, {
            headers: {
                Authorization: `Bearer ${uniqToken}`, // Use Authorization header
                "User-Email": userEmail,  // Rename to avoid CORS issues
            }
        });

        toast.success("Task deleted successfully!");

        // Redirect after successful deletion
        setTimeout(() => {
            navigate("/skylaptask");
        }, 2000);
    } catch (error) {
        console.error("Error deleting task", error);
        toast.error("Failed to delete task");
    }
};

const handleSaveEdit = async () => {
  // Validate if assigned user is in allowedUsers
  if (!allowedUsers.includes(editedTask.assignedUser)) {
    setError("User not found");
    return; // Stop the function
  }

  try {
    const response = await axiosInstance.put(`/api/task/update/${taskId}`, editedTask);
    toast.success("Task updated successfully");
    setTask(response.data.task); // Update local state
    setIsEditOpen(false);
  } catch (error) {
    console.error("Error updating task:", error);
    toast.error("Failed to update task");
  }
};



  if (!task) {
    return <div className="p-6 text-red-500">Loading task details...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-poppins">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6 border">
         {/* Task Header with Delete Icon */}
         <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h2 className="text-2xl font-semibold text-gray-900">Task Details</h2>
          
                {/* Edit & Trash Icons */}
                {isAuthorized && (
                  <div className="flex items-center gap-3">
                    <FaEdit
                  className="text-blue-500 hover:text-blue-700 cursor-pointer text-xl"
                  onClick={handleEdit}
                />

                    <FaTrash
                      className="text-red-500 hover:text-red-700 cursor-pointer text-xl"
                      onClick={() => handleDeleteTask(task.taskId)}
                    />
                  </div>
                )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-white rounded-lg border">
            <h3 className="font-semibold text-lg text-gray-900">{task.title}</h3>
            <p className="text-xl text-gray-700 mt-2">{task.company}</p>
            <p className="text-lg text-gray-700 mt-2">{task.serialnumber}</p>
          </div>

          <div className="p-4 bg-white rounded-lg border">
          <h3 className="font-semibold text-lg text-gray-900 mb-2">Assigned User</h3>
          <div className="grid grid-cols-2 gap-4">
            {/* Left Side - Assigned User */}
            <div className="bg-gray-50 p-3 rounded-md border">
        <h4 className="font-medium text-gray-800">Assigned To</h4>
        <div className="flex items-center gap-2 mt-1">
          <img
            src={getUserImage(task?.assignedUser)}
            alt={task?.assignedUser}
            className="w-8 h-8 rounded-full"
          />
          <p className="text-sm text-gray-700">{task?.assignedUser}</p>
        </div>
      </div>
            {/* Right Side - Created By */}
            <div className="bg-gray-50 p-3 rounded-md border">
        <h4 className="font-medium text-gray-800">Created By</h4>
        <div className="flex items-center gap-2 mt-1">
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
    </div>
          </div>
    
          <div className="p-4 bg-white rounded-lg border">
            <h3 className="font-semibold text-lg text-gray-900">Status</h3>
            <select
              value={task.status || "TODO"}
              onChange={handleStatusChange}
              className="w-full p-2 border rounded-md bg-gray-50 text-gray-900"
            >
              <option value="TODO">To Do</option>
              <option value="PROCESSING">Processing</option>
              <option value="FAILED">Failed</option>
              <option value="BLOCKED">Blocked</option>
              <option value="DONE">Done</option>
            </select>
          </div>

          <div className="p-4 bg-white rounded-lg border">
            <h3 className="font-semibold text-lg text-gray-900">Deadline</h3>
            <p className="text-sm text-gray-700">{task.deadline || "Not specified"}</p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-white rounded-lg border">
          <h3 className="font-semibold text-lg text-gray-900">Skylap Team Conversation</h3>

          <div className="mt-3 space-y-3">
            {comments.map((comment, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-md border">
                <p className="text-gray-700 font-medium">{comment.user}</p>
                <p className="text-gray-900">{comment.text}</p>
                <p className="text-xs text-gray-500">{new Date(comment.time).toLocaleString()}</p>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <textarea
              className="w-full p-3 border rounded-md focus:ring-1 focus:ring-gray-400 outline-none"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            ></textarea>
            <button
              onClick={handleAddComment}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Add Comment
            </button>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />

      {isEditOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 className="text-xl font-semibold mb-4">Edit Task</h2>

      <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
      <input
        type="text"
        name="title"
        value={editedTask.title}
        onChange={handleInputChange}
        className="w-full p-2 mb-3 border rounded"
        placeholder="Enter task title"
         autoComplete="off"
      />

      <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
      <input
        type="text"
        name="serialnumber"
        value={editedTask.serialnumber}
        onChange={handleInputChange}
        className="w-full p-2 mb-3 border rounded"
        placeholder="Enter serial number"
         autoComplete="off"
      />

      <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
      <input
        type="text"
        name="company"
        value={editedTask.company}
        onChange={handleInputChange}
        className="w-full p-2 mb-3 border rounded"
        placeholder="Enter company name"
         autoComplete="off"
      />

<label className="block text-sm font-medium text-gray-700 mb-1">Assigned User</label>
<div className="relative">
  <input
    type="text"
    name="assignedUser"
    value={editedTask.assignedUser}
    onChange={handleInputChange}
    className={`w-full p-2 mb-1 border rounded ${error ? "border-red-500" : ""}`}
    placeholder="Search and select user"
    autoComplete="off"
  />

  {showSuggestions && filteredUsers.length > 0 && (
    <ul className="absolute z-10 bg-white border rounded w-full mt-1 max-h-40 overflow-y-auto shadow-md">
      {filteredUsers.map((user, index) => (
        <li
          key={index}
          onClick={() => handleSelectUser(user)}
          className="p-2 cursor-pointer hover:bg-gray-200"
        >
          {user}
        </li>
      ))}
    </ul>
  )}

  {/* Error Message Below Input */}
  {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
</div>


      <div className="flex justify-end gap-3">
        <button
          onClick={() => setIsEditOpen(false)}
          className="px-4 py-2 bg-gray-400 text-white rounded"
        >
          Cancel
        </button>
        <button
          onClick={handleSaveEdit}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default SkylapShowTask;
