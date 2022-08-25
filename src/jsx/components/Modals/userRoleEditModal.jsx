import {
  Autocomplete,
  Box,
  Button,
  Card,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { assignRoleTo, unassignRoleFrom } from "../../../js/services/roles";
import EnhencedModal from "../EnhencedModal";

export const UserRoleEditModal = ({
  roles,
  selectedUser,
  open,
  handleClose,
}) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState({});

  const applyRoleHandle = (roleId, userId) => {
    console.log(roleId, userId);
    setLoading(true);
    assignRoleTo({ roleId, userId })
      .then(({ data }) => {
        handleClose(false);
        enqueueSnackbar(data.message, { variant: "success" });
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
        enqueueSnackbar(err.message, { variant: "error" });
        setLoading(false);
      });
  };
  const unassignRoleHandle = (roleId, userId) => {
    console.log(roleId, userId);
    setLoading(true);
    unassignRoleFrom({ roleId, userId })
      .then(({ data }) => {
        handleClose(false);
        enqueueSnackbar(data.message, { variant: "success" });
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
        enqueueSnackbar(err.message, { variant: "error" });
        setLoading(false);
      });
  };
  useEffect(() => {
    if (!roles || !selectedUser) {
      return;
    }
    const role = roles.find((r) => r.id === selectedUser.roleId);
    setSelectedRole(role);
  }, [selectedUser]);
  if (!open || !selectedUser || !roles) return null;
  if (!roles) {
    enqueueSnackbar("add some roles first", { variant: "info" });
    return;
  }

  console.log(Boolean());
  return (
    <EnhencedModal open={open} handleClose={handleClose} loading={loading}>
      <Stack gap={2} sx={{ padding: 2 }}>
        <Typography component="h1" variant="h4">
          Set a role
        </Typography>
        <Typography>User name: {selectedUser.name}</Typography>
        <Typography>current role: {selectedUser.roleName || "-"}</Typography>
        <Autocomplete
          sx={{ flex: 1 }}
          size="small"
          id="users-el"
          options={roles}
          defaultValue={roles.find((r) => r.id === selectedUser.roleId)}
          onChange={(e, value) => setSelectedRole(value)}
          getOptionLabel={(option) => (option ? option.name : null)}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Roles"
              placeholder="select a role..."
            />
          )}
        />
        <Button
          color="success"
          variant="contained"
          disabled={!selectedRole || selectedRole.id === selectedUser.roleId}
          onClick={() => applyRoleHandle(selectedRole.id, selectedUser.id)}
        >
          Apply
        </Button>
        {selectedUser.roleId ? (
          <Button
            color="success"
            variant="contained"
            onClick={() =>
              unassignRoleHandle(selectedUser.roleId, selectedUser.id)
            }
          >
            Unassign
          </Button>
        ) : null}
      </Stack>
    </EnhencedModal>
  );
};
