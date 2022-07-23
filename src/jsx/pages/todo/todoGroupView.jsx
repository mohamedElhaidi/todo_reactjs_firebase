import {
  TodoStatusTasksList,
  TodoStatusTasksListItem,
} from "../../components/todo/listview/todoStatusList";
import { Box, Button, Card, TextField } from "@mui/material";
const TodoGroupView = ({
  todo,
  onTaskItemSelected,
  handleTaskDeletion,
  handleStatusDeletion,
  handleChangeTaskPosition,
  handleChangingStatusPosition,
  handleDeleteStatus,
  handleChangingTaskStatus,
}) => {
  if (!todo) return;
  return (
    <Card variant="outlined">
      <Box p={2}>
        {todo.id}
        <Button
          size="small"
          onClick={() => handleStatusDeletion(todo.id)}
          color="error"
          variant="contained"
        >
          Delete
        </Button>
        <Box
          display="flex"
          flexDirection="row"
          gap={2}
          maxWidth="100%"
          sx={{ overflow: "auto" }}
        >
          {todo.statuses &&
            todo.statuses.map((status, statusArrayIndex) => {
              if (statusArrayIndex > 0)
                return (
                  <Card
                    sx={{ position: "relative", minWidth: "450px" }}
                    key={status.name}
                  >
                    <Box sx={{ position: "absolute", top: 0, right: 0 }}>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() =>
                          handleChangingStatusPosition(
                            status,
                            statusArrayIndex - 1
                          )
                        }
                      >
                        left
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() =>
                          handleChangingStatusPosition(
                            status,
                            statusArrayIndex + 1
                          )
                        }
                      >
                        right
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        variant="contained"
                        onClick={() => handleDeleteStatus(status.id)}
                      >
                        X
                      </Button>
                    </Box>
                    <Box fullWidth p={2}>
                      {status.name}
                    </Box>

                    {status.tasks &&
                      status.tasks.map((task, taskIndex) => (
                        <Box key={task.id} p={1}>
                          {task.title}
                          <Button
                            size="small"
                            onClick={() =>
                              handleChangingTaskStatus(
                                task,
                                statusArrayIndex - 1
                              )
                            }
                          >
                            left
                          </Button>
                          <Button
                            size="small"
                            onClick={() =>
                              handleChangingTaskStatus(
                                task,
                                statusArrayIndex + 1
                              )
                            }
                          >
                            right
                          </Button>
                          <Button
                            size="small"
                            onClick={() =>
                              handleChangeTaskPosition(
                                status,
                                task,
                                taskIndex - 1
                              )
                            }
                          >
                            up
                          </Button>
                          <Button
                            size="small"
                            onClick={() =>
                              handleChangeTaskPosition(
                                status,
                                task,
                                taskIndex + 1
                              )
                            }
                          >
                            down
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => handleTaskDeletion(task)}
                          >
                            X
                          </Button>
                        </Box>
                      ))}
                  </Card>
                );
            })}
          <Card sx={{ minWidth: "350px" }}>
            <Box width={500} p={2}>
              COMPLETE
            </Box>
          </Card>
        </Box>
      </Box>
    </Card>
  );
};

export default TodoGroupView;
