import { doc, getDoc } from "firebase/firestore";
import { getFirebaseFunction } from "./firebase/firebase-functions";
import { firestoreInstance } from "./firebase/firestore";

export const createTicket = getFirebaseFunction("createTicket");
export const modifyTicket = getFirebaseFunction("modifyTicket");
export const deleteTickets = getFirebaseFunction("deleteTickets");
export const getTickets = getFirebaseFunction("getTickets");
export const getTicketById = getFirebaseFunction("getTicketById");

export const getTicketSubmitter = async (submitterId) => {
  if (!submitterId) return null;
  const submitterUserDocRef = doc(firestoreInstance, "users", submitterId);
  return {
    id: submitterUserDocRef.id,
    ...(await getDoc(submitterUserDocRef)).data(),
  };
};

export const submitTicketComment = getFirebaseFunction("submitTicketComment");

export const addAttachement = getFirebaseFunction("addAttachement");
export const deleteAttachements = getFirebaseFunction("deleteAttachements");
