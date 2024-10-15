import axios from "axios";
import { 
  getQrCodesStart,
  getQrCodesSuccess,
  getQrCodesFailure,
  deleteQrCodeStart,
  deleteQrCodeSuccess,
  deleteQrCodeFailure,

} from "./QrCodeAction";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

export const getQrcodes = async (dispatch) => {
  dispatch(getQrCodesStart());
  try {
    const res = await axiosInstance.get("/qr", {
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
      await axiosInstance.delete("/qr/" + id, {
      headers: {
        authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).customToken,
      },
    });
    dispatch(deleteQrCodeSuccess(id));
  } catch (err) {
    dispatch(deleteQrCodeFailure());
  }
};