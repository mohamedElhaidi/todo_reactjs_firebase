import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { timeSince } from "../../../js/utils";
import TicketFormModal from "../../components/Modals/ticketFormModal";
import { EnhencedTableModified } from "../../components/EnhencedTableModified";

import { IconButton, Chip } from "@mui/material";
import OpenInFullOutlinedIcon from "@mui/icons-material/OpenInFullOutlined";
import AddCircleOutlineOutlined from "@mui/icons-material/AddCircleOutlineOutlined";
import {
  deleteTickets,
  getTicketSubmitter,
} from "../../../js/services/tickets";
import LoadingOverlay from "../../components/LoadingOverlay";
import { Box } from "@mui/system";
import { collection, onSnapshot } from "firebase/firestore";
import { firestoreInstance } from "../../../js/services/firebase/firestore";
import {
  getTicketSeverity,
  getTicketStatusText,
} from "../../../js/tickets.utils";

const TicketsListOverviewTable = ({ projectId }) => {
  const [loading, setLoading] = React.useState(false);
  const [tickets, setTickets] = React.useState([]);
  const [rows, setRows] = React.useState([]);
  const [ticketModalOpen, setTicketModalOpen] = React.useState(false);

  const navigate = useNavigate();
  const params = useParams();

  React.useEffect(() => {
    setRows(tickets.map((m) => createRow(m)));
  }, [tickets]);

  React.useEffect(() => {
    const ticketsColRef = collection(
      firestoreInstance,
      "projects/",
      projectId,
      "tickets"
    );

    // listen to tickets
    onSnapshot(ticketsColRef, (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        const u = change.doc.data().submitter;
        const t = {
          id: change.doc.id,
          ...change.doc.data(),
          submitterInfo: {
            name: u.name,
            role: u.role,
          },
        };
        if (change.type === "added") {
          setTickets((prev) => [...prev, t]);
        }
        if (change.type === "modified") {
          setTickets((prev) => [
            ...prev.map((ticket) => (ticket.id === change.doc.id ? t : ticket)),
          ]);
        }
        if (change.type === "removed") {
          setTickets((prev) =>
            prev.filter((ticket) => ticket.id !== change.doc.id)
          );
        }
      });
    });
  }, []);
  const handleOpenTicketPage = (ticketId) => {
    navigate(`/projects/${params.projectId}/tickets/${ticketId}`);
  };

  const ticketModalOpenHandle = () => {
    setTicketModalOpen(true);
  };
  const ticketModalCloseHandle = () => {
    setTicketModalOpen(false);
  };

  const handleDeletion = (ids) => {
    setLoading(true);
    deleteTickets({ ticketsIds: ids, projectId: params.projectId })
      .then((r) => {
        setLoading(false);
      })
      .catch((err) => setLoading(false));
  };

  const tableheadCells = [
    {
      id: "submitter",
      visible: true,
      disablePadding: true,
      sortable: true,
      label: "Submiter",
    },
    {
      id: "title",
      visible: true,
      disablePadding: true,
      sortable: true,
      label: "Title",
    },
    {
      id: "status",
      visible: true,
      disablePadding: true,
      sortable: true,
      label: "Status",
    },
    {
      id: "priority",
      visible: true,
      disablePadding: true,
      sortable: true,
      label: "Priority",
    },
    {
      id: "createdAt",
      visible: true,
      disablePadding: true,
      sortable: true,
      label: "Created At",
    },
    {
      id: "viewAction",
      visible: true,
      disablePadding: true,
      sortable: true,
      label: "",
    },
  ];
  const createRow = (ticket) => {
    return {
      id: ticket.id,
      title:
        ticket.title && ticket.title.length <= 45
          ? ticket.title
          : ticket.title.slice(0, 50) + "...",
      submitter: ticket.submitterInfo.name,
      status: {
        value: ticket.status,
        label: (
          <Chip
            variant="outlined"
            size="small"
            color={ticket.status ? "error" : "success"}
            label={getTicketStatusText(ticket.status)}
          />
        ),
      },
      priority: {
        value: ticket.severity,
        label: (
          <Chip
            variant="contained"
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
        ),
      },
      createdAt: {
        value: ticket.createdAt,
        label: timeSince(ticket.createdAt),
      },
      viewAction: {
        value: "",
        label: (
          <Chip
            size="small"
            icon={<OpenInFullOutlinedIcon />}
            onClick={() => handleOpenTicketPage(ticket.id)}
            label="View"
          />
        ),
      },
    };
  };
  return (
    <Box sx={{ position: "relative", height: "fit-content" }}>
      {loading && <LoadingOverlay />}
      <EnhencedTableModified
        variant="outlined"
        tableTitle="Tickets"
        tableheadCells={tableheadCells}
        rows={rows}
        sx={{ maxWidth: "100%" }}
        handleDeletion={(ids) => handleDeletion(ids)}
        filters={["title", "submitter"]}
        selectable={true}
        actionButtons={[
          <IconButton key={0} onClick={() => ticketModalOpenHandle()}>
            <AddCircleOutlineOutlined />
          </IconButton>,
        ]}
      />
      <TicketFormModal
        projectId={params.projectId}
        ticketModalOpen={ticketModalOpen}
        ticketModalCloseHandle={ticketModalCloseHandle}
      />
    </Box>
  );
};

export default TicketsListOverviewTable;
