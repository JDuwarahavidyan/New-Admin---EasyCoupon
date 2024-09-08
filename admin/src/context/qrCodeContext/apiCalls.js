import axios from "axios";
import { 
  getQrCodesStart,
  getQrCodesSuccess,
  getQrCodesFailure,
  deleteQrCodeStart,
  deleteQrCodeSuccess,
  deleteQrCodeFailure,

} from "./QrCodeAction";


export const getQrcodes = async (dispatch) => {
  dispatch(getQrCodesStart());
  try {
    const res = await axios.get("/qr", {
      headers: {
        authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).customToken,
      },
    });
    dispatch(getQrCodesSuccess(res.data));
  } catch (err) {
    dispatch(getQrCodesFailure());
  }
};

export const deleteQrCode = async (id, dispatch) => {
  dispatch(deleteQrCodeStart());
  try {
      await axios.delete("/qr/" + id, {
      headers: {
        authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).customToken,
      },
    });
    dispatch(deleteQrCodeSuccess(id));
  } catch (err) {
    dispatch(deleteQrCodeFailure());
  }
};