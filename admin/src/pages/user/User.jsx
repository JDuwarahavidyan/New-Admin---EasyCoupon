import './user.css';
import { Stack } from '@mui/material';
import { Avatar } from '@mui/material';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TextField from '@mui/material/TextField';
import PublishIcon from '@mui/icons-material/Publish';
import { Link } from 'react-router-dom';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { useState, useContext, useEffect, useRef } from 'react';
import { UserContext } from '../../context/userContext/UserContext';
import { updateUser } from '../../context/userContext/apiCalls';
import { useLocation, useNavigate } from 'react-router-dom';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject  } from "firebase/storage";
import storage from "../../firebase";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import QRCode from 'react-qr-code';
import { saveAs } from 'file-saver';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import CryptoJS from 'crypto-js';


export default function User() {
  const location = useLocation();
  const navigate = useNavigate();
  const { dispatch } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const initialUser = location.state.users;
  const [user, setUser] = useState(initialUser);
  const [img, setImg] = useState(null);// eslint-disable-next-line 
  const [progress, setProgress] = useState(0); 
  const [formValues, setFormValues] = useState(initialUser);
  const [isFormChanged, setIsFormChanged] = useState(false); 
  const [openDialog, setOpenDialog] = useState(false); // eslint-disable-next-line 
  const [dialogMessage, setDialogMessage] = useState('');
  const [qrValue, setQrValue] = useState(null);


  // useEffect(() => {
  //   console.log('location', location);
  // }, [location]);

  const qrCodeRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormValues((prev) => {
      const newValues = {
        ...prev,
        [name]: name === 'userName' ? value.toLowerCase() : value,
      };
      setIsFormChanged(JSON.stringify(newValues) !== JSON.stringify(initialUser));
      return newValues;
    });
  };

  const uploadImage = async () => {
    if (!img) return user.profilePic; // Return existing profile pic URL if no new image

    const fileName = new Date().getTime() + img.name;
    const storageRef = ref(storage, `/profilePics/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, img);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.error("Upload failed:", error);
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUploading(true);
  
    const oldProfilePicUrl = user.profilePic; // Store the old profile picture URL
  
    try {
      const imgURL = await uploadImage(); // Upload the new image
      const { createdAt, ...updatePayload } = formValues;
      updatePayload.profilePic = imgURL;
  
      await updateUser(formValues.id, updatePayload, dispatch);
      setUser({ ...formValues, profilePic: imgURL }); 
  
      // Delete the old image if a new one was uploaded
      if (img && oldProfilePicUrl) {
        const oldImageRef = ref(storage, oldProfilePicUrl);
        await deleteObject(oldImageRef); // Delete the old image
      }
  
      setLoading(false);
      setUploading(false);
      navigate('/users');
    } catch (error) {
      setLoading(false);
      setUploading(false);
      console.error('Failed to update user:', error);
      setDialogMessage(error.message || 'An unexpected error occurred');
      setOpenDialog(true);
    }
  };
  
  const handleFileChange = (e) => {
    setImg(e.target.files[0]);
    setIsFormChanged(true); 
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogMessage(null);
  };

  useEffect(() => {

    const generateQrValue = () => {
      const encryptionKey = CryptoJS.enc.Utf8.parse('easycouponkey@ruhunaengfac22TDDS'); 
      const iv = CryptoJS.enc.Utf8.parse('easyduwarahan#27'); 


      const encrypted = CryptoJS.AES.encrypt(user.id, encryptionKey, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }).toString();

      setQrValue(encrypted); 
      setLoading(false);
    };

    generateQrValue();
  }, [user]);


  const downloadQrCode = () => {
    const svg = qrCodeRef.current.querySelector('svg');
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
  
    // Create an Image object
    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
  
    img.onload = () => {
      // Create a canvas element
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw the image (from SVG) onto the canvas
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
  
      // Convert the canvas to a PNG blob
      canvas.toBlob((blob) => {
        // Use FileSaver.js to save the blob as a PNG file
        saveAs(blob, `${user.userName}_QRCode.png`);
        // Revoke the object URL to free up memory
        URL.revokeObjectURL(url);
      }, 'image/png');
    };
  
    // Set the image source to the SVG blob URL
    img.src = url;
  };
  

  const printQrCode = () => {
    const svg = qrCodeRef.current.querySelector('svg');
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
  
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(`
      <html>
        <head>
          <title>Print QR Code</title>
          <style>
            body {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
            }
            svg {
              width: 100%;
              height: 100%;
            }
          </style>
        </head>
        <body>${svgString}</body>
      </html>
    `);
  
    printWindow.document.close();
  
    // Add an event listener to wait for the content to load before printing
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      // printWindow.close();
    };
  };
  
  return (
    <div className="user">
      <div className="userTitleContainer">
        <h1 className="userTitle">Edit User</h1>
        <Link to="/newUser">
          <Button className="createButton" variant="contained" color="primary">
            Create
          </Button>
        </Link>
      </div>
      <div className="userContainer">
        <div className="userShow">
          <span className="userCurrentTitle">Current User</span>
          <div className="userShowTop">
            <Stack direction="row" spacing={2}>
              <Avatar src={user.profilePic} alt="" className="userShowImg" />
            </Stack>
            <div className="userShowTopTitle">
              <span className="userShowUsername">{user.userName}</span>
              <span className="userShowUserTitle">{user.role}</span>
            </div>
          </div>
          <div className="userShowBottom">
            <span className="userShowTitle">Account Details</span>
            <div className="userShowInfo">
              <PermIdentityIcon className="userShowIcon" />
              <span className="userShowInfoTitle">ID: {user.id}</span>
            </div>
            <div className="userShowInfo">
              <PermIdentityIcon className="userShowIcon" />
              <span className="userShowInfoTitle">Full Name: {user.fullName}</span>
            </div>
            <span className="userShowTitle">Other Details</span>
            <div className="userShowInfo">
              <MailOutlineIcon className="userShowIcon" />
              <span className="userShowInfoTitle">Email: {user.email}</span>
            </div>
            {user.role === 'student' && (
              <div className="userShowInfo">
                <LocationOnIcon className="userShowIcon" />
                <span className="userShowInfoTitle">
                  Remaining {user.studentCount === 1 ? 'Coupon: ' : 'Coupons: '}
                  {user.studentCount}
                </span>
              </div>
            )}
            {(user.role === 'canteena' || user.role === 'canteenb') && (
              <div className="userShowInfo">
                <LocationOnIcon className="userShowIcon" />
                <span className="userShowInfoTitle">Current Usage: {user.canteenCount}</span>
              </div>
            )}
            {user.role === 'admin' && (
              <div className="userShowInfo">
                <CalendarTodayIcon className="userShowIcon" />
                <span className="userShowInfoTitle">
                  Created At:{' '}
                  {new Date(user.createdAt._seconds * 1000).toLocaleString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric',
                    hour12: true,
                    timeZone: 'Asia/Colombo',
                  })}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="userUpdate">
          <span className="userUpdateTitle">Edit</span>
          <form className="userUpdateForm" onSubmit={handleSubmit}>
            <div className="userUpdateLeft">
              <div className="userUpdateItem">
                <TextField
                  className="userUpdateInput"
                  id="outlined-basic"
                  label="Username"
                  value={formValues.userName}
                  variant="outlined"
                  name="userName"
                  InputLabelProps={{ shrink: true }}
                  onChange={handleChange}
                />
              </div>
              <div className="userUpdateItem">
                <TextField
                  className="userUpdateInput"
                  id="outlined-basic"
                  label="Full Name"
                  variant="outlined"
                  value={formValues.fullName}
                  name="fullName"
                  InputLabelProps={{ shrink: true }}
                  onChange={handleChange}
                />
              </div>
              <div className="userUpdateItem">
                <TextField
                  className="userUpdateInput"
                  id="outlined-basic"
                  type="email"
                  label="Email"
                  variant="outlined"
                  value={formValues.email}
                  name="email"
                  InputLabelProps={{ shrink: true }}
                  onChange={handleChange}
                />
              </div>
              <div className="userUpdateItem">
                <FormControl fullWidth>
                  <InputLabel size="small" className="selectlabel" id="role-select-label">
                    Role
                  </InputLabel>
                  <Select
                    className="newUserSelect"
                    labelId="role-select-label"
                    id="role-select"
                    name="role"
                    label="Role"
                    value={formValues.role}
                    onChange={handleChange}
                  >
                    <MenuItem value="student">Student</MenuItem>
                    <MenuItem value="canteena">Canteen A (Kalderama)</MenuItem>
                    <MenuItem value="canteenb">Canteen B (Kadadora)</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </Select>
                </FormControl>
              </div>
              
            </div>
            <div className="userUpdateRight">
              <div className="userUpdateUpload">
                <Stack direction="row" spacing={2}>
                  <Avatar
                    src={img ? URL.createObjectURL(img) : user.profilePic}
                    alt=""
                    className="userUpdateImg"
                  />
                </Stack>
                <label htmlFor="file">
                  <PublishIcon className="userUpdateIcon" />
                </label>
                <input
                  type="file"
                  id="file"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
              </div>
              <Button
                className="updateButton"
                variant="contained"
                color="primary"
                type="submit"
                disabled={loading || !isFormChanged} // Disable button if loading or no changes detected
              >
                {uploading ? (
                  <>
                    <CircularProgress
                      size={24}
                      style={{ marginRight: '8px', color: 'white' }}
                    />
                    Uploading...
                  </>
                ) : (
                  'Update'
                )}
              </Button>
            </div>
          </form>
          

          <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Error"}</DialogTitle>
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
              <Button onClick={handleCloseDialog} color="primary" autoFocus>
                OK
              </Button>
            </DialogActions>
          </Dialog>

        </div>
      </div>
      <div className="userShow">
      {(user.role === 'canteena' || user.role === 'canteenb') && (
              <div className="userShowInfo">
                {qrValue && (
                <div ref={qrCodeRef} className="qrCodeContainer">
                  <div>
                    <QRCode className='qrCode' value={qrValue} size={250} />
                  </div>
                  <div className="qrCodeActions">
                    <Button onClick={downloadQrCode}>
                      <DownloadIcon />
                      Download
                    </Button>
                    <Button onClick={printQrCode}>
                      <PrintIcon />
                      Print
                    </Button>
                  </div>
                </div>
              )}
              </div>
            )}
      </div>
    </div>
  );
}