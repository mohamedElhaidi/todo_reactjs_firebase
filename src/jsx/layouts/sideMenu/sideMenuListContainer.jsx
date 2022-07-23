import {
  ListItemButton,
  Box,
  Collapse,
  List,
  ListItemIcon,
  Stack,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  ListItem,
  Paper,
  ToggleButton,
  Typography,
  Divider,
  Badge,
  Button,
  IconButton,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { styled } from "@mui/system";
import React, { useState } from "react";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StarBorder from "@mui/icons-material/StarBorder";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import GroupAddRoundedIcon from "@mui/icons-material/GroupAddRounded";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import AccountTreeRoundedIcon from "@mui/icons-material/AccountTreeRounded";
import BugReportRoundedIcon from "@mui/icons-material/BugReportRounded";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import CheckBoxOutlineBlankOutlinedIcon from "@mui/icons-material/CheckBoxOutlineBlankOutlined";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import { useStore } from "../../../js/services/Context/StoreContext";
import { SideMenuListItem } from "../../components/styled/List/SideMenuListItem";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import withAuth from "../../../js/hoc/withAuth";
import SideMenuHeader from "./sideMenuHeader";
import EmojiNatureOutlinedIcon from "@mui/icons-material/EmojiNatureOutlined";
import EqualizerOutlinedIcon from "@mui/icons-material/EqualizerOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import AddModeratorOutlinedIcon from "@mui/icons-material/AddModeratorOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import ReportGmailerrorredOutlinedIcon from "@mui/icons-material/ReportGmailerrorredOutlined";
import {
  canManageAnyProjects,
  canManageUsersAndRoles,
} from "../../../js/security/checks";

const SideMenuListContainer = ({ microMenu }) => {
  const { claims } = useStore()[0];
  const navigate = useNavigate();
  const projectManagementListItems = useState([
    {
      icon: <EqualizerOutlinedIcon />,
      label: "Overviews",
      onClick: () => navigate("/projects/overviews"),
    },
    {
      icon: <AddCircleOutlineOutlinedIcon />,
      label: "Add Project",
      onClick: () => navigate("/projects/add-new-project"),
    },
    {
      icon: <AccountTreeRoundedIcon />,
      label: "Manage Projects",
      onClick: () => navigate("/projects"),
    },
    {
      icon: <AccessTimeOutlinedIcon />,
      label: "Logs",
      onClick: () => navigate("/projects/logs"),
    },
  ])[0];
  const rolesManagementListItems = useState([
    {
      icon: <PeopleOutlinedIcon />,
      label: "Manage Users",
      onClick: () => navigate("/users/manage"),
    },

    {
      icon: <SecurityOutlinedIcon />,
      label: "Manage Roles",
      onClick: () => navigate("/roles"),
    },
    {
      icon: <AddModeratorOutlinedIcon />,
      label: "Assign Roles",
      onClick: () => navigate("/roles/users-roles"),
    },
  ])[0];
  const mySpaceListItems = useState([
    {
      icon: <CheckBoxOutlineBlankOutlinedIcon />,
      label: "My Projects",
      onClick: () => navigate("/me/projects"),
    },

    {
      icon: <BugReportRoundedIcon />,
      label: "My Tickets",
      onClick: () => navigate("/me/tickets"),
    },
    {
      icon: <AssignmentOutlinedIcon />,
      label: "My Tasks",
      onClick: () => navigate("/me/tasks/"),
    },
  ])[0];

  return (
    <List disablePadding>
      <Box sx={{ height: 55 }}>
        <ListItemButton component="a" href="/">
          <ListItemIcon>
            <EmojiNatureOutlinedIcon sx={{ width: 30, height: 30 }} />
          </ListItemIcon>
          <ListItemText
            sx={{ my: 0, display: microMenu ? "none" : "block" }}
            primary="Project Manager"
            primaryTypographyProps={{
              fontSize: 20,
              fontWeight: "medium",
              letterSpacing: 0,
              color: "primary",
            }}
          />
        </ListItemButton>
      </Box>

      <AdjustableListItemButton
        icon={<DashboardOutlinedIcon />}
        label="Dashboard"
        badgeColor="success"
        onClick={() => navigate("/")}
        micro={microMenu}
      />

      {/* manage project menu */}
      {canManageAnyProjects(claims) && (
        <CollapsableListGroup
          title="Projects"
          items={projectManagementListItems}
          micro={microMenu}
        />
      )}
      {/* manage users menu */}
      {canManageUsersAndRoles(claims) && (
        <CollapsableListGroup
          title="Users"
          items={rolesManagementListItems}
          micro={microMenu}
        />
      )}
      {/* my space menu */}
      <CollapsableListGroup
        title="My Space"
        items={mySpaceListItems}
        micro={microMenu}
      />
    </List>
  );
};

const CollapsableListGroup = ({ title, items, micro = false }) => {
  const navigate = useNavigate();
  const [expanded, setCollapsed] = React.useState(true);
  // grayish text displayed under the menu group main title
  const fetchSecondaryTitle = () => {
    const limit = 19;
    const st = items.reduce(
      (p, i, index) => (0 !== index ? p + ", " + i.label : i.label),
      ""
    );
    if (!st.length < limit) return st.slice(0, limit) + "...";
    return "st";
  };
  const titleSecondary = React.useState(fetchSecondaryTitle())[0];

  return (
    <Box>
      <Box
        sx={{
          bgcolor: expanded ? "rgba(71, 98, 130, 0.2)" : null,
          pb: expanded ? 2 : 0,
        }}
      >
        <ListItemButton
          sx={{ display: micro ? "none" : "flex" }}
          onClick={() => setCollapsed((prev) => !prev)}
        >
          <ListItemText
            primary={title}
            secondary={expanded ? null : titleSecondary}
          />
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {items &&
              items.map((i) => (
                <AdjustableListItemButton micro={micro} key={i.label} {...i} />
              ))}
          </List>
        </Collapse>
      </Box>
      <Divider />
    </Box>
  );
};

const AdjustableListItemButton = ({
  icon,
  label,
  badgeColor = "primary",
  badgeCount,
  onClick,
  micro = false,
}) => {
  return (
    <ListItemButton onClick={onClick}>
      <ListItemIcon>{icon ? icon : <BlockOutlinedIcon />}</ListItemIcon>

      {!micro && (
        <>
          <ListItemText
            primaryTypographyProps={{
              fontWeight: "500",
              variant: "body2",
            }}
            primary={label}
          />
          {badgeCount && (
            <Stack spacing={1} direction="row">
              <Chip
                color={badgeColor}
                size="small"
                label={badgeCount > 9 ? "9+" : badgeCount}
              />
            </Stack>
          )}
        </>
      )}
    </ListItemButton>
  );
};

export default SideMenuListContainer;
