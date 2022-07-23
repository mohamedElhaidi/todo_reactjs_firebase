import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Box, createTheme, CssBaseline, Paper } from "@mui/material";

import {
  authentificationInstance,
  onAuthStateChanged,
} from "../js/services/auth";

import NavBar from "./layouts/navbar/navBar";
import HomePage from "./pages/dashboard/dashboardPage";
import SideMenu from "./layouts/sideMenu/sideMenu";
import ProjectPage from "./pages/project/projectPage";
import TicketPage from "./pages/tickets/ticketPage";
import NewProjectPage from "./pages/project/new/newProjectPage";
import ProjectsListPage from "./pages/project/projectsListPage";

import LoginPage from "./pages/auth/login/loginPage";
import ManageRolesPage from "./pages/roles/manageRolesPage";
import AddRolePage from "./pages/roles/addRolePage";
import UsersRolesPage from "./pages/roles/usersRolesPage";
import TasksPage from "./pages/todo/task/tasksPage";

import StoreContext, { useStore } from "../js/services/Context/StoreContext";
import GlobalCustomThemeContext from "../js/services/Context/themeContext";
import ProfilePage from "./pages/user/profile/profilePage";
import TodoTestPage from "./test/testTodo.test";
import TodoPage from "./pages/todo/todoPage";
import RegistrationPage from "./pages/auth/registration/registrationPage";
import UserProjectsPage from "./pages/user/userProjectsPage";
import { collection, doc, Firestore, getDocs } from "firebase/firestore";
import { firestoreInstance } from "../js/services/firebase/firestore";
import UserTicketsPage from "./pages/user/userTicketsPage";
import UserTasksPage from "./pages/user/userTasksPage";
import ProjectsOverviewsPage from "./pages/project/overviews/projectsOverviewsPage";
import NotImplemented from "./pages/static/notImplemented";
import ManageUsersPage from "./pages/users/manageUsersPage";
import { SnackbarProvider } from "notistack";

function App() {
  const { user } = useStore()[0];
  return (
    <>
      <SetUpAuth />
      <GlobalCustomThemeContext>
        <Paper variant="none">
          <SnackbarProvider
            maxSnack={5}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
          >
            <Router>
              {/* resets default styling for dom elements */}
              <CssBaseline />

              <Routes>
                <Route path="/">
                  <Route path="projects">
                    <Route path="logs" element={<NotImplemented />} />
                    <Route
                      path="add-new-project"
                      element={<NewProjectPage />}
                    />
                    <Route
                      path="overviews"
                      element={<ProjectsOverviewsPage />}
                    />
                    <Route path=":projectId">
                      <Route path="tickets">
                        <Route path=":ticketId" element={<TicketPage />} />
                        {/* <Route index element={<TicketsListPage />} /> */}
                      </Route>
                      <Route path="todos">
                        <Route path=":todoId" element={<TodoPage />} />
                        {/* <Route index element={<TasksPage />} /> */}
                      </Route>
                      <Route index element={<ProjectPage />} />
                    </Route>
                    <Route index element={<ProjectsListPage />} />
                  </Route>
                  <Route path="/roles">
                    <Route path="add-role" element={<AddRolePage />} />
                    <Route path="users-roles" element={<UsersRolesPage />} />
                    <Route index element={<ManageRolesPage />} />
                  </Route>
                  <Route path="/users">
                    <Route path="manage" element={<ManageUsersPage />} />
                    <Route path=":userId">
                      <Route path="profile" element={<ProfilePage />} />
                    </Route>
                  </Route>
                  <Route path="/auth">
                    <Route path="login" element={<LoginPage />} />
                    <Route path="register" element={<RegistrationPage />} />
                  </Route>
                  <Route path="/me">
                    <Route
                      path="profile"
                      element={<ProfilePage user={user} />}
                    />
                    <Route path="projects" element={<UserProjectsPage />} />
                    <Route path="tickets" element={<UserTicketsPage />} />
                    <Route path="tasks" element={<UserTasksPage />} />
                  </Route>
                  <Route index element={<HomePage />} />
                </Route>
              </Routes>
            </Router>
          </SnackbarProvider>
        </Paper>
      </GlobalCustomThemeContext>
    </>
  );
}

export default withStore(App);

function withStore(Component) {
  return (props) => (
    <StoreContext>
      <Component {...props} />
    </StoreContext>
  );
}
const SetUpAuth = () => {
  const [store, setStore] = useStore();
  React.useEffect(() => {
    onAuthStateChanged(authentificationInstance, async (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User

        // get how many projects this user is assigned to
        const projectCount = (
          await getDocs(
            collection(firestoreInstance, `/users/${user.uid}/projects`)
          )
        ).size;

        // permissions
        const claims = (await user.getIdTokenResult()).claims;

        // updating store
        setStore({ ...store, claims, user, isAuth: true, projectCount });
      } else {
        // User is signed out
        setStore({ ...store, claims: null, user: null, isAuth: false });
      }
    });
  }, []);
};
