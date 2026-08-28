import axiosInstance from "../axiosInstance/axiosInstance";

const verifyToken = async () => {
  try {
    console.log("Verifying token...");

    const email = localStorage.getItem("userEmail");
    const uniqToken = localStorage.getItem("uniqToken");

    if (!email || !uniqToken) {
      console.log("No token found, skipping verification.");
      return { isAuthorized: false, userRole: null };
    }

    const response = await axiosInstance.post("/api/admin/verify-uniq-token", {
      email,
      uniqToken,
    });

    console.log("Response received:", response.data);

    if (response.data.success && (response.data.role === "staff" || response.data.role === "admin")) {
      console.log("isAuthorized set to:", true, "Role:", response.data.role);
      return { isAuthorized: true, userRole: response.data.role };
    } else {
      console.log("Token verification failed or role is not authorized.");
      return { isAuthorized: false, userRole: null };
    }
  } catch (error) {
    console.error("Error verifying token:", error);
    return { isAuthorized: false, userRole: null };
  }
};

export default verifyToken;
