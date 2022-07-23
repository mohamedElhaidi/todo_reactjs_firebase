// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyBM6nlY_86hiMfhQyhRzgHvL_rfrl94IfI",
//   authDomain: "todo-reactjs-project.firebaseapp.com",
//   projectId: "todo-reactjs-project",
//   storageBucket: "todo-reactjs-project.appspot.com",
//   messagingSenderId: "529307150844",
//   appId: "1:529307150844:web:3f2554a66ccb5c7e092a79",
// };
const firebaseConfig = {
  apiKey: "AIzaSyAgt0K4JmlbtPiyr5RJ_9kVEk4e-yy2Nds",
  authDomain: "bug-tracker-reactjs.firebaseapp.com",
  projectId: "bug-tracker-reactjs",
  storageBucket: "bug-tracker-reactjs.appspot.com",
  messagingSenderId: "83112099906",
  appId: "1:83112099906:web:35fef6ff0582004b706ddb",
  measurementId: "G-2PJZRM1V5G",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
export default firebaseApp;
