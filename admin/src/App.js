import Sidebar from "./components/sidebar/Sidebar";
import Topbar from "./components/topbar/Topbar";
import "./app.css";
import Home from "./pages/home/Home";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import UserList from "./pages/userList/UserList";
import User from "./pages/user/User";
import NewUser from "./pages/newUser/NewUser";
import Login from "./pages/login/Login";
import { useContext } from "react";
import { AuthContext } from "./context/authContext/AuthContext";
import QrCodeList from "./pages/qrcodeList/QrCodeList";
import PwReset from "./pages/pwReset/PwReset";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        {/* Show Login page first */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />

        {/* Redirect to PwReset page if isFirstTime */}
        {user && user.isFirstTime && <Route path="/pwreset" element={<PwReset />} />}
        
        {/* Redirect to Home if user exists and not first time */}
        {user && !user.isFirstTime && (
          <Route
            path="/*"
            element={
              <>
                <Topbar />
                <div className="container">
                  <Sidebar />
                  <Routes>
                    <Route exact path="/" element={<Home />} />
                    <Route path="/users" element={<UserList />} />
                    <Route path="/user/:userID" element={<User />} />
                    <Route path="/newUser" element={<NewUser />} />
                    <Route path="/qrcode" element={<QrCodeList />} />
                  </Routes>
                </div>
              </>
            }
          />
        )}

        {/* Fallback: Navigate to login if no route matches */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
