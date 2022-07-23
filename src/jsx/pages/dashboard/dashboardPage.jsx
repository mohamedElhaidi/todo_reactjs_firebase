import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import withAuth from "../../../js/hoc/withAuth";
import TitlePageWrap from "../../components/pageTitleWrap";
import withSideMenuAndNavBar from "../../../js/hoc/withSideMenuAndNavBar";

import { Card, Typography } from "@mui/material";
import { Box } from "@mui/system";
import CardEnhenced from "../../components/cardEnhenced";
import TicketsOverviewCard from "./ticketsOverviewCard";
import { useStore } from "../../../js/services/Context/StoreContext";
import TasksOverviewCard from "./tasksOverviewCard";

const HomePage = () => {
  const { user } = useStore()[0];
  return (
    <TitlePageWrap title="Dashboard">
      <Box display="flex" flexDirection="column" gap={2}>
        <TicketsOverviewCard userId={user.uid} />
        <TasksOverviewCard userId={user.uid} />
      </Box>
    </TitlePageWrap>
  );
};

export default withAuth(withSideMenuAndNavBar(HomePage));
