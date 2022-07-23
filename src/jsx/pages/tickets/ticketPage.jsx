import React from "react";
import { useParams } from "react-router-dom";
import TicketDetailsSection from "./ticketSection";

import { Box, Card, Stack, Tab, Tabs, Typography } from "@mui/material";
import withAuth from "../../../js/hoc/withAuth";
import TitlePageWrap from "../../components/pageTitleWrap";
import TicketComments from "./ticketComments";
import withSideMenuAndNavBar from "../../../js/hoc/withSideMenuAndNavBar";
import HistoryTable from "../common/historyTable";
import TicketAttachements from "./attachements";
import TabsEnhenced from "../../components/TabsEnhenced";

import AttachFileIcon from "@mui/icons-material/AttachFile";
import CommentIcon from "@mui/icons-material/Comment";
import { useState } from "react";

const TicketPage = () => {
  const params = useParams();
  const [commentCounts, setCommentCounts] = useState(0);
  const handleCommentCountChanged = (count) => {
    setCommentCounts(count);
  };
  return (
    <TitlePageWrap title="Ticket ">
      <Box display="flex" flexDirection="column" width="100%" p={2} gap={1}>
        <Stack component="div" direction="row" elevation={0} gap={1}>
          <TicketDetailsSection
            ticketId={params.ticketId}
            projectId={params.projectId}
          />
        </Stack>
        <TabsEnhenced
          tabHeads={[
            {
              icon: <AttachFileIcon />,
              iconPosition: "start",
              label: "Attachements",
            },
            {
              icon: <CommentIcon />,
              iconPosition: "start",
              label: `Comments ${commentCounts}`,
            },
          ]}
        >
          <Box>
            <TicketAttachements
              ticketId={params.ticketId}
              projectId={params.projectId}
            />
          </Box>
          <Box>
            <TicketComments
              ticketId={params.ticketId}
              projectId={params.projectId}
              onCommentCountChanged={handleCommentCountChanged}
            />
          </Box>
        </TabsEnhenced>

        <Card>
          <Box p={2}>
            <Box>Edit History</Box>
            <HistoryTable
              firestorePath={`/projects/${params.projectId}/tickets/${params.ticketId}/history`}
            />
          </Box>
        </Card>
      </Box>
    </TitlePageWrap>
  );
};

export default withAuth(withSideMenuAndNavBar(TicketPage));
