const router = require('express').Router();
const admin = require('firebase-admin');
const User = require('../models/User');
const { sendEmail } = require('../mail');
const crypto = require('crypto');
const axios = require('axios');


const generateRandomPassword = (length = 8) => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from(crypto.randomFillSync(new Uint8Array(length)))
        .map((x) => charset[x % charset.length])
        .join('');
};

// Register a new user
// Register a new user
router.post('/register', async (req, res) => {
    const { email, userName, fullName, role } = req.body;
    const db = req.db;

    try {
        const existingUser = await db.collection('users')
            .where('userName', '==', userName)
            .limit(1)
            .get();

        if (!existingUser.empty) {
            return res.status(400).json({ error: 'Username is already taken' });
        }

        const password = generateRandomPassword();

        const userRecord = await admin.auth().createUser({
            email,
            password,
        });

        const newUser = new User({
            id: userRecord.uid,
            email,
            userName,
            fullName,
            role,
            isFirstTime: true,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            studentCount: 30,
            canteenCount: 0,
            profilePic: "https://www.pngkey.com/png/full/114-1149878_setting-user-avatar-in-specific-size-without-breaking.png"
        });

        await db.collection('users').doc(userRecord.uid).set({
            id: newUser.id,
            email: newUser.email,
            userName: newUser.userName,
            fullName: newUser.fullName,
            isFirstTime: newUser.isFirstTime,
            createdAt: newUser.createdAt,
            updatedAt: newUser.updatedAt,
            role: newUser.role,
            studentCount: newUser.studentCount,
            canteenCount: newUser.canteenCount,
            profilePic: newUser.profilePic,
        });

        // Send a welcome email with username, password, and app download link
        await sendEmail(email, 'Welcome to Easy Coupon', fullName, 
`<div>
<p>We are pleased to inform you that your account has been successfully created. Below are your login credentials:</p>
</div>

<div><b>Username</b>: ${userName}</div>
<div><b>Temporary Password</b>: ${password}</div>

<div>
<ul style="list-style-type: none; padding-left: 0;">
<p>Please note:</p>
<li>- <b>Do not share your login credentials with anyone.</b></li>
<li>- <b>Change your password immediately after logging in</b> to secure your account.</li>
</ul>
</div>

<p>Ready to explore more?</p>
<div style = "margin-top: 10px; margin-bottom:10px; "><b>Download the Easy Coupon app now! 🎉👇</b></div>
<a href="https://drive.google.com/drive/folders/16UuWkCDu-atyW1CkSgx82H8Q8Wns6r1U?usp=sharing" 
style="background-color: #28a745; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">
Download App 📲
</a>

<p>Enjoy your meals with Easy Coupon! 😋</p>`);

        res.status(201).json({
            message: 'User registered successfully and email sent',
            uid: userRecord.uid,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});




router.post('/login', async (req, res) => {
    const { userName, password } = req.body;
    const db = req.db;

    try {
        const userDoc = await db.collection('users')
            .where('userName', '==', userName)
            .limit(1)
            .get();

        if (userDoc.empty) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userData = userDoc.docs[0].data();

        if (userData.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied' });
        }

        const email = userData.email;

        // Use Firebase REST API to sign in with email and password
        const response = await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`, {
            email,
            password,
            returnSecureToken: true
        });

        const userId = response.data.localId;

        // Generate a custom token for the authenticated user
        const customToken = await admin.auth().createCustomToken(userId);

        // Check if the user is logging in for the first time (isFirstTime)
        const isFirstTime = userData.isFirstTime || false; // Default to false if undefined

        res.status(200).json({
            customToken,
            uid: userId,
            isFirstTime, // Include isFirstTime in the response
        });
    } catch (error) {
        res.status(400).json({ error: error.response ? error.response.data.error.message : error.message });
    }
});


// Reset password route
router.post('/reset-password', async (req, res) => {
    const { uid, currentPassword, newPassword } = req.body;
    const db = req.db;

    try {
        // Fetch the user document by userName
        const userDoc = await db.collection('users')
            .where('id', '==', uid)
            .limit(1)
            .get();

        if (userDoc.empty) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userData = userDoc.docs[0].data();
        const email = userData.email;

        // Check if newPassword has at least 6 characters
        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'New password must be at least 6 characters long' });
        }

        // Use Firebase REST API to sign in with the old password to validate it
        const response = await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`, {
            email,
            password: currentPassword,
            returnSecureToken: true
        });

        // Get the userId from the sign-in response
        const userId = response.data.localId;

        // Check if the new password is the same as the old password
        if (currentPassword === newPassword) {
            return res.status(400).json({ error: 'New password cannot be the same as the old password' });
        }

        // Update the user's password using Firebase Admin SDK
        await admin.auth().updateUser(userId, {
            password: newPassword
        });
        await db.collection('users').doc(userId).update({
            isFirstTime: false
        });

        res.status(200).json({
            message: 'Password updated successfully'
        });
    } catch (error) {
        if (error.response) {
            // Handle Firebase API errors
            const errorCode = error.response.data.error.message;

            // Handle invalid password error
            if (errorCode === 'INVALID_LOGIN_CREDENTIALS') {
                return res.status(400).json({ error: 'Invalid Password' });
            }

            res.status(400).json({ error: error.response.data.error.message });
        } else {
            // Handle other errors
            res.status(400).json({ error: error.message });
        }
    }
});



module.exports = router;
