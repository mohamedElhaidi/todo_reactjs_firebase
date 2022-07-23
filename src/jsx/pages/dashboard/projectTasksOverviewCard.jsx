import CardEnhenced from "../../components/cardEnhenced";

import Chart from "react-apexcharts";
import { useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { firestoreInstance } from "../../../js/services/firebase/firestore";
import { useState } from "react";

const ProjectTasksOverviewCard = ({ userId }) => {
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
  return (
    <CardEnhenced title="Your Tasks">
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
        width="500"
      />
    </CardEnhenced>
  );
};

export default ProjectTasksOverviewCard;
