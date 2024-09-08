import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './index.css';
import './app.css';
import reportWebVitals from './reportWebVitals';
import { AuthContextProvider } from './context/authContext/AuthContext';
import { QrCodeContextProvider } from './context/qrCodeContext/QrCodeContext';
import { ListContextProvider } from './context/listContext/ListContext';
import { UserContextProvider } from './context/userContext/UserContext';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <QrCodeContextProvider>
        <ListContextProvider>
          <UserContextProvider>
            <App />
          </UserContextProvider>
        </ListContextProvider>
      </QrCodeContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
