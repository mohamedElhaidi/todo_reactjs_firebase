import firebaseApp from "./firebase.utils";
import {
  getFunctions,
  httpsCallable,
  connectFunctionsEmulator,
} from "firebase/functions";

// const firebaseFunctions =  getFunctions(firebaseApp);
const firebaseFunctions = getFunctions(firebaseApp);
// connectFunctionsEmulator(firebaseFunctions, "localhost", 5001);
export const getFirebaseFunction = (funcName) =>
  httpsCallable(firebaseFunctions, funcName);
