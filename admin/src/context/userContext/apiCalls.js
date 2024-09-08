import axios from "axios";
import { 
  getUsersFailure, 
  getUsersStart, 
  getUsersSuccess,
  createUserFailure,
  createUserStart,
  createUserSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  disableUserFailure,
  disableUserStart,
  disableUserSuccess,
  enableUserFailure,
  enableUserStart,
  enableUserSuccess

} from "./UserAction"


// GET UserS
export const getUsers = async (dispatch) => {
  dispatch(getUsersStart());
  try {
    const res = await axios.get("/users", {
      headers: {
        authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).customToken,
      },
    });
    dispatch(getUsersSuccess(res.data));
  } catch (err) {
    dispatch(getUsersFailure());
  }
};
// CREATE User
export const createUser = async (user, dispatch) => {
  dispatch(createUserStart());
  try {
      const res = await axios.post("/auth/register", user, {
          headers: {
              authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).customToken,
          },
      });
      dispatch(createUserSuccess(res.data));
      return res.data; // return the successful response data
  } catch (err) {
      const errorMsg = err.response?.data?.error || "Something went wrong!";
      dispatch(createUserFailure(errorMsg));
      throw new Error(errorMsg); // re-throw the error with the message
  }
};


// UPDATE User
export const updateUser = async (id, User, dispatch) => {
    dispatch(updateUserStart());
    try {
        const res = await axios.put("/users/" + id, User, {
        headers: {
          authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).customToken,
        },
      });
      dispatch(updateUserSuccess(res.data));
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Something went wrong!";
      dispatch(updateUserFailure(errorMsg));
      throw new Error(errorMsg);
    }
};


// DELETE User
export const deleteUser = async (id, dispatch) => {
    dispatch(deleteUserStart());
    try {
        await axios.delete("/users/" + id, {
        headers: {
          authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).customToken,
        },
      });
      dispatch(deleteUserSuccess(id));
    } catch (err) {
      dispatch(deleteUserFailure());
    }
};

// DISABLE User
export const disableUser = async (id, dispatch) => {
  dispatch(disableUserStart());
  try {
    const res = await axios.put("/users/disable/" + id, null, {
      headers: {
        authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).customToken,
      },
    });
    dispatch(disableUserSuccess(res.data));
  } catch (err) {
    dispatch(disableUserFailure());
  }
};

// ENABLE User
export const enableUser = async (id, dispatch) => {
  dispatch(enableUserStart());
  try {
    const res = await axios.put("/users/enable/" + id, null, {
      headers: {
        authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).customToken,
      },
    });
    dispatch(enableUserSuccess(res.data));
  } catch (err) {
    dispatch(enableUserFailure());
  }
};