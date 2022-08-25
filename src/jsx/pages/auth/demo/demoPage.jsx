import { Box, Card, Link, Stack, Typography } from "@mui/material";
import { loginUserWithGoogle, signInUser } from "../../../../js/services/auth";
import { getRedirectParam } from "../../../../js/utils";
import TitlePageWrap from "../../../components/pageTitleWrap";
import AccountCard from "../../../components/AccountCard";

import AdminIconIMG from "../../../../res/img/setting.png";
import DeveloperIconIMG from "../../../../res/img/webdev.png";
import ManagerIconIMG from "../../../../res/img/pm.png";

const creds = [
  {
    email: "admin@demo.com",
    password: "123456789",
  },
  {
    email: "admin@demo.com",
    password: "123456789",
  },
];
const DemoPage = () => {
  const handleDemoLogin = async (cred) => {
    signInUser(cred)
      .then(() => {
        const redirectUrl = getRedirectParam();
        window.location.href = redirectUrl;
      })
      .catch((err) => {
        console.log(err.message);
      });
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
              <AccountCard
                onClick={() => handleDemoLogin(creds[0])}
                variant="outlined"
              >
                <img src={AdminIconIMG} />
                <Typography component="h1" variant="h5" fontWeight="bold">
                  Admin
                </Typography>
              </AccountCard>

              <AccountCard
                onClick={() => handleDemoLogin(creds[1])}
                variant="outlined"
              >
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
