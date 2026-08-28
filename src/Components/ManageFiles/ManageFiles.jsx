import React, { useEffect, useState } from 'react';
import axios from 'axios';
import axiosInstance from '../axiosInstance/axiosInstance';

const ManageFiles = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch files from the backend
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axiosInstance.get('/api/fileupload');
        setFiles(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching files:', err);
        setLoading(false);
      }
    };
    
    fetchFiles();
  }, []);

  // Delete file
  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/fileupload/${id}`);
      setFiles(files.filter(file => file._id !== id)); // Remove file from the UI
    } catch (err) {
      console.error('Error deleting file:', err);
    }
  };

  if (loading) {
    return <div className="text-center text-xl">Loading files...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Manage Files</h2>
      <ul className="space-y-4">
        {files.map(file => (
          <li key={file._id} className="flex justify-between items-center p-10 m-1 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md">
            <a
              href={file.attachments[0]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {file.title}
            </a>
            <button
              onClick={() => handleDelete(file._id)}
              className="ml-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageFiles;
