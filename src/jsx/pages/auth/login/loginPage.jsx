import {
  Box,
  Button,
  Card,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUserWithGoogle, signInUser } from "../../../../js/services/auth";
import { useStore } from "../../../../js/services/Context/StoreContext";
import { getRedirectParam } from "../../../../js/utils";

const LoginPage = () => {
  const { isAuth, user } = useStore()[0];
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    const Credential = {
      email: e.target["email"].value,
      password: e.target["password"].value,
    };

    signInUser(Credential)
      .then((data) => {
        const redirectUrl = getRedirectParam();
        window.location.href = redirectUrl;
      })
      .catch((err) => console.log(err.message));
  };

  const handleSignInWithGoogle = async () => {
    await loginUserWithGoogle();

    const redirectUrl = getRedirectParam();
    window.location.href = redirectUrl;
  };

  return (
    <Box m="auto" maxWidth={500} pt={5}>
      <Card variant="outlined">
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
              Login page
            </Typography>

            <TextField
              size="small"
              id="email"
              label="Email"
              variant="outlined"
            />
            <TextField
              size="small"
              id="password"
              label="Password"
              type="password"
              variant="outlined"
            />
            <Button type="submit" variant="contained">
              Login
            </Button>
            <Button
              onClick={handleSignInWithGoogle}
              variant="contained"
              color="error"
            >
              use google Account
            </Button>
            <Button onClick={() => {}} variant="contained" color="secondary">
              use Github
            </Button>
            <Link>Forgot password ?</Link>
            <Link href="/auth/register">Register</Link>
          </Box>
        </form>
      </Card>
    </Box>
  );
};

export default LoginPage;
