import { getFirebaseFunction } from "./firebase/firebase-functions";

export const createNewRole = getFirebaseFunction("createNewRole");
export const deleteARole = getFirebaseFunction("deleteARole");
export const assignRoleTo = getFirebaseFunction("assignRoleTo");
export const unassignRoleFrom = getFirebaseFunction("unassignRoleFrom");
