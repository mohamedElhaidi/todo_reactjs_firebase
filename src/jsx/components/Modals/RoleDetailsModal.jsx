import React, { useEffect } from "react";
import { firestoreInstance } from "../../../js/services/firebase/firestore";
import { assignRoleTo, unassignRoleFrom } from "../../../js/services/roles";
import { EnhencedTableModified } from "../EnhencedTableModified";

import {
  Button,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import EnhencedModal from "../EnhencedModal";
import { permissionGroups } from "../../../js/security/authorisation";
import UsersAutocompleteList from "../../form/usersAutocompleteList";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
  p: 4,
};

const RoleDetailsModal = ({ roleId, open, handleClose }) => {
  const [roleName, setRoleName] = React.useState("");
  const [permissions, setPermissions] = React.useState([]);
  // autocomplete
  const [selectedUser, setSelectedUser] = React.useState(null);
  //   all users
  const [users, setUsers] = React.useState([]);
  // users with this role
  const [usersWithThisRole, setUsersWithThisRole] = React.useState([]);

  const handleUserAutocompleteSuccess = (user) => {};
  const handleUserAutocompleteFailure = () => {};
  const handleUserAutocompleteSelectionChange = (user) => {
    if (user) setSelectedUser(user);
  };
  const fetchPermissionsData = (role) => {
    permissionGroups.forEach((group) => {
      group.permissions.forEach((p) => {
        if (!role.permissions[p.code]) return;
        const per_obj = {
          label: p.label,
          code: p.code,
          value: role.permissions[p.code],
        };
        setPermissions((prev) => [...prev, per_obj]);
      });
    });
  };

  useEffect(() => {
    if (!roleId) return;

    const roleDocRef = doc(firestoreInstance, `/roles/${roleId}`);
    getDoc(roleDocRef)
      .then(async (roleSnapshot) => {
        const role = roleSnapshot.data();
        if (!role) return;
        fetchPermissionsData(role);
        setRoleName(role.name);
      })
      .catch((err) => console.error(err));
  }, [roleId]);

  //  whenever the roleId is changed we grab users that has that role id
  useEffect(() => {
    if (!roleId) return;
    // reset
    setUsersWithThisRole([]);
    // get users with this role id
    const UsersColRef = collection(firestoreInstance, "/users");
    const getAllUsersWithThisRoleQuery = query(
      UsersColRef,
      where("roleId", "==", roleId)
    );

    // get users with this role
    const unsubscribeListenerUsersWithThisRole = onSnapshot(
      getAllUsersWithThisRoleQuery,
      (querySnapshot) => {
        querySnapshot.docChanges().forEach((docChange) => {
          switch (docChange.type) {
            case "added":
              setUsersWithThisRole((prev) => [
                ...prev,
                { id: docChange.doc.id, ...docChange.doc.data() },
              ]);
              break;
            case "removed":
              setUsersWithThisRole((prev) =>
                prev.filter((u) => u.id !== docChange.doc.id)
              );
              break;

            default:
              break;
          }
        });
      }
    );

    return () => {
      unsubscribeListenerUsersWithThisRole();
    };
  }, [open]);

  const handleRoleAssignment = () => {
    if (!selectedUser || !roleId) return;

    const selectedUserId = selectedUser.id;
    assignRoleTo({ userId: selectedUserId, roleId })
      .then((result) => console.log(result))
      .catch((error) => console.error(error.message));
  };
  const handleRoleUnassignment = (usersIds) => {
    if (!usersIds.length || !roleId) return;

    usersIds.forEach((uid) =>
      unassignRoleFrom({ userId: uid, roleId })
        .then((result) => console.log(result))
        .catch((error) => console.error(error.message))
    );
  };

  const createUserTableRow = (id, name, email) => {
    return {
      id,
      name,
      email,

      viewAction: {
        value: "",
        label: (
          <Chip size="small" label="Remove" onClick={() => alert("weeew")} />
        ),
      },
    };
  };
  return (
    <EnhencedModal open={open} handleClose={handleClose}>
      <Box
        display="flex"
        flexDirection={{ sm: "column", md: "row" }}
        gap={2}
        p={3}
      >
        <Box sx={{ width: "500px" }}>
          <Typography id="role-name" variant="overline" component="div">
            id: {roleId}
          </Typography>
          <Typography id="role-name" variant="h6" component="div">
            Name: <TextField variant="outlined" size="small" value={roleName} />
          </Typography>
          <Stack>
            {permissions &&
              permissions.map((permission) => (
                <FormControlLabel
                  key={permission.code}
                  control={<Switch checked={permission.value} />}
                  label={permission.label}
                />
              ))}
          </Stack>
        </Box>
        <Box display="flex" flexDirection="column" gap={2}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              gap: 2,
            }}
          >
            <UsersAutocompleteList
              sx={{ flex: 1 }}
              value={selectedUser}
              disabled={false}
              onFetchSucceeded={handleUserAutocompleteSuccess}
              onFetchFailed={handleUserAutocompleteFailure}
              handleSelectionChange={handleUserAutocompleteSelectionChange}
            />
            <Button
              variant="contained"
              color="success"
              onClick={handleRoleAssignment}
            >
              Add
            </Button>
          </Box>
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
                label: "Email",
              },

              {
                id: "viewAction",
                visible: false,
                // not imp
                disablePadding: false,
                label: "",
              },
            ]}
            rows={usersWithThisRole.map((user) =>
              createUserTableRow(user.id, user.name, user.email)
            )}
            filters={["name", "email"]}
            handleDeletion={handleRoleUnassignment}
          />
        </Box>
      </Box>
    </EnhencedModal>
  );
};

export default RoleDetailsModal;
