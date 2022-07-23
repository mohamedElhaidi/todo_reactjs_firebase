import AddCircleOutlineOutlined from "@mui/icons-material/AddCircleOutlineOutlined";
import { Box, Card, Chip, IconButton } from "@mui/material";
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { firestoreInstance } from "../../../js/services/firebase/firestore";
import { deleteAttachements } from "../../../js/services/tickets";
import { timeSince } from "../../../js/utils";
import EnhencedModal from "../../components/EnhencedModal";
import { EnhencedTableModified } from "../../components/EnhencedTableModified";
import AttachementFormModal from "../../components/Modals/attachementFormModal";
import AttachementViewModal from "../../components/Modals/attachementViewModal";

import TextEnhenced from "../../components/TextEnhenced";

const TicketAttachements = ({ ticketId, projectId }) => {
  const [attachements, setAttachements] = useState([]);
  const [selectedAttachement, setSelectedAttachement] = useState(null);
  const [openAttachementFormModal, setOpenAttachementFormModal] =
    useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    if (!ticketId && projectId) return;
    const attColRef = collection(
      firestoreInstance,
      `/projects/${projectId}/tickets/${ticketId}/attachements`
    );

    const unsubAttachementColChangeListener = onSnapshot(
      attColRef,
      (snap) => {
        snap.docChanges().forEach((docChange) => {
          const attch = { id: docChange.doc.id, ...docChange.doc.data() };
          switch (docChange.type) {
            case "added":
              setAttachements((p) => [attch, ...p]);
              break;
            case "modified":
              setAttachements((p) =>
                p.map((attachement) =>
                  attachement.id !== attch.id ? attachement : attch
                )
              );
              break;
            case "removed":
              setAttachements((p) =>
                p.filter((attachement) => attachement.id !== attch.id)
              );
              break;
          }
        });
      },
      (error) => {}
    );

    return () => {
      unsubAttachementColChangeListener();
    };
  }, [ticketId, projectId]);

  const createRow = (attachement) => {
    return {
      id: attachement.id,
      extension: attachement.extension,
      description: attachement.description,
      fileCount: attachement.files.length,
      submitterName: attachement.submitter.name,
      createdAt: {
        value: attachement.createdAt,
        label: timeSince(attachement.createdAt),
      },
      viewAction: {
        value: "",
        label: (
          <Chip
            size="small"
            label="view"
            onClick={() => handleOpenViewAction(attachement)}
          />
        ),
      },
    };
  };

  const handleOpenViewAction = (attachement) => {
    setSelectedAttachement(attachement);
  };
  const handleDeletion = (attachementsIds) => {
    const data = {
      projectId,
      ticketId,
      attachementsIds,
    };
    deleteAttachements(data)
      .then((r) => console.log(r))
      .catch(({ message }) => console.log(message));
  };
  return (
    <>
      <Card variant="outlined">
        <Box p={2} height="100%" width="100%">
          <TextEnhenced variant="h6" component="h2" text="Attachements" />
          <EnhencedTableModified
            variant="none"
            tableTitle=""
            tableheadCells={[
              {
                id: "description",
                visible: true,
                align: "left",
                disablePadding: true,
                sortable: true,
                label: "Description",
              },
              {
                id: "fileCount",
                visible: true,
                align: "left",
                disablePadding: true,
                sortable: true,
                label: "Files Count",
              },
              {
                id: "submitterName",
                visible: true,
                disablePadding: true,
                sortable: true,
                label: "Submitter",
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
                label: "action",
              },
            ]}
            rows={attachements.map((attachement) => createRow(attachement))}
            sx={{ maxWidth: "100%" }}
            handleDeletion={(ids) => handleDeletion(ids)}
            filters={["fileName", "submitter"]}
            selectable={true}
            actionButtons={[
              <IconButton
                key={0}
                onClick={() => setOpenAttachementFormModal(true)}
              >
                <AddCircleOutlineOutlined />
              </IconButton>,
            ]}
          />
        </Box>
      </Card>
      <AttachementViewModal
        attachement={selectedAttachement}
        open={Boolean(selectedAttachement)}
        handleClose={() => setSelectedAttachement(null)}
      />
      <AttachementFormModal
        projectId={projectId}
        ticketId={ticketId}
        open={openAttachementFormModal}
        handleClose={() => setOpenAttachementFormModal(false)}
      />
    </>
  );
};

export default TicketAttachements;
