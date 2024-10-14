export const loginStart = () => ({
    type: "LOGIN_START",
});

export const loginSuccess = (user) => ({
    type: "LOGIN_SUCCESS",
    payload: user,
});

export const loginFailure = () => ({
    type: "LOGIN_FAILURE",
});
  

//logout
  
export const logout = () => ({
    type: "LOGOUT",
});

// Start password reset
export const resetPasswordStart = () => ({
    type: "RESET_PASSWORD_START",
  });
  
  // On password reset success
  export const resetPasswordSuccess = () => ({
    type: "RESET_PASSWORD_SUCCESS",
  });
  
  // On password reset failure
  export const resetPasswordFailure = (error) => ({
    type: "RESET_PASSWORD_FAILURE",
    payload: error,
  });
  