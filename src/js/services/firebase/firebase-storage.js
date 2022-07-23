import firebaseApp from "./firebase.utils";
import { connectStorageEmulator, getStorage } from "firebase/storage";

// Initialize Cloud Storage and get a reference to the service
export const firebaseStorage = getStorage(firebaseApp);
// connectStorageEmulator(firebaseStorage, "localhost", 9199);
