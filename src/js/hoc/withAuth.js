import React, { Children, Fragment, useEffect } from "react";
import LoginPage from "../../jsx/pages/auth/login/loginPage";
import { useStore } from "../services/Context/StoreContext";

function withAuth(Component) {
  return (props) => <AuthWrap Component={Component} p={props} />;
}

const AuthWrap = ({ Component, p }) => {
  const { isAuth, user } = useStore()[0];
  if (!isAuth && user !== null) return;
  console.log(`authenticated? %c${isAuth}`, "color:#0f5");
  if (!isAuth) {
    window.location.href = `/auth/login?redirect=${document.URL}`;
  }
  return isAuth ? <Component {...p} /> : <LoginPage />;
};

export default withAuth;
