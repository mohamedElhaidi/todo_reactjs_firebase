import * as React from "react";
import { signUserOut } from "../../../js/services/auth";
import { doc, getDoc } from "firebase/firestore";
import { firestoreInstance } from "../../../js/services/firebase/firestore";
import { useNavigate } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import MenuItem from "@mui/material/MenuItem";
import { MaterialUISwitch } from "../../components/styled/modeSwitch";
import { useStore } from "../../../js/services/Context/StoreContext";
import withAuth from "../../../js/hoc/withAuth";
import UserMenuNavButton from "./userMenuNavButton";
import Notifictaion from "./notification";
import TextEnhenced from "../../components/TextEnhenced";

const NavBar = () => {
  const [store, setStore] = useStore();
  const navigate = useNavigate();

  const handleToggleSideMenu = (event) => {
    setStore({ ...store, mobileSideMenuToggle: !store.mobileSideMenuToggle });
  };
  const handleOpenSideMenu = (event) => {
    setStore({ ...store, mobileSideMenuToggle: true });
  };

  const handleCloseSideMenu = () => {
    setStore({ ...store, mobileSideMenuToggle: false });
  };

  // fixes the switch value issue when refreshing page to get the right dark mode value
  const getDarkModeSwitchValue = () => {
    if (store && typeof store.darkMode === "boolean") return store.darkMode;
    if (localStorage.getItem("darkMode"))
      return Boolean(Number(localStorage.getItem("darkMode")));

    return false;
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        background: "#000000d2",
        backdropFilter: "blur(15px)",
        boxShadow: "none",
        borderBottom: "#465feeb1 solid 1px",
      }}
    >
      <Container sx={{ minHeight: 0 }} maxWidth="100%">
        <Toolbar
          sx={{ height: 55, minHeight: { sm: 0, md: 0 }, width: "100%" }}
          disableGutters
        >
          <Box sx={{ flexGrow: 0, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleToggleSideMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          </Box>
          <TextEnhenced
            text={store.pageTitle}
            variant="h6"
            noWrap
            component="a"
            onClick={() => navigate("/")}
            sx={{
              mr: 2,
              display: { flexGrow: 1, xs: "flex", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              cursor: "pointer",
              color: "inherit",
              textDecoration: "none",
            }}
          ></TextEnhenced>

          <MaterialUISwitch
            checked={getDarkModeSwitchValue()}
            onChange={(e) =>
              setStore({ ...store, darkMode: e.currentTarget.checked })
            }
          />
          <Notifictaion />
          <UserMenuNavButton />
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default withAuth(NavBar);
