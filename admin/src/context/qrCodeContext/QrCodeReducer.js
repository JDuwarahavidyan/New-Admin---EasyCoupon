const QrcodeReducer = (state, action) => {
    switch (action.type) {
      case "GET_QRCODES_START":
      return {
        qrcodes: [],
        isFetching: true,
        error: false,
      };

      case "GET_QRCODES_SUCCESS":
      return {
        qrcodes: action.payload,
        isFetching: false,
        error: false,
      };

      case "GET_QRCODES_FAILURE":
      return {
        qrcodes: [],
        isFetching: false,
        error: true,
      };
        

      case "DELETE_QRCODE_START":
      return {
        ...state, // keep the current state without deleting it
        isFetching: true,
        error: false,
      };
    
      case "DELETE_QRCODE_SUCCESS":
      return {
        ...state,
        qrcodes: state.qrcodes.filter((qrcode) => qrcode._id !== action.payload), // filter out the qrcode with the id that was deleted
        isFetching: false,
        error: false,
      };
      
      case "DELETE_QRCODE_FAILURE":
      return {
        ...state, 
        isFetching: false,
        error: true,
      };

      default:
        return { ...state };
    }
};

export default QrcodeReducer;