import { doc, getDoc } from "firebase/firestore";
import { getFirebaseFunction } from "../firebase/firebase-functions";
import { firestoreInstance } from "../firebase/firestore";

const createTaskAPI = getFirebaseFunction("createTask");
const editTaskAPI = getFirebaseFunction("editTask");
const deleteTasksAPI = getFirebaseFunction("deleteTasks");
const changeTaskStatusAPI = getFirebaseFunction("changeTaskStatus");

export const createTask = async (data) => {
  try {
    const result = await createTaskAPI(data);
    return result;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};
export const editTask = async (data) => {
  try {
    const result = await editTaskAPI(data);
    return result;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

export const changeTaskStatus = async (data) => {
  const data2 = {
    projectId: data.projectId,
    todoId: data.todoId,
    taskId: data.taskId,
    statusId: data.statusId,
  };
  try {
    const result = await changeTaskStatusAPI(data2);
    return result;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

export const deleteTasks = async (data) => {
  const data2 = {
    projectId: data.projectId,
    todoId: data.todoId,
    tasksIds: data.tasksIds,
  };
  try {
    const result = await deleteTasksAPI(data2);
    return result;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};
