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
import { assignRoleTo } from "../../../js/services/roles";
import LoadingOverlay from "../LoadingOverlay";

const userRoleEditModalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  backgroundColor: "#fff",
  boxShadow: 24,
};

export const UserRoleEditModal = ({
  roles,
  selectedUser,
  open,
  handleClose,
}) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState({});

  const applyUserRoleEditHandle = (roleId, userId) => {
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
  useEffect(() => {
    if (!roles || !selectedUser) return;
    const role = roles.find((r) => r.id === selectedUser.roleId);
    setSelectedRole(role);
  }, [selectedUser]);
  if (!open || !selectedUser || !roles) return null;
  return (
    <Modal open={open} onClose={handleClose}>
      <Card sx={userRoleEditModalStyle}>
        <Box sx={{ position: "relative" }}>
          {loading && <LoadingOverlay />}
          <Stack gap={2} sx={{ padding: 2 }}>
            <Typography component="h1" variant="h4">
              Set a role
            </Typography>
            <Typography>User name: {selectedUser.name}</Typography>
            <Typography>
              current role: {selectedUser.roleName || "-"}
            </Typography>
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
              disabled={
                !selectedRole || selectedRole.id === selectedUser.roleId
              }
              onClick={() =>
                applyUserRoleEditHandle(selectedRole.id, selectedUser.id)
              }
            >
              Apply
            </Button>
            <Button
              color="success"
              variant="contained"
              disabled={selectedUser.roleId ? true : false}
            >
              Unassign
            </Button>
          </Stack>
        </Box>
      </Card>
    </Modal>
  );
};
