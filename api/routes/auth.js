const router = require('express').Router();
const admin = require('firebase-admin');
const User = require('../models/User');
const { sendEmail } = require('../mail');
const crypto = require('crypto');



const generateRandomPassword = (length = 8) => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from(crypto.randomFillSync(new Uint8Array(length)))
        .map((x) => charset[x % charset.length])
        .join('');
};

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

        // Send a welcome email with username and password
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
<p>Enjoy your meals with Easy Coupon😋.</p>`);
            
            

        res.status(201).json({
            message: 'User registered successfully and email sent',
            uid: userRecord.uid,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});



// Login route
const axios = require('axios');

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

        res.status(200).json({
            customToken,
            uid: userId,
        });
    } catch (error) {
        res.status(400).json({ error: error.response ? error.response.data.error.message : error.message });
    }
});



module.exports = router;
