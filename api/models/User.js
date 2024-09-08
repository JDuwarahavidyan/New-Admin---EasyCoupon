const admin = require('firebase-admin');

class User {
  constructor({
    id,
    email,
    userName,
    fullName,
    isFirstTime = true,
    createdAt = admin.firestore.FieldValue.serverTimestamp(),
    updatedAt = admin.firestore.FieldValue.serverTimestamp(),
    role,
    studentCount = 30,
    canteenCount = 0,
    profilePic = null
    
  }) {
      this.id = id;
      this.email = email;
      this.userName = userName;
      this.fullName = fullName;
      this.isFirstTime = isFirstTime;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
      this.role = role;
      this.studentCount = studentCount;
      this.canteenCount = canteenCount;
      this.profilePic = profilePic;
  }
}

module.exports = User;
