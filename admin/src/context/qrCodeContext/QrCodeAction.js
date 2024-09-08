export const getQrCodesStart = () => ({
    type: "GET_QRCODES_START",
});

export const getQrCodesSuccess = (qrcodes) => ({
    type: "GET_QRCODES_SUCCESS",
    payload: qrcodes,
});

export const getQrCodesFailure = () => ({
    type: "GET_QRCODES_FAILURE",
});


export const deleteQrCodeStart = () => ({
    type: "DELETE_QRCODE_START",
});

export const deleteQrCodeSuccess = (id) => ({
    type: "DELETE_QRCODE_SUCCESS",
    payload: id,
});

export const deleteQrCodeFailure = () => ({
    type: "DELETE_QRCODE_FAILURE",
});

 