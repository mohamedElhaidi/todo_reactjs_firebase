import {
  Alert,
  Box,
  Button,
  Card,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import { loginUserWithGoogle, signInUser } from "../../../../js/services/auth";
import { useStore } from "../../../../js/services/Context/StoreContext";
import { getRedirectParam } from "../../../../js/utils";
import TitlePageWrap from "../../../components/pageTitleWrap";

const LoginPage = () => {
  const [error, setError] = useState(null);

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
      .catch((err) => {
        setError(err.message);
        console.log(err.message);
      });
  };

  const handleSignInWithGoogle = async () => {
    await loginUserWithGoogle();

    const redirectUrl = getRedirectParam();
    window.location.href = redirectUrl;
  };

  return (
    <TitlePageWrap title="Login page">
      <Stack m="auto" maxWidth={600} pt={5} gap={5}>
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
              <Typography component="h1" variant="h5" fontWeight="bold">
                Login page
              </Typography>
              {error && <Alert color="error">{error}</Alert>}
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
                google Account
              </Button>
              {/* <Link>Forgot password ?</Link> */}
              <Link href="/auth/register">Register</Link>
              <Link href="/auth/demo">Use a demo Account?</Link>
            </Box>
          </form>
        </Card>
      </Stack>
    </TitlePageWrap>
  );
};

export default LoginPage;
