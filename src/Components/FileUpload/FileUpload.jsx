import React, { useState } from "react";
import axiosInstance from "../axiosInstance/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS for toast notifications

const FileUpload = () => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", file); // Update "file" to "image" or "document"
    formData.append("title", title);

    try {
      const response = await axiosInstance.post(
        "/api/fileupload/fileupload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setMessage(response.data.message);
      toast.success("File uploaded successfully!"); // Success toast

      // Reset form after successful upload
      setTitle("");
      setFile(null);
    } catch (error) {
      console.error(error);
      setMessage("Error uploading file.");
      toast.error("Error uploading file."); // Error toast
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-lg">
        <h1 className="text-2xl font-semibold mb-4 text-center">Upload File</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">File</label>
            <input
              type="file"
              name="attachments"
              multiple
              onChange={handleFileChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Upload
          </button>
        </form>
        {message && <p className="mt-4 text-center text-gray-600">{message}</p>}
      </div>
      <ToastContainer />
    </div>
  );
};

export default FileUpload;
