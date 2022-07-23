import { doc, getDoc } from "firebase/firestore";
import { getFirebaseFunction } from "./firebase/firebase-functions";
import { firestoreInstance } from "./firebase/firestore";

export const changePassword = getFirebaseFunction("changePassword");
export const changeUserInfo = getFirebaseFunction("changeUserInfo");

export const getUserByRef = async (userDocRef) => {
  if (!userDocRef) return null;
  return (await getDoc(userDocRef)).data();
};
export const getUserById = async (userId) => {
  if (!userId) return null;
  const submitterUserDocRef = doc(firestoreInstance, "users", userId);
  return (await getDoc(submitterUserDocRef)).data();
};
export const getUsers = async (userIdArray) => {
  if (!userIdArray || !userIdArray.length) return null;
  const submittersDocRefsArray = userIdArray.map((userId) =>
    doc(firestoreInstance, "users", userId)
  );
  const users = await Promise.all(
    submittersDocRefsArray.map(async (doc) => {
      const data = (await getDoc(doc)).data();
      const user = { id: doc.id, ...data };
      return user;
    })
  );
  return users;
};
