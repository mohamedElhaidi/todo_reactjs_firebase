import {
  Box,
  Button,
  Card,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AdminIconIMG from "../../../../res/img/setting.png";
import DeveloperIconIMG from "../../../../res/img/web-development.png";
import ManagerIconIMG from "../../../../res/img/project-management.png";
import { useNavigate } from "react-router-dom";
import { loginUserWithGoogle, signInUser } from "../../../../js/services/auth";
import { useStore } from "../../../../js/services/Context/StoreContext";
import { getRedirectParam } from "../../../../js/utils";
import TitlePageWrap from "../../../components/pageTitleWrap";
import AccountCard from "../../../components/AccountCard";

const DemoPage = () => {
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
    <TitlePageWrap title="Login page">
      <Stack m="auto" maxWidth={600} pt={5} gap={5}>
        <Card variant="outlined">
          <Stack p={2} gap={2} alignItems="center">
            <Typography component="h1" variant="h5" fontWeight="bold">
              DEMO
            </Typography>
            <Typography component="p" textAlign="center">
              by using a demo account you are limited to only read and view
              content. any changes will not be applied
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={2} p={3}>
              <AccountCard onClick={handleSignInWithGoogle} variant="outlined">
                <img src={AdminIconIMG} />
                <Typography component="h1" variant="h5" fontWeight="bold">
                  Admin
                </Typography>
              </AccountCard>
              <AccountCard onClick={handleSignInWithGoogle} variant="outlined">
                <img src={ManagerIconIMG} />
                <Typography component="h1" variant="h5" fontWeight="bold">
                  Project Manager
                </Typography>
              </AccountCard>
              <AccountCard onClick={handleSignInWithGoogle} variant="outlined">
                <img src={DeveloperIconIMG} />
                <Typography component="h1" variant="h5" fontWeight="bold">
                  Developer
                </Typography>
              </AccountCard>
            </Box>
            <Link href="/auth/login">Sign in using email</Link>
          </Stack>
        </Card>
      </Stack>
    </TitlePageWrap>
  );
};

export default DemoPage;
