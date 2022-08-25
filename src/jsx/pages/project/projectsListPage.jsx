import React from "react";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { deleteProjects, getProjects } from "../../../js/services/projects";
import { timeSince } from "../../../js/utils";
import withAuth from "../../../js/hoc/withAuth";
import { collection, onSnapshot } from "firebase/firestore";
import { firestoreInstance } from "../../../js/services/firebase/firestore";
import { Chip, IconButton, Stack, TextField } from "@mui/material";
import OpenInFullOutlinedIcon from "@mui/icons-material/OpenInFullOutlined";
import LoadingOverlay from "../../components/LoadingOverlay";
import { EnhencedTableModified } from "../../components/EnhencedTableModified";
import AddCircleOutlineOutlined from "@mui/icons-material/AddCircleOutlineOutlined";
import TitlePageWrap from "../../components/pageTitleWrap";
import withSideMenuAndNavBar from "../../../js/hoc/withSideMenuAndNavBar";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";

const ProjectsListPage = () => {
  const [loading, setLoading] = React.useState(false);
  const [projects, setProjects] = React.useState([]);
  const navigate = useNavigate();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  React.useEffect(() => {
    setLoading(true);
    const projectsDocRef = collection(firestoreInstance, "/projects");
    onSnapshot(projectsDocRef, (snapshot) => {
      snapshot.docChanges().forEach(async (docChange) => {
        switch (docChange.type) {
          case "added":
            {
              console.log(docChange.doc.data());

              setProjects((prev) => [
                ...prev,
                createRow({ id: docChange.doc.id, ...docChange.doc.data() }),
              ]);
            }
            break;
          case "removed":
            break;

          default:
            break;
        }
      });
    });
    setLoading(false);
    // getProjects()
    //   .then(({ data }) => {
    //     Promise.all(data.map((p) => createRow(p))).then((r) => {
    //       setProjects(r);
    //       setLoading(false);
    //     });
    //   })
    //   .catch((err) => {
    //     setLoading(false);
    //     console.log(err.message);
    //   });
  }, []);

  const tableheadCells = [
    {
      id: "name",
      visible: true,
      disablePadding: true,
      sortable: true,
      label: "name",
    },
    {
      id: "createdAt",
      visible: true,
      disablePadding: true,
      sortable: true,
      label: "created At",
    },
    {
      id: "tickets",
      visible: true,
      disablePadding: true,
      sortable: true,
      label: "tickets",
    },
    {
      id: "tasks",
      visible: true,
      disablePadding: true,
      sortable: true,
      label: "tasks",
    },
    {
      id: "manageAction",
      visible: true,
      disablePadding: true,
      sortable: false,
      label: "",
    },
  ];

  const createRow = (project) => {
    return {
      id: project.id,
      name: project.name,
      createdAt: {
        value: project.createdAt,
        label: timeSince(project.createdAt),
      },
      tickets: {
        value: project.tickets.openCount,
        label: (
          <Chip
            variant={project.tickets.openCount ? "contained" : "outlined"}
            color="primary"
            size="small"
            label={`${project.tickets.openCount} tickets`}
          />
        ),
      },
      tasks: {
        value: project.tasks.openTasksCount,
        label: (
          <Chip
            variant={project.tasks.openTasksCount ? "contained" : "outlined"}
            color="success"
            size="small"
            label={`${project.tasks.openTasksCount} tasks`}
          />
        ),
      },
      manageAction: {
        value: "",
        label: (
          <Chip
            size="small"
            label="Manage"
            icon={<OpenInFullOutlinedIcon />}
            onClick={() => navigate(`/projects/${project.id}`)}
          />
        ),
      },
    };
  };

  const handleDeletion = (ids) => {
    deleteProjects(ids)
      .then(() =>
        enqueueSnackbar("Project has been deleted", { variant: "success" })
      )
      .catch((err) => enqueueSnackbar(err.message, { variant: "error" }));
  };
  return (
    <TitlePageWrap title="Projects">
      <Box p={3} width={800} sx={{ position: "relative" }}>
        {loading && <LoadingOverlay />}
        <EnhencedTableModified
          tableTitle="Projects"
          rows={projects}
          tableheadCells={tableheadCells}
          filters={["name", "tasks", "tickets"]}
          handleDeletion={handleDeletion}
          actionButtons={[
            <IconButton
              key="0"
              onClick={() => navigate("/projects/add-new-project")}
            >
              <AddCircleOutlineOutlined />
            </IconButton>,
          ]}
          selectable
        />
      </Box>
    </TitlePageWrap>
  );
};

export default withAuth(withSideMenuAndNavBar(ProjectsListPage));
