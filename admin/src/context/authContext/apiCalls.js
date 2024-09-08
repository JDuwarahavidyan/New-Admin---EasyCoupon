import axios from "axios";
import { loginFailure, loginStart, loginSuccess } from "./AuthActions";

export const login = async (user, dispatch) => {
  dispatch(loginStart());
  try {
    const res = await axios.post("/auth/login", user); // Send username and password
    if (res.data.customToken) {
      dispatch(loginSuccess(res.data)); // Store the customToken and user data
      return null; // No error
    } else {
      dispatch(loginFailure("Not an admin")); // Specific failure message
      return "Not an admin";
    }
  } catch (err) {
    dispatch(loginFailure("Invalid username or password")); // Failure with message
    return "Invalid username or password"; // Return error message
  }
};
