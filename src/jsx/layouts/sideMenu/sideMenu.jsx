import {
  Box,
  List,
  IconButton,
  Paper,
  createTheme,
  Button,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { breakpoints, styled } from "@mui/system";
import React, { useState } from "react";

import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";

import withAuth from "../../../js/hoc/withAuth";
import SideMenuHeader from "./sideMenuHeader";
import SideMenuListContainer from "./sideMenuListContainer";
import { useStore } from "../../../js/services/Context/StoreContext";
import { ThemeProvider } from "@emotion/react";

const NavBar = styled(Box)(({ theme, toggled, microMenu }) => {
  return {
    position: "sticky",
    top: 0,

    height: "100vh",

    boxShadow: "#00000037 0 0 5px 0",
    [theme.breakpoints.down("md")]: {
      display: toggled ? "block" : "none",
    },
    [theme.breakpoints.down("up")]: {
      width: microMenu ? "fit-content" : "256px",
    },

    "& .MuiListItemButton-root": {
      paddingLeft: 24,
      paddingRight: 24,
    },
    "& .MuiListItemIcon-root": {
      minWidth: 0,
      marginRight: microMenu ? 0 : 16,
    },
    "& .MuiSvgIcon-root": {
      fontSize: 20,
    },
  };
});

const SideMenu = () => {
  const { mobileSideMenuToggle } = useStore()[0];
  const navigate = useNavigate();
  const [openProjectsMenu, setOpenProjectsMenu] = React.useState(true);
  const [openOther, setOpenOther] = React.useState(true);
  const [microMenu, setMicroMenu] = useState(false);

  const openprojectsMenuHandleClick = () => {
    setOpenProjectsMenu(!openProjectsMenu);
  };
  const setOpenOtherHandleClick = () => {
    setOpenOther(!openOther);
  };

  const goTo = (url) => {
    navigate(url);
  };

  const handleMicroMenuToggle = () => {
    setMicroMenu((prev) => !prev);
  };
  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        height: "100%",
        display: "flex",
      }}
    >
      <ThemeProvider
        theme={createTheme({
          components: {
            MuiListItemButton: {
              defaultProps: {
                disableTouchRipple: true,
              },
            },
          },
          palette: {
            mode: "dark",
            primary: { main: "rgb(102, 157, 246)" },
            background: { paper: "rgb(36, 36, 36)" },
          },
        })}
      >
        <NavBar
          toggled={mobileSideMenuToggle}
          microMenu={microMenu}
          disablePadding
        >
          <Paper
            elevation={0}
            sx={{
              display: "flex",
              flexDirection: "column",
              flexWrap: "nowrap",

              maxWidth: 256,
              width: microMenu ? "fit-content" : 256,
              borderRadius: 0,
              height: "100%",
            }}
          >
            <SideMenuListContainer microMenu={microMenu} />
            <Button
              value={""}
              onClick={handleMicroMenuToggle}
              sx={{
                display: { sm: "none", md: "flex" },
                width: "100%",
                ml: "auto",
                height: "100%",
                justifyContent: "end",
                alignItems: "start",
                border: "none",
                "&.MuiButtonBase-root:hover": {
                  bgcolor: "transparent",
                },
              }}
              // disableElevation
              disableRipple
              disableTouchRipple
            >
              <ArrowBackIosNewOutlinedIcon />
            </Button>
          </Paper>
        </NavBar>
      </ThemeProvider>
    </Box>
  );
};

export default withAuth(SideMenu);
