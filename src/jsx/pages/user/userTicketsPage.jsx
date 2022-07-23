import AddCircleOutlineOutlined from "@mui/icons-material/AddCircleOutlineOutlined";
import { Box, Chip, IconButton } from "@mui/material";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "../../../js/services/Context/StoreContext";
import { firestoreInstance } from "../../../js/services/firebase/firestore";
import { deleteProjects } from "../../../js/services/projects";
import { timeSince } from "../../../js/utils";
import { EnhencedTableModified } from "../../components/EnhencedTableModified";
import LoadingOverlay from "../../components/LoadingOverlay";
import OpenInFullOutlinedIcon from "@mui/icons-material/OpenInFullOutlined";
import withAuth from "../../../js/hoc/withAuth";
import withSideMenuAndNavBar from "../../../js/hoc/withSideMenuAndNavBar";
import TitlePageWrap from "../../components/pageTitleWrap";
import { getTicketSeverity, getTicketType } from "../../../js/tickets.utils";

const UserTicketsPage = () => {
  const { isAuth, user } = useStore()[0];
  const [loading, setLoading] = React.useState(false);
  const [openTaskFormModal, setOpenTaskFormModal] = React.useState(false);
  const [tickets, setTickets] = React.useState([]);

  const params = useParams();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!user) return;
    // referece tasks collection
    const ticketsBelongsToMeColRef = collection(
      firestoreInstance,
      `/users/${user.uid}/tickets`
    );

    const unsubscribe = onSnapshot(ticketsBelongsToMeColRef, (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        const ticket = {
          id: change.doc.id,
          ...change.doc.data(),
        };
        if (change.type === "added") {
          setTickets((prev) => [...prev, ticket]);
        }
        if (change.type === "modified") {
          setTickets((prev) => [
            ...prev.map((p) => (p.id === change.doc.id ? ticket : p)),
          ]);
        }
        if (change.type === "removed") {
          setTickets((prev) => prev.filter((p) => p.id !== change.doc.id));
        }
      });
    });

    return () => {
      unsubscribe();
    };
  }, [user]);

  const createRow = (ticket) => {
    const projectId = ticket.ref.parent.parent.id;
    return {
      id: ticket.id,
      title:
        ticket.title && ticket.title.length <= 45
          ? ticket.title
          : ticket.title.slice(0, 50) + "...",
      type: {
        value: ticket.type,
        label: (
          <Chip
            variant="outlined"
            size="small"
            color={"primary"}
            label={getTicketType(ticket.type)}
          />
        ),
      },
      severity: {
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
            onClick={() =>
              navigate(`/projects/${projectId}/tickets/${ticket.id}`)
            }
            label="View"
          />
        ),
      },
    };
  };

  return (
    <TitlePageWrap title={`My Tickets ${tickets.length}`}>
      <Box
        width="100%"
        p={3}
        sx={{ position: "relative", height: "fit-content" }}
      >
        {loading && <LoadingOverlay />}
        <EnhencedTableModified
          tableTitle=""
          tableheadCells={[
            {
              id: "title",
              visible: true,
              align: "left",
              disablePadding: true,
              sortable: true,
              label: "title",
            },
            {
              id: "type",
              visible: true,
              align: "left",
              disablePadding: true,
              sortable: true,
              label: "type",
            },
            {
              id: "severity",
              visible: true,
              align: "left",
              disablePadding: true,
              sortable: true,
              label: "severity",
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
          ]}
          rows={tickets.map((ticket) => createRow(ticket))}
          sx={{ maxWidth: "100%" }}
          filters={["title", "type"]}
          selectable={false}
        />
      </Box>
    </TitlePageWrap>
  );
};

export default withAuth(withSideMenuAndNavBar(UserTicketsPage));
