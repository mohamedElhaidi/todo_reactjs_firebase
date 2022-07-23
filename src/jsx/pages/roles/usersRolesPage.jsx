import {
  Autocomplete,
  Box,
  Button,
  Card,
  Chip,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import withAuth from "../../../js/hoc/withAuth";
import { firestoreInstance } from "../../../js/services/firebase/firestore";
import { assignRoleTo } from "../../../js/services/roles";
import { getUsersPublic } from "../../../js/services/users";
import { EnhencedTableModified } from "../../components/EnhencedTableModified";
import LoadingOverlay from "../../components/LoadingOverlay";
import TitlePageWrap from "../../components/pageTitleWrap";
import { UserRoleEditModal } from "../../components/Modals/userRoleEditModal";
import withSideMenuAndNavBar from "../../../js/hoc/withSideMenuAndNavBar";

const UsersRolesPage = () => {
  const [filter, setFilter] = useState("");
  const [userRoleEditModalToggle, setUserRoleEditModalToggle] = useState(false);

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  const [selectedUser, setSelectedUser] = useState(null);

  // runs once
  useEffect(() => {
    // Grab users
    onSnapshot(collection(firestoreInstance, "/users"), (snapshot) => {
      snapshot.docChanges().forEach(async (docChange) => {
        switch (docChange.type) {
          case "added":
            setUsers((prev) => [
              ...prev,
              { id: docChange.doc.id, ...docChange.doc.data() },
            ]);
            break;
          case "removed":
            setUsers((prev) => [
              ...prev.filter((r) => docChange.doc.id !== r.id),
            ]);
            break;
          case "modified":
            {
              setUsers((prev) =>
                prev.map((r) =>
                  docChange.doc.id === r.id
                    ? { id: docChange.doc.id, ...docChange.doc.data() }
                    : r
                )
              );
            }
            break;
          default:
            break;
        }
      });
    });
    // Grab roles
    onSnapshot(collection(firestoreInstance, "/roles"), (snapshot) => {
      snapshot.docChanges().forEach(async (docChange) => {
        switch (docChange.type) {
          case "added":
            setRoles((prev) => [
              ...prev,
              { id: docChange.doc.id, ...docChange.doc.data() },
            ]);
            break;
          case "removed":
            setRoles((prev) => [
              ...prev.filter((r) => docChange.doc.id !== r.id),
            ]);
            break;
          default:
            break;
        }
      });
    });
  }, []);

  const OpenEditUserRoleModalHandle = (userId) => {
    setSelectedUser(users.find((u) => u.id === userId));
    setUserRoleEditModalToggle(true);
  };
  const userRoleEditModalCloseHandle = () => {
    setSelectedUser(null);
    setUserRoleEditModalToggle(false);
  };

  const navigate = useNavigate();
  const createTableRow = (id, name, email, roleName) => {
    return {
      id,
      name,
      email,
      roleName,
      editAction: {
        value: "",
        label: (
          <Chip label="Edit" onClick={() => OpenEditUserRoleModalHandle(id)} />
        ),
      },
    };
  };
  return (
    <TitlePageWrap title="Assigning Roles">
      <Box sx={{ m: 2, p: 2 }}>
        <Stack>
          <EnhencedTableModified
            tableTitle=""
            tableheadCells={[
              {
                id: "name",
                visible: true,
                disablePadding: true,
                sortable: true,
                label: "Name",
              },
              {
                id: "email",
                visible: true,
                disablePadding: true,
                sortable: true,
                label: "email",
              },
              {
                id: "roleName",
                visible: true,
                disablePadding: true,
                sortable: true,
                label: "Role",
              },
              {
                id: "editAction",
                visible: true,
                disablePadding: true,
                sortable: false,
                label: "",
              },
            ]}
            rows={users.map((u) =>
              createTableRow(u.id, u.name, u.email, u.roleName)
            )}
            filters={["name", "email", "roleName"]}
            selectable={false}
          />
          <UserRoleEditModal
            roles={roles}
            open={userRoleEditModalToggle}
            handleClose={userRoleEditModalCloseHandle}
            selectedUser={selectedUser}
          />
        </Stack>
      </Box>
    </TitlePageWrap>
  );
};

export default withAuth(withSideMenuAndNavBar(UsersRolesPage));
