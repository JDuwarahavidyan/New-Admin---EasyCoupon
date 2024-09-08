const router = require('express').Router();
const QRModel = require('../models/QR');
const verifyAdmin = require("../verifyToken");
const admin = require('firebase-admin');

router.get("/", verifyAdmin, async (req, res) => {
    try {
        const query = req.query.new;
        let qrcodeRef = admin.firestore().collection('qrcodes').orderBy('scannedAt', 'desc');
        
        // Limit to 7 qrcodes if the "new" query parameter is present
        if (query) {
            qrcodeRef = qrcodeRef.limit(7);
        }
  
        const snapshot = await qrcodeRef.get();
        const qrcodes = snapshot.docs.map(doc => doc.data());
        res.status(200).json(qrcodes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.get("/find/:id", verifyAdmin, async (req, res) => {
    try {
        const qrcodeDoc = await admin.firestore().collection('qrcodes').doc(req.params.id).get();
        if (!qrcodeDoc.exists) {
            return res.status(404).json("The Requested data is not found");
        }
        const qrcode = qrcodeDoc.data();
        res.status(200).json(qrcode);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/stats", verifyAdmin, async (req, res) => {
    try {
      const lastYear = new Date(); // Get current date
      lastYear.setFullYear(lastYear.getFullYear() - 1); // Subtract one year
      const lastYearISO = lastYear.toISOString(); // Convert to ISO 8601 format
    
      const query = admin.firestore().collection('qrcodes')
        .where('scannedAt', '>=', lastYearISO);
    
      const snapshot = await query.get();
    
      const monthlyStats = {};
    
      snapshot.forEach(doc => {
        const scannedAt = new Date(doc.data().scannedAt); // Parse ISO string to JS Date
        const month = scannedAt.getMonth() + 1; // Get month (1-12)
        monthlyStats[month] = (monthlyStats[month] || 0) + 1;
      });
    
      const stats = Object.keys(monthlyStats).map(month => ({
        month: parseInt(month, 10),
        total: monthlyStats[month],
      }));
    
      res.status(200).json(stats);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

router.get('/count', verifyAdmin, async (req, res) => {
    try {
        const { role } = req.query; // Get the role from the query parameter
        if (!role || (role !== 'canteena' && role !== 'canteenb')) {
            return res.status(400).json({ error: "Invalid or missing role. Please specify 'canteena' or 'canteenb'." });
        }

        const lastYear = new Date(); // Get current date
        lastYear.setFullYear(lastYear.getFullYear() - 1); // Subtract one year
        const lastYearISO = lastYear.toISOString(); // Convert to ISO 8601 format

        // Query Firestore for documents matching the role and scanned within the last year
        const querySnapshot = await admin.firestore().collection('qrcodes')
            .where('canteenType', '==', role)
            .where('scannedAt', '>=', lastYearISO)
            .get();

        const monthlySums = {};

        querySnapshot.forEach(doc => {
            const data = doc.data();
            const scannedAt = new Date(data.scannedAt); // Parse ISO string to JS Date
            const month = scannedAt.getMonth() + 1; // Get month (1-12)

            // Sum the counts by month
            if (!monthlySums[month]) {
                monthlySums[month] = 0;
            }
            monthlySums[month] += data.count;
        });

        // Convert monthlySums object into an array of { month, total }
        const result = Object.keys(monthlySums).map(month => ({
            month: parseInt(month, 10),
            total: monthlySums[month],
        }));

        res.status(200).json(result);
    } catch (err) {
        console.error("Error fetching document:", err); // Log any errors
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;




module.exports = router;