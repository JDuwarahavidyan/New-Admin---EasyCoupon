import "./PwReset.scss";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import { useState, useContext } from "react";
import { AuthContext } from "../../context/authContext/AuthContext";
import { resetPassword } from "../../context/authContext/apiCalls";
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

export default function PwReset() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const { isFetching, dispatch } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [success, setSuccess] = useState(false);

    // Extract uid from query params
    const queryParams = new URLSearchParams(location.search);
    const uid = queryParams.get("uid");


    const handlePasswordReset = async (e) => {
        e.preventDefault();
        setError("");


        if (!currentPassword || !newPassword || !confirmPassword) {
            setError("All fields are required");
            return;
        }


        if (newPassword !== confirmPassword) {
            setError("New password and confirm password do not match");
            return;
        }


        if (newPassword === currentPassword) {
            setError("New password must be different from the current password");
            return;
        }

        const updateResponse = await resetPassword({ uid, currentPassword, newPassword }, dispatch);

        if (updateResponse && updateResponse.success) {
            setSuccess(true); 
        } else {
            setError(updateResponse.error || "Failed to update password");
        }
    };

    useEffect(() => {
        if (success) {
            navigate('/login', { replace: true }); 
            window.location.reload(); 
        }
    }, [success, navigate]);
    

    return (
        <div className="login">
            <div className="top">
                <div className="wrapper">
                    <span className="logo">Easy Coupon</span>
                </div>
            </div>

            <div className="container">
                <form>
                    <h1>Reset Your Pasword</h1>
                    <TextField 
                        className="inputText" 
                        label="Current Password" 
                        type="password" 
                        variant="filled" 
                        size="small"
                        InputProps={{ disableUnderline: true }}
                        onChange={(e) => { setCurrentPassword(e.target.value); setError(''); }}
                    />
                    <TextField 
                        className="inputText" 
                        label="New Password" 
                        type="password" 
                        variant="filled"
                        size="small" 
                        InputProps={{ disableUnderline: true }}
                        onChange={(e) => { setNewPassword(e.target.value); setError(''); }}
                    />
                     <TextField 
                        className="inputText" 
                        label="Confirm Password" 
                        type="password" 
                        variant="filled"
                        size="small" 
                        InputProps={{ disableUnderline: true }}
                        onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                    />
                    {error && <p className="errorMessage">{error}</p>}
                    <Button 
                        className="loginButton"  
                        variant="contained"
                        onClick={handlePasswordReset}
                        disabled={isFetching}
                    >
                        {isFetching ? <CircularProgress size={24} /> : "RESET PASSWORD"}
                    </Button>
                </form>
            </div>
        </div>
    )
}
