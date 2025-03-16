const SERVER_BASE_URL = "https://ecommerce-app-backend-indol.vercel.app/api/";

// const SERVER_BASE_URL = "http://localhost:3000/api/";
const signUp = async (data) => {
    try {
      return await fetch(`${SERVER_BASE_URL}auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error("Error during registration:", error);
      throw error;
    }
  };
  
  const Login = async (data) => {
    try {
      return await fetch(`${SERVER_BASE_URL}auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  };
  
  const sendOtp = async (data) => {
    try {
      return await fetch(`${SERVER_BASE_URL}auth/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error("Error during sending otp:", error);
      throw error;
    }
  };
  
  const verifyOtp = async (data) => {
    try {
      return await fetch(`${SERVER_BASE_URL}auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error("Error during verifying otp:", error);
      throw error;
    }
  };
  
  const resetPassword = async (data) => {
    try {
      return await fetch(`${SERVER_BASE_URL}auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error("Error during verifying otp:", error);
      throw error;
    }
  };
  

  export default {
    signUp,
    Login,
    sendOtp,
    verifyOtp,
    resetPassword,
  }   