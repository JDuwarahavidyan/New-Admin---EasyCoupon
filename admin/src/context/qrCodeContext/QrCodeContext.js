import QrCodeReducer from "./QrCodeReducer";
import { createContext, useReducer } from "react";

const INITIAL_STATE = {
  qrcodes: [],
  isFetching: false,
  error: false,
};

export const QrCodeContext = createContext(INITIAL_STATE);

export const QrCodeContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(QrCodeReducer, INITIAL_STATE);

  return (
    <QrCodeContext.Provider
      value={{
        qrcodes: state.qrcodes,
        isFetching: state.isFetching,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </QrCodeContext.Provider>
  );
};