import CardEnhenced from "../../components/cardEnhenced";

import Chart from "react-apexcharts";
import { useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { firestoreInstance } from "../../../js/services/firebase/firestore";
import { useState } from "react";
import {
  getTicketType,
  getTicketTypeId,
  TICKET_TYPE_BUG_ISSUE_CODE,
  TICKET_TYPE_OTHER_CODE,
  TICKET_TYPE_SUGGETION_FEATURE_CODE,
} from "../../../js/tickets.utils";
import { Box } from "@mui/material";
import TextEnhenced from "../../components/TextEnhenced";
const TicketsOverviewCard = ({ userId }) => {
  const [tickets, setTickets] = useState([]);
  useEffect(() => {
    const userTicketsColRef = collection(
      firestoreInstance,
      `/users/${userId}/tickets`
    );

    if (!userTicketsColRef) return;
    const unsub = onSnapshot(userTicketsColRef, (snap) => {
      snap.docChanges().forEach((docChange) => {
        const ticket = {
          id: docChange.doc.id,
          docRef: docChange.doc.ref,
          ...docChange.doc.data(),
        };
        switch (docChange.type) {
          case "added":
            setTickets((p) => [...p, ticket]);
            break;
          case "modified":
            setTickets((p) =>
              p.map((t) => (t.id !== docChange.doc.id ? t : ticket))
            );
            break;
          case "removed":
            setTickets((p) => p.filter((t) => t.id !== docChange.doc.id));
            break;

          default:
            break;
        }
      });
    });
  }, [userId]);

  const bugsCount = tickets.reduce(
    (prev, current) =>
      current.type === TICKET_TYPE_BUG_ISSUE_CODE ? ++prev : prev,
    0
  );
  const suggestionCount = tickets.reduce(
    (prev, current) =>
      current.type === TICKET_TYPE_SUGGETION_FEATURE_CODE ? ++prev : prev,
    0
  );
  const othersCount = tickets.reduce(
    (prev, current) =>
      current.type === TICKET_TYPE_OTHER_CODE ? ++prev : prev,
    0
  );
  const openCount = tickets.reduce(
    (prev, current) => (current.status === 1 ? ++prev : prev),
    0
  );
  const closedCount = tickets.reduce(
    (prev, current) => (current.status === 0 ? ++prev : prev),
    0
  );
  const highSeverityCount = tickets.reduce(
    (prev, current) => (current.severity === 2 ? ++prev : prev),
    0
  );
  const normalSeverityCount = tickets.reduce(
    (prev, current) => (current.severity === 1 ? ++prev : prev),
    0
  );
  const lowSeverityCount = tickets.reduce(
    (prev, current) => (current.severity === 0 ? ++prev : prev),
    0
  );
  return (
    <CardEnhenced
      primary={`${openCount + closedCount}  Ticket(s)`}
      secondary={`${openCount} Open ,${closedCount} Closed`}
    >
      <Box display="flex" flexDirection="row">
        <Chart
          options={{
            chart: {
              id: "tickets-by-type-bar",
            },
            xaxis: {
              categories: [
                getTicketType(TICKET_TYPE_BUG_ISSUE_CODE),
                getTicketType(TICKET_TYPE_SUGGETION_FEATURE_CODE),
                getTicketType(TICKET_TYPE_OTHER_CODE),
              ],
            },
            plotOptions: {
              bar: {
                borderRadius: 4,
                horizontal: true,
              },
            },
          }}
          series={[
            {
              name: "",

              data: [bugsCount, suggestionCount, othersCount],
            },
          ]}
          type="bar"
          width="400"
        />
        <Chart
          options={{
            chart: {
              id: "tickets-by-resolve-bar",
            },
            labels: ["High", "Normal", "Low"],
            colors: ["#f50000", "#c9c501", "#00ff88"],
          }}
          series={[highSeverityCount, normalSeverityCount, lowSeverityCount]}
          width="380"
          type="pie"
        />
      </Box>
    </CardEnhenced>
  );
};

export default TicketsOverviewCard;
