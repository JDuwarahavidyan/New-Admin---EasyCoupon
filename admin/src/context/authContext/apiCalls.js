import axios from "axios";
import { 
  loginFailure, 
  loginStart,
  loginSuccess,
  resetPasswordFailure,
  resetPasswordStart,
  resetPasswordSuccess,
   } from "./AuthActions";

   const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
  }); // Create an axios instance
  


export const login = async (user, dispatch) => {
  dispatch(loginStart());
  try {

    const res = await axiosInstance.post("/auth/login", user); // Send username and password

    if (res.data.customToken) {
      const userData = res.data; // Get the user data returned from the backend

      // Dispatch login success if all checks pass
      dispatch(loginSuccess(userData));

      // Check if the user is logging in for the first time
      if (userData.isFirstTime) {
        return { redirectToPwRest: true, uid: userData.uid }; // Signal to navigate to Pwrest page
      }
      return null; // No error, regular login
    } else {
      dispatch(loginFailure("Error in Logging! Please try again later!")); // Specific failure message
      return "Error in Logging! Please try again later!";
    }
  } catch (err) {
    dispatch(loginFailure("Invalid username or password")); // Failure with message
    return "Invalid username or password"; // Return error message
  }
};

export const resetPassword = async ({ uid, currentPassword, newPassword }, dispatch)=> {
  dispatch(resetPasswordStart());
  try {

    
    const res = await axiosInstance.post("/auth/reset-password", { uid, currentPassword, newPassword });
    
    if (res.status >= 200 && res.status < 300) {
      dispatch(resetPasswordSuccess());
      return { success: true }; // Password reset successful
    }
  } catch (err) {
    const errorMessage = err.response?.data?.error || "Error resetting password";
    dispatch(resetPasswordFailure(errorMessage));
    return { success: false, error: errorMessage }; // Return error
  }
};
