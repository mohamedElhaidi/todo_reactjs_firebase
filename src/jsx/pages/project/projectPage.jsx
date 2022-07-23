import React, { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";
import { getProjectById } from "../../../js/services/projects";
import {
  Box,
  Container,
  Card,
  Typography,
  Chip,
  Divider,
  Skeleton,
} from "@mui/material";
import TicketsListOverviewTable from "./ticketsListOverviewTable";
import AssignementList from "./assignementList";
import withAuth from "../../../js/hoc/withAuth";
import TitlePageWrap from "../../components/pageTitleWrap";
import TodosListOverviewTable from "./todosListOverviewTable";
import withSideMenuAndNavBar from "../../../js/hoc/withSideMenuAndNavBar";
import TextEnhenced from "../../components/TextEnhenced";

const ProjectPage = () => {
  const [project, setProject] = useState({});
  const [projectName, setProjectName] = useState("");

  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getProjectById(params.projectId).then(({ data }) => {
      setProject(data);
    });
  }, []);

  useEffect(() => {
    setProjectName(project.name);
  }, [project]);

  return (
    project && (
      <TitlePageWrap
        title={`Project page of <${projectName}> ${project.version}`}
      >
        <Container>
          <Box
            sx={{
              display: "flex",
              direction: "row",
              gap: 1,
              marginTop: 3,
              marginBottom: 3,
            }}
          >
            <Card variant="outlined" sx={{ flex: 1, padding: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    marginBottom: 1,
                  }}
                >
                  <TextEnhenced
                    minWidth={100}
                    text={project.name}
                    variant="h5"
                    component="h1"
                    gutterBottom
                  />
                  <Chip
                    color="secondary"
                    size="small"
                    label={project.version}
                  />
                </Box>
                <Divider />
                <Box>
                  <Typography variant="overline" component="h2" gutterBottom>
                    Description:
                  </Typography>
                  <TextEnhenced
                    text={project.description}
                    variant="body1"
                    component="p"
                    gutterBottom
                  />
                </Box>
              </Box>
            </Card>
            <AssignementList assignees={project.assignees} sx={{ flex: 1 }} />
          </Box>
          <Typography variant="h5" component="h2" gutterBottom>
            Ticket(s)
          </Typography>
          <TicketsListOverviewTable projectId={params.projectId} />
          <Typography variant="h5" component="h2" gutterBottom>
            Todo list(s)
          </Typography>
          <TodosListOverviewTable projectId={params.projectId} />
        </Container>
      </TitlePageWrap>
    )
  );
};

export default withAuth(withSideMenuAndNavBar(ProjectPage));
