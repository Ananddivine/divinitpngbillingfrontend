import React, { useState } from 'react';
import navlogo from '../../assets/logo.png';
import navProfileAnand from '../../assets/nav-profile.jpg';
import{ FaDotCircle} from "react-icons/fa";


const profileData = {
  "anand@Skylapit.com": { image: navProfileAnand, name: "Anand" },
  
};

const Navbar = ({ setToken }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const userEmail = localStorage.getItem('userEmail');
  const userProfile = profileData[userEmail] || { image: navProfileAnand, name: "User" };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    setToken('');
    setDropdownOpen(false);
  };

  return (
    <div className="relative flex items-center justify-between bg-white shadow-md px-5 py-3">
      <img src={navlogo} alt="Logo" className="h-16 ml-20" />

      <div className="relative">
        <div
          className="flex items-center cursor-pointer space-x-2"
         
        >
          <img
            src={userProfile.image}
            alt="Profile"
            className="w-10 h-10 rounded-full border border-gray-300"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          />
         
        </div>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 text-gray-200 bg-gray-900 border border-gray-200 shadow-lg rounded-md overflow-hidden z-50">
            <div className="p-3 border-b">
              <p className="text-sm font-semibold">{userProfile.name}</p>
              <p className="text-xs text-gray-500 flex items-center gap-1"><FaDotCircle className='text-green-600'/>{userEmail}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-800 bg-gray-900 hover:text-red-600"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
