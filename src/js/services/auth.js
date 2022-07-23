import firebaseApp from "./firebase/firebase.utils";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  connectAuthEmulator,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { firestoreInstance } from "./firebase/firestore";

const authentificationInstance = getAuth(firebaseApp);

// connectAuthEmulator(authentificationInstance, "http://localhost:9099");

async function signInUser({ email, password }) {
  signInWithEmailAndPassword(authentificationInstance, email, password)
    .then((userCredential) => {
      // Signed in
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      console.log(errorMessage);
    });
}
async function signUserOut() {
  await signOut(authentificationInstance)
    .then(() => {
      // Sign-out successful.
      return { message: "success" };
    })
    .catch((error) => {
      // An error happened.
      return { error };
    });
}

async function registerUser({ email, password, name }) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      authentificationInstance,
      email,
      password
    );
    // signed in user
    const user = userCredential.user;

    // update profile
    await updateProfile(user, { displayName: name });

    // update profile in firestore
    const userDocRef = doc(firestoreInstance, "/users/" + user.uid);
    setDoc(userDocRef, { name });
  } catch (error) {
    console.error(error);
    throw error.message;
  }
}
async function loginUserWithGoogle() {
  try {
    const googleProvider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(
      authentificationInstance,
      googleProvider
    );

    // signed in user
    const user = userCredential.user;

    // update profile in firestore
    const userDocRef = doc(firestoreInstance, "/users/" + user.uid);
    const userData = await getDoc(userDocRef);
    if (!userData.exists())
      await setDoc(userDocRef, { name: user.displayName });
    if (userData.name === null)
      await updateDoc(userDocRef, { name: user.displayName });
  } catch (error) {
    console.error(error);
    throw error.message;
  }
}

export {
  onAuthStateChanged,
  authentificationInstance,
  signInUser,
  signUserOut,
  registerUser,
  loginUserWithGoogle,
};
