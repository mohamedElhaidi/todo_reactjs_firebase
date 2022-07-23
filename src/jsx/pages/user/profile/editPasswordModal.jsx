import { useEffect, useState } from "react";
import { changeUserInfo } from "../../../../js/services/user";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  Icon,
  Input,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import LoadingOverlay from "../../../components/LoadingOverlay";

const EditPasswordModal = ({ open, handleClose, user }) => {
  const [loading, setLoading] = useState(false);
  const [taskFinished, setTaskFinished] = useState(false);
  const [globalErrorMessage, setGlobalErrorMessage] = useState(null);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpasswordError, setConfirmPasswordError] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(false);
    setTaskFinished(false);
    setGlobalErrorMessage(null);
    setPassword("");
    setPasswordError(false);
    setConfirmPassword("");
    setConfirmPasswordError(false);
  }, [open]);

  const handleSubmit = () => {
    setLoading(true);
    setPasswordError(false);
    setConfirmPasswordError(false);
    setGlobalErrorMessage(null);

    if (password.length < 8) {
      setGlobalErrorMessage("password is too short");
      setPasswordError(true);
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setGlobalErrorMessage("passwords now matching");
      setConfirmPasswordError(true);
      setLoading(false);
      return;
    }
    changeUserInfo({ password })
      .then(() => {
        setTaskFinished(true);
        setLoading(false);
      })
      .catch((err) => {
        setGlobalErrorMessage(err.message);
        setLoading(false);
      });
  };

  const handleCloseModal = () => {
    if (loading) return;
    handleClose(false);
  };

  if (!user) return;

  return (
    <Modal open={open} onClose={handleCloseModal}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          maxWidth: 500,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        {loading ? <LoadingOverlay /> : null}
        <Stack gap={2} p={2}>
          <Typography component="h1" variant="h5">
            Change Password
          </Typography>
          {globalErrorMessage ? (
            <Alert severity="error">{globalErrorMessage}</Alert>
          ) : null}
          <TextField
            label="Password"
            type="password"
            value={password}
            error={passwordError}
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
          <TextField
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            error={confirmpasswordError}
            onChange={(e) => setConfirmPassword(e.currentTarget.value)}
          />
          <Button variant="contained" onClick={handleSubmit}>
            Change password
          </Button>
        </Stack>
        {taskFinished ? (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",

              gap: 1,
              backgroundColor: "#ffffffb9",
              zIndex: 1,
            }}
          >
            <DoneOutlinedIcon sx={{ width: 80, height: 80 }} />
            <Typography component="h1" variant="h5">
              Successfuly Changed!
            </Typography>
          </Box>
        ) : null}
      </Box>
    </Modal>
  );
};

export default EditPasswordModal;
