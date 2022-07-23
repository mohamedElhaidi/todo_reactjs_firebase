import { async } from "@firebase/util";
import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormGroup,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import withAuth from "../../../js/hoc/withAuth";
import withSideMenuAndNavBar from "../../../js/hoc/withSideMenuAndNavBar";
import { permissionGroups } from "../../../js/security/authorisation";
import { createNewRole } from "../../../js/services/roles";
import LoadingOverlay from "../../components/LoadingOverlay";
import TitlePageWrap from "../../components/pageTitleWrap";

const AddRolePage = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState(null);
  const [roleName, setRoleName] = React.useState("");
  const [nameLimit, setNameLimit] = React.useState(50);
  const [permissions, setPermissions] = React.useState(null);

  // runs once
  // insert permissions values into a state
  useEffect(() => {
    let permissions = {};
    permissionGroups.forEach((group) => {
      group.permissions
        .map((permission) => permission.code)
        .forEach((code) => (permissions[code] = false));
    });
    console.log(permissions);
    setPermissions(permissions);
  }, []);

  const handleValueChange = (name, value) => {
    const tempValues = { ...permissions };
    tempValues[name] = value;
    setPermissions(tempValues);
    console.log(tempValues);
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (typeof roleName !== "string") {
      setErrorMessage("Role name is Invalid");
      setLoading(false);
      return;
    }
    if (!roleName.length) {
      setErrorMessage("Role name is Empty");
      setLoading(false);
      return;
    } else if (roleName.length > nameLimit) {
      setErrorMessage("Role name is too long");
      setLoading(false);
      return;
    }
    try {
      const { data } = await createNewRole({ roleName, permissions });
      enqueueSnackbar(data.message, { variant: "success" });
      goTo("/roles");
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error.message, { variant: "error" });
      setLoading(false);
    }
  };
  const navigate = useNavigate();
  const goTo = (url) => {
    navigate(url);
  };
  if (!permissions) return;
  return (
    <TitlePageWrap title="adding a new Role">
      <Card variant="outlined" sx={{ position: "relative", px: 2 }}>
        <Box p={2}>
          <LoadingOverlay loading={loading} />
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

          <TextField
            value={roleName}
            onChange={(e, v) => {
              if (e.target.value.length <= nameLimit)
                setRoleName(e.target.value);
            }}
            label="name"
            size="small"
            placeholder="name the role"
          />
          <Box>
            {permissionGroups.map((group) => (
              <FormGroup>
                <Typography component="h2" variant="h5">
                  {group.name}
                </Typography>
                {group.permissions.map((permission) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={permissions[permission.code]}
                        onChange={(e) =>
                          handleValueChange(permission.code, e.target.checked)
                        }
                      />
                    }
                    label={permission.label}
                  />
                ))}
              </FormGroup>
            ))}
          </Box>
          <Stack direction="row" gap={2} p={2}>
            <Button onClick={handleSubmit} variant="contained">
              Create
            </Button>
            <Button variant="outlined">Reset</Button>
          </Stack>
        </Box>
      </Card>
    </TitlePageWrap>
  );
};

export default withAuth(withSideMenuAndNavBar(AddRolePage));
