// import { Box, Button, Card, TextField } from "@mui/material";
// import { collection, doc, onSnapshot } from "firebase/firestore";
// import * as React from "react";
// import { firestoreInstance } from "../../js/services/firebase/firestore";
// import {
//   changeTaskStatus,
//   createTask,
//   deleteTasks,
// } from "../../js/services/tasks/tasks";
// import {
//   addStatusAPI,
//   changeStatusPositionAPI,
//   changeTaskPositionAPI,
//   createTodoAPI,
//   deleteStatusAPI,
//   deleteTodosAPI,
// } from "../../js/services/todo";

// // projectId asrGwmcbywxBXGloH4zF
// // user0 DdYkDmwDqtRvP4ItRqfVVer4s8mD
// // user1 yW3u28nTntNZyyMNEJhoaN8xYllF

// export default function TodoTestPage() {
//   //form
//   const [title, setTitle] = React.useState("");
//   const [projectId, setProjectId] = React.useState("asrGwmcbywxBXGloH4zF");
//   const [assigneeId0, setAssigneeId0] = React.useState(
//     "DdYkDmwDqtRvP4ItRqfVVer4s8mD"
//   );
//   const [assigneeId1, setAssigneeId1] = React.useState(
//     "yW3u28nTntNZyyMNEJhoaN8xYllF"
//   );

//   const [tasktitle, setTasktitle] = React.useState("");
//   const [taskDescription, setTaskDescription] = React.useState("");
//   const [taskSeverity, setTaskSeverity] = React.useState(0);
//   const [taskAssignee, setTaskAssignee] = React.useState("");

//   //data
//   const [todos, setTodos] = React.useState([]);

//   const handleAddingTodo = () => {
//     const assigneesIds = [];
//     if (assigneeId0) assigneesIds[0] = assigneeId0;
//     if (assigneeId1) assigneesIds[1] = assigneeId1;
//     const todo = {
//       title,
//       projectId,
//       assigneesIds,
//     };

//     createTodoAPI(todo)
//       .then((r) => console.log(r))
//       .catch(({ msg }) => console.log(msg));
//   };

//   const handleDeletingTodo = (id) => {
//     const data = {
//       todosIds: [id],
//       projectId,
//     };
//     deleteTodosAPI(data)
//       .then((r) => console.log(r))
//       .catch((msg) => console.log(msg));
//   };

//   const handleAddingTaskToTodo = (todoId) => {
//     const data = {
//       title: String(tasktitle),
//       description: String(taskDescription),
//       severity: Number(taskSeverity),
//       assigneeId: String(taskAssignee),
//       todoId: String(todoId),
//       projectId: String(projectId),
//     };
//     createTask(data)
//       .then((r) => console.log(r))
//       .catch((msg) => console.log(msg));
//   };

//   React.useEffect(() => {
//     if (!projectId) return;
//     const todosColRef = collection(
//       firestoreInstance,
//       "/projects/" + projectId + "/todos"
//     );

//     if (!todosColRef) return;
//     const unsub = onSnapshot(todosColRef, (snap) => {
//       snap.docChanges().forEach(async (docChange) => {
//         switch (docChange.type) {
//           case "added":
//             {
//               setTodos((p) => [
//                 ...p,
//                 { id: docChange.doc.id, ...docChange.doc.data() },
//               ]);
//             }
//             break;
//           case "removed":
//             {
//               setTodos((p) => p.filter((td) => td.id !== docChange.doc.id));
//             }
//             break;
//           case "modified":
//             {
//               setTodos((p) =>
//                 p.map((td) =>
//                   td.id === docChange.doc.id
//                     ? { id: docChange.doc.id, ...docChange.doc.data() }
//                     : td
//                 )
//               );
//             }
//             break;
//         }
//       });
//     });

//     return () => {
//       unsub();
//     };
//   }, []);
//   return (
//     <Box display="flex" flexDirection="column" p={3} gap={2} width="100vw">
//       {/* for adding a new todo */}
//       <div>
//         <TextField
//           onChange={(e) => setProjectId(e.currentTarget.value)}
//           value={projectId}
//           label="projectId"
//         />
//       </div>

//       <Box p={1}>
//         <TextField
//           onChange={(e) => setTitle(e.currentTarget.value)}
//           value={title}
//           label="todo title"
//         />

