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

<div><b>Download the Easy Coupon app now! 🎉👇</b></div>
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
