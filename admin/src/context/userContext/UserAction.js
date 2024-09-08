export const getUsersStart = () => ({
    type: "GET_USERS_START",
});

export const getUsersSuccess = (users) => ({
    type: "GET_USERS_SUCCESS",
    payload: users,
});

export const getUsersFailure = () => ({
    type: "GET_USERS_FAILURE",
});

export const createUserStart = () => ({
    type: "CREATE_USER_START",
});

export const createUserSuccess = (user) => ({
    type: "CREATE_USER_SUCCESS",
    payload: user,
});

export const createUserFailure = () => ({
    type: "CREATE_USER_FAILURE",
});

export const updateUserStart = () => ({
    type: "UPDATE_USER_START",
});
  
export const updateUserSuccess = (user) => ({
    type: "UPDATE_USER_SUCCESS",
    payload: user,
});
  
export const updateUserFailure = () => ({
    type: "UPDATE_USER_FAILURE",
});

export const deleteUserStart = () => ({
    type: "DELETE_USERS_START",
});

export const deleteUserSuccess = (id) => ({
    type: "DELETE_USERS_SUCCESS",
    payload: id,
});

export const deleteUserFailure = () => ({
    type: "DELETE_USERS_FAILURE",
});


export const disableUserStart = () => ({
    type: "DISABLE_USER_START",
});


export const disableUserSuccess = (message) => ({
    type: "DISABLE_USER_SUCCESS",
    payload: message,
});

export const disableUserFailure = () => ({
    type: "DISABLE_USER_FAILURE",
});


export const enableUserStart = () => ({
    type: "ENABLE_USER_START",
});


export const enableUserSuccess = (message) => ({
    type: "ENABLE_USER_SUCCESS",
    payload: message,
});

export const enableUserFailure = () => ({
    type: "ENABLE_USER_FAILURE",
});