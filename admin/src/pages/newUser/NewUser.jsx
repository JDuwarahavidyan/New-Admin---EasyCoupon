import React, { useState, useContext } from "react";
import "./newUser.css";
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { createUser } from "../../context/userContext/apiCalls"; 
import { UserContext } from "../../context/userContext/UserContext"; 
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx'; 
import DownloadIcon from '@mui/icons-material/Download'; 

export default function NewUser() {
  const [user, setUser] = useState({
    userName: "",
    fullName: "",
    email: "",
    role: "student",
  });
  const [loadingSingle, setLoadingSingle] = useState(false); // Loading state for single user creation
  const [loadingBulk, setLoadingBulk] = useState(false); // Loading state for bulk user creation
  const [open, setOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [bulkUsers, setBulkUsers] = useState([]); // State to store bulk users data
  const [isSuccessful, setIsSuccessful] = useState(false);

  const navigate = useNavigate();
  const { dispatch } = useContext(UserContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if any of the fields are empty
    if (!user.userName || !user.fullName || !user.email || !user.role) {
        setDialogMessage("All fields are required.");
        setIsSuccessful(false);
        setOpen(true);
        return;
    }

    setLoadingSingle(true);
    try {
        await createUser(user, dispatch);
        setDialogMessage("User registered successfully!");
        setIsSuccessful(true);  // Set success flag to true
    } catch (err) {
        setDialogMessage(err.message || "Failed to register user. Please try again.");
        setIsSuccessful(false); // Ensure success flag is false on error
    } finally {
        setOpen(true);
        setLoadingSingle(false);
    }
};

  const handleClose = () => {
    setOpen(false);
    if (isSuccessful) {
        navigate('/users');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const binaryStr = event.target.result;
        const workbook = XLSX.read(binaryStr, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        // Store the parsed sheet data into state
        setBulkUsers(sheet);
      };
      reader.readAsBinaryString(file);
    }
  };

  const handleBulkCreate = async () => {
    setLoadingBulk(true);
    let errorMessages = [];

    for (const row of bulkUsers) {
        // Combine faculty, batch, and indexno to create the userName
        const userName = `${row['Faculty']}${row['Batch']}${row['RegNo']}`.toLowerCase();

        const newUser = {
            userName, // Use the combined and lowercased userName
            fullName: row['Full Name'],
            email: row['Email'],
            role: row['Role'],
        };

        try {
            await createUser(newUser, dispatch);
        } catch (err) {
            const errorMessage = err.message
                ? `User ${newUser.userName}: ${err.message}`
                : `Failed to create user: ${newUser.userName}.`;
            errorMessages.push(errorMessage);
        }
    }

    setLoadingBulk(false);
    setDialogMessage(
        errorMessages.length > 0
            ? errorMessages // Store as an array of messages
            : ["Bulk user creation process completed successfully!"]
    );
    setOpen(true);
};


  return (
    <div className="newUser">
      <h1 className="newUserTitle">New User</h1>
      <form className="newUserForm" onSubmit={handleSubmit}>
        {/* User Creation Form Fields */}
        <div className="newUserItem">
          <TextField
            className="newUserItem"
            id="outlined-basic"
            size="small"
            label="Username"
            name="userName"
            variant="outlined"
            value={user.userName}
            onChange={handleChange}
          />
        </div>
        <div className="newUserItem">
          <TextField
            className="newUserItem"
            id="outlined-basic"
            size="small"
            label="Full Name"
            name="fullName"
            variant="outlined"
            value={user.fullName}
            onChange={handleChange}
          />
        </div>
        <div className="newUserItem">
          <TextField
            className="newUserItem"
            id="outlined-basic"
            size="small"
            type="email"
            label="Email"
            name="email"
            variant="outlined"
            value={user.email}
            onChange={handleChange}
          />
        </div>
        <div className="newUserItem">
          <FormControl fullWidth>
            <InputLabel size="small" className="selectlabel" id="role-select-label">Role</InputLabel>
            <Select
              className="newUserSelect"
              labelId="role-select-label"
              id="role-select"
              name="role"
              value={user.role}
              label="Role"
              onChange={handleChange}
            >
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="canteena">Canteen A (Kalderama)</MenuItem>
              <MenuItem value="canteenb">Canteen B (Hilton)</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
        </div>
      
        <div className="newUserActions">
          <Button
            variant="contained"
            className="newUserButton"
            color="primary"
            type="submit"
            disabled={loadingSingle || loadingBulk}
            startIcon={loadingSingle && <CircularProgress size={24} />}
          >
            {loadingSingle ? "Creating..." : "Create"}
          </Button>

          <div className="fileUpload">
            <div className="fileLable">
              <label>Bulk Creation (.xlsx or .xls only)</label>
              <input
                className="uploadExcel"
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
              />
            </div>
            
            <Button 
              variant="contained"
              color="primary"
              onClick={handleBulkCreate} 
              disabled={loadingBulk || bulkUsers.length === 0}
              startIcon={loadingBulk && <CircularProgress size={24} />}
            >
              {loadingBulk ? "Creating..." : "Bulk Create Users"}
            </Button>
          </div>

          {/* Download Sample Document Section */}
          <div className="downloadSample">
            <Button
              variant="outlined"
              color="primary"
              startIcon={<DownloadIcon />}
              href="/Bulk User Creation Format.xlsx" // Link to the sample document
              download
            >
              Download Sample Document
            </Button>
          </div>
        </div>
      </form>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"User Registration"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {Array.isArray(dialogMessage) 
              ? dialogMessage.map((msg, index) => (
                <div key={index}>{msg}</div> // Render each message in a separate div
              ))
              : dialogMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
