/* eslint-disable no-undef */

const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();

// Reset canteenCount every day at midnight (Sri Lanka time)
exports.resetCanteenCountDaily = functions.pubsub.schedule(
  "every day 00:00").timeZone('Asia/Colombo').onRun(async () => {
const usersSnapshot = await db.collection("users").get();
usersSnapshot.forEach(async (doc) => {
  await doc.ref.update({
    canteenCount: 0,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
});
console.log("canteenCount reset to 0 for all users");
});


// Reset studentCount on the first day of every month at midnight (Sri Lanka time)
exports.resetStudentCountMonthly = functions.pubsub.schedule(
  "0 0 1 * *"
).timeZone("Asia/Colombo").onRun(async () => {
  const usersSnapshot = await db.collection("users").get();
  usersSnapshot.forEach(async (doc) => {
    await doc.ref.update({
      studentCount: 30,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  });
  console.log("studentCount reset to 30 for all users");
});
