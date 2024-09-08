import "./login.scss";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import { useState, useContext } from "react";
import { AuthContext } from "../../context/authContext/AuthContext";
import { login } from "../../context/authContext/apiCalls";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { isFetching, dispatch } = useContext(AuthContext);

    const handleLogin = async (e) => {
        e.preventDefault();

        // Basic validation for empty fields
        if (!username || !password) {
            setError("All fields are required");
            return;
        }

        // Attempt login and set error message if login fails
        const errorMsg = await login({ userName: username, password }, dispatch);
        if (errorMsg) {
            setError(errorMsg);
        }
    };

    return (
        <div className="login">
            <div className="top">
                <div className="wrapper">
                    <span className="logo">Easy Coupon</span>
                </div>
            </div>

            <div className="container">
                <form>
                    <h1>Welcome to Easy Coupon</h1>
                    <TextField 
                        className="inputText" 
                        label="Username" 
                        type="text" 
                        variant="filled" 
                        size="small"
                        InputProps={{ disableUnderline: true }}
                        onChange={(e) => { setUsername(e.target.value); setError(''); }}
                    />
                    <TextField 
                        className="inputText" 
                        label="Password" 
                        type="password" 
                        variant="filled"
                        size="small" 
                        InputProps={{ disableUnderline: true }}
                        onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    />
                    {error && <p className="errorMessage">{error}</p>}
                    <Button 
                        className="loginButton"  
                        variant="contained"
                        onClick={handleLogin}
                        disabled={isFetching}
                    >
                        {isFetching ? <CircularProgress size={24} /> : "Login"}
                    </Button>
                </form>
            </div>
        </div>
    )
}
