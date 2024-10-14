const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        user: null,
        isFetching: true,
        error: false,
      };
    case "LOGIN_SUCCESS":
      return {
        user: action.payload,
        isFetching: false,
        error: false,
      };
    case "LOGIN_FAILURE":
      return {
        user: null,
        isFetching: false,
        error: true,
      };
    case "LOGOUT":
      return {
        user: null,
        isFetching: false,
        error: false,
      };

    case "RESET_PASSWORD_START":
      return {
        ...state,
        isFetching: true,
        error: false,
      };
    case "RESET_PASSWORD_SUCCESS":
      return {
        ...state,
        isFetching: false,
        error: false,
      };
    case "RESET_PASSWORD_FAILURE":
      return {
        ...state,
        isFetching: false,
        error: action.payload,
      };
      
    default:
      return state; 
  }

  
};

export default AuthReducer;
