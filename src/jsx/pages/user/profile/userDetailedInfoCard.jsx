import { useState } from "react";
import { timeSince } from "../../../../js/utils";
import LoadingOverlay from "../../../components/LoadingOverlay";
import {
  Avatar,
  Card,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Box } from "@mui/system";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import AlternateEmailOutlinedIcon from "@mui/icons-material/AlternateEmailOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";

const UserDetailedInfoCard = ({ name, email, pfp, createdAt }) => {
  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <Box>
        <Avatar src={pfp} sx={{ width: 150, height: 150 }} />
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <BadgeOutlinedIcon />
            </ListItemIcon>
            <ListItemText>{name ? name : "*unknown*"}</ListItemText>
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemIcon>
              <AlternateEmailOutlinedIcon />
            </ListItemIcon>
            <ListItemText>{email ? email : "*unknown*"}</ListItemText>
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemIcon>
              <AccessTimeOutlinedIcon />
            </ListItemIcon>
            <ListItemText>
              Joined {createdAt ? timeSince(createdAt) : "*unknown*"}
            </ListItemText>
          </ListItem>
        </List>
      </Box>
    </Box>
  );
};

export default UserDetailedInfoCard;
