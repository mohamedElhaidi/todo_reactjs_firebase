import React from "react";

import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";

import { firestoreInstance } from "../../../js/services/firebase/firestore";

import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Card,
  Container,
  Grid,
  Stack,
  Typography,
  Item,
  Chip,
  Divider,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  deleteTickets,
  getTicketSubmitter,
} from "../../../js/services/tickets";
import { getUsers } from "../../../js/services/user";
import TicketFormModal from "../../components/Modals/ticketFormModal";
import {
  getTicketSeverity,
  getTicketStatusText,
  getTicketType,
} from "../../../js/tickets.utils";
import { useSnackbar } from "notistack";

const TicketDetailsSection = ({ projectId, ticketId }) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [ticketModalOpen, setTicketModalOpen] = React.useState(false);
  const [ticket, setTicket] = React.useState(null);
  const [assignees, setAssignees] = React.useState([]);
  const [submitter, setTicketSubmitter] = React.useState({});
  const navigate = useNavigate();

  React.useEffect(() => {
    let ticketDocRef;

    try {
      if (projectId && ticketId) {
        ticketDocRef = doc(
          firestoreInstance,
          "projects",
          projectId,
          "tickets",
          ticketId
        );

        //listen to ticket doc changes
        onSnapshot(ticketDocRef, async (snap) => {
          const data = snap.data();
          setTicket({ id: ticketDocRef.id, ...data });

          setTicketSubmitter(data.submitter);

          setAssignees(data.assignees);
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleOpenTicketFormModal = () => {
    setTicketModalOpen(true);
  };
  const handleCloseTicketFormModal = () => {
    setTicketModalOpen(false);
  };

  const handleTicketDeletion = () => {
    deleteTickets({ ticketsIds: [ticketId], projectId })
      .then(({ data }) => {
        enqueueSnackbar(data.message, { variant: "success" });
        navigate("/projects/" + projectId);
      })
      .catch((err) => {
        enqueueSnackbar(err.message, { variant: "error" });
        console.log(err.message);
      });
  };
  if (!ticket) return;
  return (
    <Box width={"100%"} display="flex" flexDirection="row" gap={2}>
      <Card variant="outlined" sx={{ flex: 2, padding: " 1em" }}>
        <Stack spacing={1}>
          <Typography variant="h5" component="h3">
            {ticket["title"]}
          </Typography>
          <Divider />
          <Typography component="div" variant="overline">
            status:{" "}
            <Chip
              size="small"
              variant="contained"
              color={ticket.status ? "error" : "success"}
              label={getTicketStatusText(ticket.status)}
            />
          </Typography>
          <Divider />

          <Typography component="div" variant="overline">
            Type:{" "}
            <Chip
              size="small"
              variant="contained"
              color="primary"
              label={getTicketType(ticket.type)}
            />
          </Typography>
          <Divider />
          <Typography component="div" variant="overline">
            Submitter:{" "}
            <Tooltip title={submitter.email || ""}>
              <Link to={`/users/${submitter.id}/profile`}>
                {submitter.name}
              </Link>
            </Tooltip>
          </Typography>

          <Divider />
          <Typography component="div" variant="overline">
            Priority:{" "}
            <Chip
              size="small"
              color={
                ticket.severity === 2
                  ? "error"
                  : ticket.severity === 1
                  ? "secondary"
                  : "primary"
              }
              label={getTicketSeverity(ticket.severity)}
            />
          </Typography>
          <Divider />
          <Typography component="div" variant="overline">
            Project Name:{" "}
            <Link to={`/projects/${ticket.project && ticket.project.id}`}>
              {ticket.project && ticket.project.name}
            </Link>
          </Typography>
          <Divider />
          <Typography component="div" variant="overline">
            Assigned to:{" "}
            {assignees &&
              assignees.map((u, index) => (
                <span key={index}>
                  <Tooltip title={u.email || ""}>
                    <Link to={`/users/${u.id}/profile`}>{u.name}</Link>
                  </Tooltip>{" "}
                </span>
              ))}
          </Typography>
          <Divider />
        </Stack>

        <Box component="div" mt={1} sx={{ display: "flex", gap: "1em" }}>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={handleOpenTicketFormModal}
          >
            edit
          </Button>
          <Button
            onClick={handleTicketDeletion}
            color="error"
            startIcon={<DeleteIcon />}
          >
            delete
          </Button>
        </Box>
      </Card>
      <Card variant="outlined" sx={{ flex: 3, padding: " 1em" }}>
        <Typography component="div" variant="overline">
          Description:
        </Typography>
        <Box maxHeight="450px" overflow="auto">
          {ticket["description"]}
        </Box>
      </Card>
      {ticket && (
        <TicketFormModal
          projectId={projectId}
          ticketToEdit={ticket}
          ticketModalOpen={ticketModalOpen}
          ticketModalCloseHandle={handleCloseTicketFormModal}
        />
      )}
    </Box>
  );
};

export default TicketDetailsSection;
