import CardEnhenced from "../../components/cardEnhenced";

import Chart from "react-apexcharts";
import { useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { firestoreInstance } from "../../../js/services/firebase/firestore";
import { useState } from "react";
import TextEnhenced from "../../components/TextEnhenced";
import { Box } from "@mui/material";

const TasksOverviewCard = ({ userId }) => {
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    const userTasksColRef = collection(
      firestoreInstance,
      `/users/${userId}/tasks`
    );

    if (!userTasksColRef) return;
    const unsub = onSnapshot(userTasksColRef, (snap) => {
      snap.docChanges().forEach((docChange) => {
        const task = {
          id: docChange.doc.id,
          docRef: docChange.doc.ref,
          ...docChange.doc.data(),
        };
        switch (docChange.type) {
          case "added":
            setTasks((p) => [...p, task]);
            break;
          case "modified":
            setTasks((p) =>
              p.map((t) => (t.id !== docChange.doc.id ? t : task))
            );
            break;
          case "removed":
            setTasks((p) => p.filter((t) => t.id !== docChange.doc.id));
            break;

          default:
            break;
        }
      });
    });
  }, [userId]);

  const finishedCount = tasks.reduce(
    (prev, current) => (current.status === 0 ? ++prev : prev),
    0
  );
  const openedCount = tasks.reduce(
    (prev, current) => (current.status !== 0 ? ++prev : prev),
    0
  );

  const highSeverityCount = tasks.reduce(
    (prev, current) => (current.severity === 2 ? ++prev : prev),
    0
  );
  const normalSeverityCount = tasks.reduce(
    (prev, current) => (current.severity === 1 ? ++prev : prev),
    0
  );
  const lowSeverityCount = tasks.reduce(
    (prev, current) => (current.severity === 0 ? ++prev : prev),
    0
  );
  return (
    <CardEnhenced
      primary={`${finishedCount + openedCount} Tasks(s)`}
      secondary={`${openedCount} In progress ,${finishedCount} Finished`}
    >
      <Box display="flex" flexDirection="row">
        <Chart
          options={{
            chart: {
              id: "basic-bar",
            },
            xaxis: {
              categories: ["Finished", "In progress"],
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
              data: [finishedCount, openedCount],
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

export default TasksOverviewCard;
