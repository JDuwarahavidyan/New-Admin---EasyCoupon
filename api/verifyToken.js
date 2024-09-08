const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');  // Import the JWT library

const verifyAdmin = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(403).json("Token is missing");
    }

    try {
        // Decode the custom token using the secret (ensure you securely store this)
        const decodedToken = jwt.decode(token);

        if (!decodedToken || !decodedToken.uid) {
            return res.status(403).json("Invalid token");
        }

        // Fetch user data from Firestore using the uid
        const userDoc = await admin.firestore().collection('users').doc(decodedToken.uid).get();

        if (!userDoc.exists || userDoc.data().role !== 'admin') {
            return res.status(403).json("Access denied. Admins only.");
        }

        req.user = { uid: decodedToken.uid, role: userDoc.data().role };
        next();
    } catch (err) {
        console.error("Token verification failed:", err.message);
        res.status(403).json("Invalid token");
    }
};

module.exports = verifyAdmin;
