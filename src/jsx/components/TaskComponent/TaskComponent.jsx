import {
  Avatar,
  Box,
  Button,
  Card,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { getTask } from "../../../js/data-services/tasks";
import React from "react";

const TaskSection = () => {
  const [task, setTask] = React.useState(getTask());
  return (
    <Box maxWidth="sm" sx={{ marginInline: "auto", padding: 1 }}>
      <Container>
        <Card sx={{ padding: " 1em" }}>
          <Typography variant="h5" component="h3">
            Title: {task["title"]}
          </Typography>
          <Stack
            direction="row"
            alignItems="center"
            gap={2}
            sx={{ padding: 1 }}
          >
            <Avatar
              sx={{ width: 32, height: 32 }}
              alt="Hanter kun"
              src="https://mui.com/static/images/avatar/1.jpg"
            />
            <Typography
              variant="h6"
              component="h6"
              sx={{ fontSize: "0.9em", fontWeight: "600" }}
            >
              Hanter
            </Typography>
          </Stack>
          <Typography component="p">{task["description"]}</Typography>
        </Card>
      </Container>
      <Box component="div" sx={{ p: 2, display: "flex", gap: "1em" }}>
        <Button variant="outlined" startIcon={<EditIcon />}>
          Edit
        </Button>
        <Button variant="outlined" startIcon={<DeleteIcon />}>
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default TaskSection;
