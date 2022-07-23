import * as React from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import {
  Button,
  Checkbox,
  Chip,
  ClickAwayListener,
  Grow,
  IconButton,
  ListItem,
  MenuItem,
  MenuList,
  Paper,
  Popover,
  Popper,
  Stack,
  styled,
  Tooltip,
  Typography,
} from "@mui/material";
import { timeSince } from "../../../../js/utils";
import { useRef } from "react";
import { useState } from "react";

const StyledList = styled(List)(({ theme }) => {
  return {
    width: "100%",
    maxHeight: "500px",
    overflowX: "auto",
    bgcolor: "background.paper",
    border: "solid #00000036 1px",
    borderRadius: 1,

    "&.overlap": {
      border: "solid #000000 2px",
    },
  };
});
export const TodoStatusTasksList = ({
  undeletable,
  title,
  headerBgColor,
  headerTextColor,
  children,
  onUpClick,
  onDownClick,
  onDeleteClick,
  handleElementRef,
  ...props
}) => {
  const [collapsed, setCollapsed] = React.useState(true);

  const handleClick = () => {
    setCollapsed(!collapsed);
  };

  return (
    <StyledList
      component="nav"
      disablePadding
      ref={handleElementRef}
      {...props}
    >
      <ListItemButton
        sx={{
          position: "sticky",
          top: 0,
          bgcolor: headerBgColor,
          color: headerTextColor,
        }}
        disableRipple
      >
        {!undeletable && (
          <>
            <IconButton onClick={onUpClick}>
              <KeyboardArrowUpIcon sx={{ fill: headerTextColor }} />
            </IconButton>
            <IconButton onClick={onDownClick}>
              <KeyboardArrowDownIcon sx={{ fill: headerTextColor }} />
            </IconButton>
          </>
        )}
        <ListItemText primary={title.toUpperCase()} />
        {!undeletable && (
          <IconButton onClick={onDeleteClick}>
            <CloseIcon sx={{ fill: headerTextColor }} />
          </IconButton>
        )}

        {collapsed ? (
          <ExpandLess onClick={handleClick} />
        ) : (
          <ExpandMore onClick={handleClick} />
        )}
      </ListItemButton>
      <Collapse in={collapsed} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {children && children.length ? (
            children
          ) : (
            <ListItem>
              <ListItemText
                primary="NO TASKS"
                primaryTypographyProps={{ textAlign: "center" }}
              />
            </ListItem>
          )}
        </List>
      </Collapse>
    </StyledList>
  );
};

const StyledListItemButton = styled(ListItemButton)(({ theme }) => {
  return {
    maxWidth: "100%",

    "&.dragging": {
      // position: "fixed",
      backgroundColor: "#4d4d4d7f",
      color: "#fff",
      opacity: 100,
      zIndex: 99,
      // cursor: "-moz-grab",
      // cursor: "-webkit-grab",
      cursor: "grabbing",
    },
    "& .showOnHover": {
      display: "none",
    },
    "&:hover .showOnHover": {
      display: "block",
    },
  };
});

export const TodoStatusTasksListItem = ({
  onClick,
  task,
  handleToggleTaskFinish,
  handleDeletion,
  onUpClick,
  onDownClick,
  handleElementRef,
  ...props
}) => {
  const moreButtonRef = useRef(null);
  const [openMoreMenu, setOpenMoreMenu] = useState(false);

  const handleClose = () => {
    setOpenMoreMenu(false);
  };
  const handleListKeyDown = () => {
    setOpenMoreMenu(false);
  };

  const sevirtyBgColor =
    task.severity == 0 ? "#049aff" : task.severity == 1 ? "#c7b300" : "#f70404";
  const sevirtyLabel =
    task.severity == 0 ? "Low" : task.severity == 1 ? "Normal" : "High";
  return (
    <Tooltip title={""}>
      <StyledListItemButton
        ref={handleElementRef}
        sx={{ pl: 4, gap: 2 }}
        disableRipple
        {...props}
        draggable
      >
        <DragIndicatorIcon className="showOnHover" />
        <ListItemText
          onClick={onClick}
          sx={{ flex: 3 }}
          primary={task.title}
          secondary={task.createdAt ? timeSince(task.createdAt) : "NO DATE"}
          secondaryTypographyProps={{ variant: "caption" }}
          primaryTypographyProps={{
            noWrap: true,
            sx: {
              textDecoration: false ? "line-through" : null,
            },
          }}
        />

        <Stack direction="row" gap={2}>
          <Chip
            size="small"
            sx={{ backgroundColor: sevirtyBgColor, color: "#fff" }}
            label={sevirtyLabel}
          />
        </Stack>

        <IconButton
          ref={moreButtonRef}
          onClick={() => handleDeletion(task.id)}
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </StyledListItemButton>
    </Tooltip>
  );
};
