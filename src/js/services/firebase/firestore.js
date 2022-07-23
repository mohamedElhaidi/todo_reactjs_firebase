import firebaseApp from "./firebase.utils";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
export const firestoreInstance = getFirestore(firebaseApp);

// connectFirestoreEmulator(firestoreInstance, "localhost", 8080);
