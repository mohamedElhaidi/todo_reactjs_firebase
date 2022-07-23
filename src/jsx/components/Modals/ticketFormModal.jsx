import React from "react";
import { useNavigate } from "react-router-dom";
import { getUsersPublic } from "../../../js/services/users";
import { createTicket, modifyTicket } from "../../../js/services/tickets";

import {
  Container,
  Card,
  Stack,
  Typography,
  Link,
  Modal,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  Autocomplete,
  LinearProgress,
  Alert,
} from "@mui/material";
import EnhencedModal from "../EnhencedModal";
import {
  getTicketSeverityCodes,
  getTicketType,
  getTicketTypesCodes,
} from "../../../js/tickets.utils";
import { getTaskSeverity } from "../../../js/tasks.utils";
import { useSnackbar } from "notistack";
import UsersAutocompleteList from "../../form/usersAutocompleteList";

const ticketModalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",

  transform: "translate(-50%, -50%)",
  width: 600,

  boxShadow: 24,
};

const TicketFormModal = ({
  projectId,
  ticketToEdit,
  ticketModalOpen,
  ticketModalCloseHandle,
}) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  // form
  const [title, setTitle] = React.useState(
    ticketToEdit ? ticketToEdit.title : ""
  );
  const [description, setDescription] = React.useState(
    ticketToEdit ? ticketToEdit.description : ""
  );
  const [type, setType] = React.useState(ticketToEdit ? ticketToEdit.type : 0);
  const [severity, setSeverity] = React.useState(
    ticketToEdit ? ticketToEdit.severity : 0
  );
  const [selectedUsers, setSelectedUsers] = React.useState([]);

  // pre-defined
  const [types, setTypes] = React.useState(getTicketTypesCodes());
  const [severities, setSeverities] = React.useState(getTicketSeverityCodes());

  const navigate = useNavigate();

  const handleUserAutocompleteSuccess = (users) => {
    // if we are editing
    if (ticketToEdit) {
      // grab assignees from ticket we are editting
      const ids = ticketToEdit.assignees.map((a) => a.id);
      setSelectedUsers(users.filter((u) => ids.includes(u.id)));
    }
  };
  const handleUserAutocompleteFailure = () => {};
  const handleUserAutocompleteSelectionChange = (users) => {
    setSelectedUsers(users);
  };

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };
  const handlePriorityChange = (event) => {
    setSeverity(event.target.value);
  };

  const handleSubmite = () => {
    const newticket = {
      projectId,
      title: String(title),
      description: String(description),
      type: Number(type),
      severity: Number(severity),
      assigneesIds: selectedUsers.map((u) => u.id),
    };

    if (!ticketToEdit)
      createTicket(newticket)
        .then(({ data }) => {
          ticketModalCloseHandle(true);
          enqueueSnackbar(data.message, { variant: "success" });
          console.log(data);
        })
        .catch((err) => {
          console.error(err);
          enqueueSnackbar(err.message, { variant: "error" });
        });
    else
      modifyTicket({ ticketId: ticketToEdit.id, ...newticket })
        .then(({ data }) => {
          ticketModalCloseHandle(true);
          enqueueSnackbar(data.message, { variant: "success" });
          console.log(data);
        })
        .catch((err) => {
          console.error(err);
          enqueueSnackbar(err.message, { variant: "error" });
        });
  };

  const checkInputs = () => {
    if (!(title.length && description.length && selectedUsers.length))
      return true;
    if (ticketToEdit)
      if (
        ticketToEdit.title === title &&
        ticketToEdit.description === description &&
        ticketToEdit.type === type &&
        ticketToEdit.severity === severity &&
        ticketToEdit.assigneesIds &&
        ticketToEdit.assigneesIds.length === selectedUsers.length &&
        ticketToEdit.assigneesIds.reduce(
          (prev, m) => (prev &= selectedUsers.map((u) => u.id).includes(m)),
          true
        )
      )
        return true;
    return false;
  };
  return (
    <EnhencedModal
      open={ticketModalOpen}
      handleClose={ticketModalCloseHandle}
      sx={{ minWidth: 550, padding: 2 }}
    >
      <Stack spacing={3} sx={{ padding: "0 1em 1em 1em" }}>
        <Typography component="h1" variant="h5" sx={{ pt: 1, pb: 3 }}>
          {!ticketToEdit ? "New Ticket" : "Modifying a Ticket"}
        </Typography>
        <TextField
          id="title-basic"
          label="title"
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          id="description-basic"
          label="description"
          variant="outlined"
          value={description}
          multiline
          minRows={5}
          maxRows={10}
          onChange={(e) => setDescription(e.target.value)}
        />
        <FormControl fullWidth>
          <InputLabel id="type-label">Type</InputLabel>
          <Select
            labelId="type-label"
            id="type"
            value={type}
            label="Type"
            onChange={handleTypeChange}
          >
            {types &&
              types.map((type) => (
                <MenuItem key={type} value={type}>
                  {getTicketType(type)}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="priority-label">Priority</InputLabel>
          <Select
            labelId="priority-label"
            id="priority"
            value={severity}
            label="priority"
            onChange={handlePriorityChange}
          >
            {severities &&
              severities.map((severity) => (
                <MenuItem key={severity} value={severity}>
                  {getTaskSeverity(severity)}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        <UsersAutocompleteList
          value={selectedUsers}
          disabled={false}
          multiple
          onFetchSucceeded={handleUserAutocompleteSuccess}
          onFetchFailed={handleUserAutocompleteFailure}
          handleSelectionChange={handleUserAutocompleteSelectionChange}
        />
        <Button
          disabled={checkInputs()}
          variant="contained"
          onClick={handleSubmite}
        >
          {!ticketToEdit ? "Submite" : "Apply Modifications"}
        </Button>
      </Stack>
    </EnhencedModal>
  );
};

export default TicketFormModal;
