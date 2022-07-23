import {
  Box,
  Card,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import BugReportOutlinedIcon from "@mui/icons-material/BugReportOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import LoadingOverlay from "../../../components/LoadingOverlay";
const ScoreCard = ({
  projects,
  finishedTickets,
  openTickets,
  finishedTasks,
  openTasks,
}) => {
  return (
    <Box sx={{ position: "relative" }}>
      <List dense>
        <ListItem>
          <ListItemIcon>
            <BugReportOutlinedIcon />
          </ListItemIcon>
          <ListItemText>{projects ? projects : 0} Projects</ListItemText>
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemIcon>
            <BugReportOutlinedIcon />
          </ListItemIcon>
          <ListItemText>
            {finishedTickets ? finishedTickets : 0} finished Tickets
          </ListItemText>
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemIcon>
            <BugReportOutlinedIcon />
          </ListItemIcon>
          <ListItemText>
            {openTickets ? openTickets : 0} open Tickets
          </ListItemText>
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemIcon>
            <AssignmentTurnedInOutlinedIcon />
          </ListItemIcon>
          <ListItemText>
            {finishedTasks ? finishedTasks : 0} finished Tasks
          </ListItemText>
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemIcon>
            <AssignmentOutlinedIcon />
          </ListItemIcon>
          <ListItemText>{openTasks ? openTasks : 0} open Tasks</ListItemText>
        </ListItem>
        <Divider />
      </List>
    </Box>
  );
};

export default ScoreCard;
