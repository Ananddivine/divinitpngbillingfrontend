import React, { useEffect, useState } from "react";
import Navbar from "./Components/Navbar/Navbar";
import Admin from "./Pages/admin/Admin";
import Login from "./Components/Login/Login";
import "./index.css";
import DivineitpngPo from "./Components/DivineitpngPo/DivineitpngPo";
import { Routes, Route, useLocation } from "react-router-dom";
import DivineitpngPoOrders from "./Components/DivineitpngPo/DivineitpngPoOrders";
import Footer from "./Components/Footer/Footer";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const PING_INTERVAL = 1 * 60 * 1000; // 1 minute

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const location = useLocation(); // Get current route

  useEffect(() => {
    const storedExpirationTime = localStorage.getItem("tokenExpiration");
    const currentTime = new Date().getTime();
    if (storedExpirationTime && currentTime > storedExpirationTime) {
      localStorage.removeItem("token");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("tokenExpiration");
      setToken("");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  // Hide Navbar for these pages
  const hideNavbarRoutes = [
    "/Divineitpngprint",
    "/JerishConstructionprint",
    "/JerishConstructionPoPrint",
    "/JerishConstructionPrintinvoice",
    "/JerishConstructionPoPrintCustom",
    "/Divineitpng-po/:id",
    "/DivineitpngPoOrders/:poNumber",
  ];

  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  // Hide Footer for these pages
  const hideFooterRoutes = [
    "/Divineitpngprint",
    "/JerishConstructionprint",
    "/JerishConstructionPoPrint",
    "/JerishConstructionPrintinvoice",
    "/JerishConstructionPoPrintCustom",
  ];

  const shouldHideFooter = hideFooterRoutes.includes(location.pathname);

  useEffect(() => {
    const sendPing = () => {
      fetch(`${backendUrl}/keep-alive`) // Use dynamic backend URL
        .then((res) => res.json())
       
    };

    sendPing();
    const interval = setInterval(sendPing, PING_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <Routes>
        {/* Public Route - Accessible without login */}
        <Route path="/Divineitpng-po/:id" element={<DivineitpngPo />} />
        <Route path="/DivineitpngPoOrders/:id" element={<DivineitpngPoOrders />} />

        {/* Protected Routes - Require Login */}
        <Route
          path="/*"
          element={
            token === "" ? (
              <Login setToken={setToken} />
            ) : (
              <>
                {!shouldHideNavbar && <Navbar setToken={setToken} />}
                <Admin />
                {!shouldHideFooter && <Footer />}
              </>
            )
          }
        />
      </Routes>
    </div>
  );
};

export default App;
