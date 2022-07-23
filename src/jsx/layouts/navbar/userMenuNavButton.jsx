import { useStore } from "../../../js/services/Context/StoreContext";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";

import AdbIcon from "@mui/icons-material/Adb";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  ToggleButton,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { firestoreInstance } from "../../../js/services/firebase/firestore";
import { useNavigate } from "react-router-dom";
import { signUserOut } from "../../../js/services/auth";

const UserMenuNavButton = () => {
  const navigate = useNavigate();
  // user
  const { user } = useStore()[0];
  const [userPFP, setUserPFP] = useState("");

  // menu
  const [anchorElUser, setAnchorElUser] = useState();
  const [settings, setSettings] = useState([
    { name: "Profile", actionHanler: () => navigate("/me/profile") },
    { name: "Logout", actionHanler: () => signUserOut() },
  ]);

  const getUserProfilePicture = () => {
    getDoc(doc(firestoreInstance, "/users/" + user.uid)).then((snapshot) =>
      setUserPFP(snapshot.data().pfp)
    );
  };

  useEffect(() => {
    getUserProfilePicture();
  }, []);
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = (e) => {
    setAnchorElUser(false);
  };

  return user ? (
    <Box sx={{ flexGrow: 0 }}>
      <Tooltip title="Open settings">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar
            alt="Remy Sharp"
            src={userPFP}
            sx={{ width: 35, height: 35 }}
          />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: "45px" }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        {settings.map((setting) => (
          <MenuItem key={setting.name} onClick={setting.actionHanler}>
            <Typography textAlign="center">{setting.name}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  ) : (
    <Button color="inherit" href="/auth/login">
      Login
    </Button>
  );
};

export default UserMenuNavButton;
