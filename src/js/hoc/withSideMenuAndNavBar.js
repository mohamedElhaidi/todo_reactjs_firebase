import { Box } from "@mui/material";
import React from "react";
import NavBar from "../../jsx/layouts/navbar/navBar";
import SideMenu from "../../jsx/layouts/sideMenu/sideMenu";
import { useStore } from "../services/Context/StoreContext";

function withSideMenuAndNavBar(Component) {
  return (props) => <Wrap Component={Component} p={props} />;
}

const Wrap = ({ Component, p }) => {
  const { isAuth, user } = useStore()[0];
  return (
    <Box component="div" sx={{ display: "flex", flexbasis: 1 }}>
      <SideMenu />
      <Box sx={{ flex: 3 }}>
        <NavBar user={user} />
        <Box
          width="100%"
          maxWidth="md"
          margin="auto"
          mt={2}
          display="flex"
          justifyContent="center"
        >
          <Component {...p} />
        </Box>
      </Box>
    </Box>
  );
};

export default withSideMenuAndNavBar;