//         <TextField
//           onChange={(e) => setAssigneeId0(e.currentTarget.value)}
//           value={assigneeId0}
//           label="assigneeId0"
//         />
//         <TextField
//           onChange={(e) => setAssigneeId1(e.currentTarget.value)}
//           value={assigneeId1}
//           label="assigneeId1"
//         />
//         <Button onClick={handleAddingTodo} variant="contained">
//           Add
//         </Button>
//       </Box>
//       {/* for adding a new task */}
//       <Card>
//         Add task
//         <Box p={1}>
//           <TextField
//             onChange={(e) => setTasktitle(e.currentTarget.value)}
//             value={tasktitle}
//             label="tasktitle"
//           />
//           <TextField
//             onChange={(e) => setTaskDescription(e.currentTarget.value)}
//             value={taskDescription}
//             label="taskDescription"
//           />
//           <TextField
//             onChange={(e) => setTaskSeverity(e.currentTarget.value)}
//             value={taskSeverity}
//             label="taskSeverity"
//           />
//           <TextField
//             onChange={(e) => setTaskAssignee(e.currentTarget.value)}
//             value={taskAssignee}
//             label="taskAssignee"
//           />
//         </Box>
//       </Card>
//       {/* todo list */}
//       <Box display="flex" flexDirection="column" gap={1}>
//         {todos.map((todo) => (
//           <TodoComponent
//             key={todo.id}
//             todo={todo}
//             handleDeletingTodo={handleDeletingTodo}
//             handleAddingTaskToTodo={handleAddingTaskToTodo}
//           />
//         ))}
//       </Box>
//     </Box>
//   );
// }

// const TodoComponent = ({
//   todo,
//   handleDeletingTodo,
//   handleAddingTaskToTodo,
// }) => {
//   const [tasks, setTasks] = React.useState([]);
//   const [statusName, setStatusName] = React.useState([]);

//   React.useEffect(() => {
//     const todoTasksColRef = collection(
//       firestoreInstance,
//       "/projects/" + todo.project.id + "/todos/" + todo.id + "/tasks"
//     );
//     if (!todoTasksColRef) return;
//     onSnapshot(todoTasksColRef, (snap) => {
//       snap.docChanges().forEach(async (docChange) => {
//         switch (docChange.type) {
//           case "added":
//             {
//               setTasks((p) => [
//                 ...p,
//                 { id: docChange.doc.id, ...docChange.doc.data() },
//               ]);
//             }
//             break;
//           case "removed":
//             {
//               setTasks((p) => p.filter((td) => td.id !== docChange.doc.id));
//             }
//             break;
//           case "modified":
//             {
//               setTasks((p) =>
//                 p.map((td) =>
//                   td.id === docChange.doc.id
//                     ? { id: docChange.doc.id, ...docChange.doc.data() }
//                     : td
//                 )
//               );
//             }
//             break;
//         }
//       });
//     });
//   }, []);

//   const handleAddingStatus = () => {
//     const data = {
//       projectId: todo.project.id,
//       todoId: todo.id,
//       statusName,
//     };
//     addStatusAPI(data).then((r) => console.log(r));
//   };

//   const handleDeleteStatus = (statusId) => {
//     const data = {
//       projectId: todo.project.id,
//       todoId: todo.id,
//       statusId,
//     };
//     deleteStatusAPI(data).then((r) => console.log(r));
//   };

//   const handleChangingStatusPosition = (status, position) => {
//     if (position <= 1 || position > todo.statuses.length - 1) {
//       console.error("Cant change");
//       return;
//     }

//     const data = {
//       projectId: todo.project.id,
//       todoId: todo.id,
//       statusId: status.id,
//       position,
//     };
//     changeStatusPositionAPI(data).then((r) => console.log(r));
//   };
//   const handleChangingTaskStatus = (task, position) => {
//     if (position < 1) {
//       console.error("Cant change");
//       return;
//     }
//     if (position >= todo.statuses.length) position = 0;
//     const data = {
//       projectId: todo.project.id,
//       todoId: todo.id,
//       taskId: task.id,
//       statusId: todo.statuses[position].id,
//     };
//     changeTaskStatus(data).then((r) => console.log(r));
//   };
//   const handleChangeTaskPosition = (status, task, position) => {
//     if (position < 0 || position > status.tasks.length - 1) {
//       console.error("Cant change");
//       return;
//     }

//     const data = {
//       projectId: todo.project.id,
//       todoId: todo.id,
//       taskId: task.id,
//       statusId: status.id,
//       position,
//     };
//     changeTaskPositionAPI(data).then((r) => console.log(r));
//   };

