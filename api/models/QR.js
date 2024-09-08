const admin = require('firebase-admin');

class QRModel {
  constructor({
    id,
    studentId,
    canteenId,
    canteenType,
    studentName,
    canteenName,
    scannedAt = new Date().toISOString(), // Default to current time in ISO 8601 format
    count = 0,
  }) {
    this.id = id;
    this.studentId = studentId;
    this.canteenId = canteenId;
    this.canteenType = canteenType;
    this.studentName = studentName;
    this.canteenName = canteenName;
    this.scannedAt = scannedAt instanceof Date ? scannedAt.toISOString() : scannedAt;
    this.count = count;
  }
}

module.exports = QRModel;
