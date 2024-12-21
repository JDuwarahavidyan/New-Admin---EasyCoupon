import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDIgRNkXVzxQ21bRV-QDtykA_uzJ8mXBho",
  authDomain: "easy-coupon-bfc60.firebaseapp.com",
  projectId: "easy-coupon-bfc60",
  storageBucket: "easy-coupon-bfc60.appspot.com",
  messagingSenderId: "812573739976",
  appId: "1:812573739976:web:0289f056c1138f9a83cefd",
  measurementId: "G-RNXL1MQGL0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export default storage;
