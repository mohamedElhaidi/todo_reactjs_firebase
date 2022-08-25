import {
  Badge,
  Box,
  darken,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Popover,
  Typography,
} from "@mui/material";
import * as React from "react";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { firestoreInstance } from "../../../js/services/firebase/firestore";
import { useStore } from "../../../js/services/Context/StoreContext";
import { useNavigate } from "react-router-dom";

import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";

const Notifictaion = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const id = React.useId();
  const { user, isAuth } = useStore()[0];
  const [notifications, setNotifications] = React.useState([]);
  const navigate = useNavigate();
  const handleClick = (event) => {
    setAnchorEl(!anchorEl ? event.currentTarget : null);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  React.useEffect(() => {
    if (!isAuth || !user) return;
    const notificationColRef = collection(
      firestoreInstance,
      `/users/${user.uid}/notifications`
    );
    const q = query(notificationColRef, orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snaps) => {
      snaps.docChanges().forEach((docChange) => {
        switch (docChange.type) {
          case "added":
            setNotifications((prev) => [
              {
                id: docChange.doc.id,
                docRef: docChange.doc.ref,
                ...docChange.doc.data(),
              },
              ...prev,
            ]);
            break;

          case "removed":
            setNotifications((prev) => [
              ...prev.filter((notif) => notif.id !== docChange.doc.id),
            ]);
            break;

          case "modified":
            setNotifications((prev) => [
              ...prev.map((notif) =>
                notif.id === docChange.doc.id
                  ? {
                      id: docChange.doc.id,
                      ...docChange.doc.data(),
                      docRef: docChange.doc.ref,
                    }
                  : notif
              ),
            ]);
            break;

          default:
            break;
        }
      });
    });
  }, [user]);

  const markNotifcationAsRead = (docRef) => {
    updateDoc(docRef, { read: true });
  };

  const handleNotificationItemClick = async (notification) => {
    markNotifcationAsRead(notification.docRef);
    navigate(notification.link);
    handleClose();
  };
  if (!isAuth || !user) return;
  const notificationCount = notifications.filter((n) => !n.read).length;
  return (
    <div>
      <IconButton aria-describedby={id} type="button" onClick={handleClick}>
        <Badge badgeContent={notificationCount} color="primary">
          <NotificationsNoneIcon />
        </Badge>
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        sx={{ mt: 5 }}
      >
        <Box
          sx={{
            width: 250,
            maxHeight: 350,
            overflow: "auto",
          }}
        >
          {notifications.length ? (
            <List>
              {notifications.map((notif) => (
                <ListItemButton
                  sx={{
                    backgroundColor: notif.read ? "#fff" : "#65c2f8a4",
                    "&:hover": {
                      backgroundColor: darken(
                        notif.read ? "#fff" : "#65c2f8a4",
                        0.2
                      ),
                    },
                  }}
                  onClick={() => handleNotificationItemClick(notif)}
                  key={notif.id}
                  disableRipple
                  disableTouchRipple
                >
                  <ListItemText
                    sx={{ marginTop: 1 }}
                    primaryTypographyProps={{ textTransform: "uppercase" }}
                    primary={notif.title}
                    secondary={notif.message}
                  />
                </ListItemButton>
              ))}
            </List>
          ) : (
            <Typography p={3}>No notifications</Typography>
          )}
        </Box>
      </Popover>
    </div>
  );
};

export default Notifictaion;
