import React, { useEffect } from "react";
import { createProject } from "../../../../js/services/projects";
import {
  Card,
  Stack,
  Typography,
  TextField,
  Button,
  Box,
  Autocomplete,
  LinearProgress,
} from "@mui/material";
import { getUsersPublic } from "../../../../js/services/users";
import { useNavigate } from "react-router-dom";
import withAuth from "../../../../js/hoc/withAuth";
import { useStore } from "../../../../js/services/Context/StoreContext";
import TitlePageWrap from "../../../components/pageTitleWrap";
import withSideMenuAndNavBar from "../../../../js/hoc/withSideMenuAndNavBar";
import UsersAutocompleteList from "../../../form/usersAutocompleteList";

const NewProjectPage = () => {
  const [store, setStore] = useStore();
  const [name, setName] = React.useState("");
  const [version, setVersion] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [selectedUsers, setSelectedUsers] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  const [progress, setProgress] = React.useState(false);

  const navigate = useNavigate();
  const getProgress = () => {
    return Boolean(progress);
  };
  const startLoading = () => {
    setProgress((p) => ++p);
  };
  const endLoading = () => {
    setProgress((p) => --p);
  };
  const handleSubmite = () => {
    startLoading();
    const project = {
      name,
      version,
      description,
      assigneesIds: selectedUsers.map((u) => u.id),
    };
    createProject(project)
      .then(({ data }) => {
        endLoading();
        navigate("/projects/" + data.projectId);
      })
      .catch((error) => {
        console.error(error.message);
        endLoading();
      });
  };

  const handleUserAutocompleteSuccess = (users) => {};
  const handleUserAutocompleteFailure = () => {};
  const handleUserAutocompleteSelectionChange = (users) => {
    setSelectedUsers(users);
  };

  // grab all users public info
  React.useEffect(() => {
    startLoading();
    getUsersPublic().then(({ data }) => setUsers(data));
    endLoading();
  }, []);

  return (
    <TitlePageWrap title="Creating a project">
      <Box p={2} width="100%">
        <Card sx={{ pt: 0 }} variant="outlined">
          {getProgress() ? <LinearProgress color="secondary" /> : null}

          <Stack spacing={3} sx={{ padding: "0 5em 5em 5em" }}>
            <Typography component="h1" variant="h4" sx={{ pt: 5, pb: 3 }}>
              New Project
            </Typography>
            <TextField
              disabled={getProgress()}
              id="project-name"
              label="name"
              value={name}
              onChange={(e, value) => setName(e.target.value)}
              variant="outlined"
            />
            <TextField
              disabled={getProgress()}
              id="project-version"
              label="version"
              value={version}
              onChange={(e, value) => setVersion(e.target.value)}
              variant="outlined"
            />
            <TextField
              disabled={getProgress()}
              id="project-description"
              label="description"
              variant="outlined"
              multiline
              rows={4}
              value={description}
              onChange={(e, value) => setDescription(e.target.value)}
            />

            <UsersAutocompleteList
              value={selectedUsers}
              disabled={false}
              multiple
              onFetchSucceeded={handleUserAutocompleteSuccess}
              onFetchFailed={handleUserAutocompleteFailure}
              handleSelectionChange={handleUserAutocompleteSelectionChange}
            />
            <Button
              disabled={getProgress()}
              variant="contained"
              onClick={handleSubmite}
            >
              Create
            </Button>
          </Stack>
        </Card>
      </Box>
    </TitlePageWrap>
  );
};

export default withAuth(withSideMenuAndNavBar(NewProjectPage));
