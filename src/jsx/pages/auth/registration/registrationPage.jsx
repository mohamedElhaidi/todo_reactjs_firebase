import { useState } from "react";
import { Link } from "react-router-dom";
import {
  loginUserWithGoogle,
  registerUser,
} from "../../../../js/services/auth";
import { getRedirectParam } from "../../../../js/utils";
import TitlePageWrap from "../../../components/pageTitleWrap";
import { Alert, Box, Button, TextField, Typography } from "@mui/material";

const RegistrationPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(null);
    const data = { name, email, password };
    registerUser(data)
      .then((r) => {
        console.info("user has been created successufly");
        const redirectUrl = getRedirectParam();
        window.location.href = redirectUrl;
      })
      .catch((message) => {
        setError(message);
      });
  };

  const handleSignInWithGoogle = async () => {
    await loginUserWithGoogle();
    const redirectUrl = getRedirectParam();
    window.location.href = redirectUrl;
  };
  return (
    <TitlePageWrap title="Registration page">
      <Box m="auto" maxWidth={500} pt={5}>
        <form onSubmit={handleSubmit}>
          <Box
            p={2}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography component="h1" variant="h5">
              Registration page
            </Typography>

            {error && <Alert>{error}</Alert>}
            <TextField
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
              size="small"
              label="name"
              variant="outlined"
            />
            <TextField
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              size="small"
              label="Email"
              variant="outlined"
            />
            <TextField
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              size="small"
              label="Password"
              variant="outlined"
            />
            <Button type="submit" variant="contained" color="success">
              Register
            </Button>
            <Button
              onClick={handleSignInWithGoogle}
              variant="contained"
              color="error"
            >
              google Account
            </Button>

            <Link to="/auth/login">or login</Link>
          </Box>
        </form>
      </Box>
    </TitlePageWrap>
  );
};

export default RegistrationPage;
