import { Box, Typography } from "@mui/material";
import withAuth from "../../../js/hoc/withAuth";
import withSideMenuAndNavBar from "../../../js/hoc/withSideMenuAndNavBar";

const NotImplemented = () => {
  return (
    <Box>
      <Typography variant="h1" component="h1">
        This feature is not impelemted yet.
      </Typography>
    </Box>
  );
};

export default withAuth(withSideMenuAndNavBar(NotImplemented));
