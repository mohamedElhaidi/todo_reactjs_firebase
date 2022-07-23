import { doc, getDoc } from "firebase/firestore";
import { getFirebaseFunction } from "./firebase/firebase-functions";
import { firestoreInstance } from "./firebase/firestore";

const createTodoAPI = getFirebaseFunction("createTodo");
const modifyTodoAPI = getFirebaseFunction("modifyTodo");
const deleteTodosAPI = getFirebaseFunction("deleteTodos");
const addStatusAPI = getFirebaseFunction("addStatus");
const deleteStatusAPI = getFirebaseFunction("deleteStatus");
const changeStatusPositionAPI = getFirebaseFunction("changeStatusPosition");
const changeTaskPositionAPI = getFirebaseFunction("changeTaskPosition");
const markTaskAsFinishedAPI = getFirebaseFunction("markTaskAsFinished");

export const createTodo = (data) => {
  const data2 = {
    projectId: data.projectId,
    title: data.title,
    assigneesIds: data.assigneesIds,
  };
  return createTodoAPI(data2);
};
export const deleteTodos = (data) => {
  return deleteTodosAPI(data);
};
export const addStatus = (data) => {
  const data2 = {
    projectId: data.projectId,
    todoId: data.todoId,
    statusName: data.statusName,
    bgColor: data.bgColor,
    textColor: data.textColor,
  };
  return addStatusAPI(data2);
};

export const changeStatusPosition = (data) => {
  const data2 = {
    projectId: data.projectId,
    todoId: data.todoId,
    statusId: data.statusId,
    position: data.position,
  };

  return changeStatusPositionAPI(data2);
};

export const deleteStatus = (data) => {
  const data2 = {
    projectId: data.projectId,
    todoId: data.todoId,
    statusId: data.statusId,
  };

  return deleteStatusAPI(data2);
};

export const changeTaskPosition = (data) => {
  return changeTaskPositionAPI(data);
};
export const markTaskAsFinished = async (data) => {
  try {
    const result = markTaskAsFinishedAPI(data);
    return result;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};
