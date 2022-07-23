import { getFirebaseFunction } from "./firebase/firebase-functions";

export const getUsersPublic = getFirebaseFunction("getUsersPublic");
export const editUser = getFirebaseFunction("editUser");