//   const handleDeleingTask = (task) => {
//     const data = {
//       tasksIds: [task.id],
//       projectId: task.project.id,
//       todoId: task.todo.id,
//     };
//     deleteTasks(data)
//       .then((r) => console.log(r))
//       .catch(({ msg }) => console.error(msg));
//   };
//   return (
//     <Card variant="outlined">
//       <Box p={2}>
//         {todo.id}{" "}
//         <Button
//           size="small"
//           onClick={() => handleDeletingTodo(todo.id)}
//           color="error"
//           variant="contained"
//         >
//           Delete
//         </Button>
//         <Button
//           size="small"
//           onClick={() => handleAddingTaskToTodo(todo.id)}
//           variant="contained"
//         >
//           Add task here
//         </Button>
//         <Box
//           display="flex"
//           flexDirection="row"
//           gap={2}
//           maxWidth="100%"
//           sx={{ overflow: "auto" }}
//         >
//           {todo.statuses &&
//             todo.statuses.map((status, statusArrayIndex) => {
//               if (statusArrayIndex > 0)
//                 return (
//                   <Card
//                     sx={{ position: "relative", minWidth: "450px" }}
//                     key={status.name}
//                   >
//                     <Box sx={{ position: "absolute", top: 0, right: 0 }}>
//                       <Button
//                         size="small"
//                         variant="contained"
//                         onClick={() =>
//                           handleChangingStatusPosition(
//                             status,
//                             statusArrayIndex - 1
//                           )
//                         }
//                       >
//                         left
//                       </Button>
//                       <Button
//                         size="small"
//                         variant="contained"
//                         onClick={() =>
//                           handleChangingStatusPosition(
//                             status,
//                             statusArrayIndex + 1
//                           )
//                         }
//                       >
//                         right
//                       </Button>
//                       <Button
//                         size="small"
//                         color="error"
//                         variant="contained"
//                         onClick={() => handleDeleteStatus(status.id)}
//                       >
//                         X
//                       </Button>
//                     </Box>
//                     <Box fullWidth p={2}>
//                       {status.name}
//                     </Box>

//                     {status.tasks &&
//                       status.tasks.map((task, taskIndex) => (
//                         <Box key={task.id} p={1}>
//                           {task.title}
//                           <Button
//                             size="small"
//                             onClick={() =>
//                               handleChangingTaskStatus(
//                                 task,
//                                 statusArrayIndex - 1
//                               )
//                             }
//                           >
//                             left
//                           </Button>
//                           <Button
//                             size="small"
//                             onClick={() =>
//                               handleChangingTaskStatus(
//                                 task,
//                                 statusArrayIndex + 1
//                               )
//                             }
//                           >
//                             right
//                           </Button>
//                           <Button
//                             size="small"
//                             onClick={() =>
//                               handleChangeTaskPosition(
//                                 status,
//                                 task,
//                                 taskIndex - 1
//                               )
//                             }
//                           >
//                             up
//                           </Button>
//                           <Button
//                             size="small"
//                             onClick={() =>
//                               handleChangeTaskPosition(
//                                 status,
//                                 task,
//                                 taskIndex + 1
//                               )
//                             }
//                           >
//                             down
//                           </Button>
//                           <Button
//                             variant="contained"
//                             color="error"
//                             size="small"
//                             onClick={() => handleDeleingTask(task)}
//                           >
//                             X
//                           </Button>
//                         </Box>
//                       ))}
//                   </Card>
//                 );
//             })}
//           <Card sx={{ minWidth: "350px" }}>
//             <Box width={500} p={2}>
//               COMPLETE
//             </Box>
//             {tasks &&
//               tasks
//                 .filter((t) => t.statusId === todo.statuses[0].id)
//                 .map((t) => (
//                   <Box key={t.id} p={1}>
//                     {t.title}
//                   </Box>
//                 ))}
//           </Card>
//           <Card sx={{ minWidth: "350px" }}>
//             <Box display="flex" flexDirection="column" gap={2} p={2}>
//               <TextField
//                 value={statusName}
//                 onChange={(e) => setStatusName(e.currentTarget.value)}
//                 label="status name"
//               />
//               <Button onClick={handleAddingStatus}>Add</Button>
//             </Box>
//           </Card>
//         </Box>
//       </Box>
//     </Card>
//   );
// };
