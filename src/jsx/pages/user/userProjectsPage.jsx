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

const UserProjectsPage = () => {
  const { isAuth, user } = useStore()[0];
  const [loading, setLoading] = React.useState(false);
  const [openTaskFormModal, setOpenTaskFormModal] = React.useState(false);
  const [projects, setProjects] = React.useState([]);

  const params = useParams();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!user) return;
    // referece tasks collection
    const projectsBelongsToMeColRef = collection(
      firestoreInstance,
      `/users/${user.uid}/projects`
    );
    console.log(user);
    const unsubscribe = onSnapshot(projectsBelongsToMeColRef, (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        const project = {
          id: change.doc.id,
          ...change.doc.data(),
        };
        if (change.type === "added") {
          setProjects((prev) => [...prev, project]);
        }
        if (change.type === "modified") {
          setProjects((prev) => [
            ...prev.map((p) => (p.id === change.doc.id ? project : p)),
          ]);
        }
        if (change.type === "removed") {
          setProjects((prev) => prev.filter((p) => p.id !== change.doc.id));
        }
      });
    });

    return () => {
      unsubscribe();
    };
  }, [user]);

  const handleDeletion = (ids) => {
    setLoading(true);
    deleteProjects({ projectsIds: ids })
      .then((r) => {
        setLoading(false);
      })
      .catch((err) => setLoading(false));
  };

  const handleAddNewTask = () => {
    setOpenTaskFormModal(true);
  };

  const createRow = (project) => {
    console.log(project);
    return {
      id: project.id,
      name:
        project.name && project.name.length <= 45
          ? project.name
          : project.name.slice(0, 50) + "...",
      createdAt: {
        value: project.createdAt,
        label: timeSince(project.createdAt),
      },
      viewAction: {
        value: "",
        label: (
          <Chip
            size="small"
            icon={<OpenInFullOutlinedIcon />}
            onClick={() => navigate(`/projects/${project.id}`)}
            label="View"
          />
        ),
      },
    };
  };

  return (
    <TitlePageWrap title={`My projects ${projects.length}`}>
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
              id: "name",
              visible: true,
              align: "left",
              disablePadding: true,
              sortable: true,
              label: "Project Name",
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
          rows={projects.map((project) => createRow(project))}
          sx={{ maxWidth: "100%" }}
          filters={["name"]}
          selectable={false}
        />
      </Box>
    </TitlePageWrap>
  );
};

export default withAuth(withSideMenuAndNavBar(UserProjectsPage));
