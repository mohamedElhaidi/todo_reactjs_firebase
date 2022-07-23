import { getFirebaseFunction } from "./firebase/firebase-functions";

export const createProject = getFirebaseFunction("createProject");
export const deleteProjects = getFirebaseFunction("deleteProjects");
export const getProjects = getFirebaseFunction("getProjects");
export const getProjectById = getFirebaseFunction("getProjectById");
