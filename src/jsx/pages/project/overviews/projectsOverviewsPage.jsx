import { useEffect, useState } from "react";
import withAuth from "../../../../js/hoc/withAuth";
import withSideMenuAndNavBar from "../../../../js/hoc/withSideMenuAndNavBar";
import CardEnhenced from "../../../components/cardEnhenced";

import Chart from "react-apexcharts";
import { collection, onSnapshot } from "firebase/firestore";
import { firestoreInstance } from "../../../../js/services/firebase/firestore";
const ProjectsOverviewsPage = () => {
  const [projects, setProjects] = useState([]);
  const [opentasks, setOpenTasks] = useState({ name: "", data: [] });
  const [closedtasks, setClosedTasks] = useState({ name: "", data: [] });
  const [opentickets, setOpenTickets] = useState({ name: "", data: [] });
  const [closedtickets, setClosedTickets] = useState({ name: "", data: [] });

  useEffect(() => {
    const projectsColRef = collection(firestoreInstance, `/projects/`);

    if (!projectsColRef) return;
    const unsub = onSnapshot(projectsColRef, (snap) => {
      snap.docChanges().forEach((docChange) => {
        const project = {
          id: docChange.doc.id,
          docRef: docChange.doc.ref,
          ...docChange.doc.data(),
        };
        switch (docChange.type) {
          case "added":
            setProjects((p) => [...p, project]);
            break;
          case "modified":
            setProjects((p) =>
              p.map((t) => (t.id !== docChange.doc.id ? t : project))
            );
            break;
          case "removed":
            setProjects((p) => p.filter((t) => t.id !== docChange.doc.id));
            break;

          default:
            break;
        }
      });
    });
    return () => {
      unsub();
    };
  }, []);

  useEffect(() => {
    if (!projects.length) return;
    setOpenTickets({
      name: "open tickets",
      data: projects.map((p) => p.tickets.openCount),
    });
    setClosedTickets({
      name: "closed tickets",
      data: projects.map((p) => p.tickets.closedCount),
    });
    setOpenTasks({
      name: "open tasks",
      data: projects.map((p) => p.tasks.openTasksCount),
    });
    setClosedTasks({
      name: "closed tasks",
      data: projects.map((p) => p.tasks.closedTasksCount),
    });
  }, [projects]);

  console.log(projects);
  if (!projects.length) return;
  return (
    <CardEnhenced title="Your Tasks">
      <Chart
        options={{
          chart: {
            id: "basic-bar",
          },
          xaxis: {
            categories: projects.map((project) => project.name),
          },
          plotOptions: {
            bar: {
              borderRadius: 4,
              horizontal: true,
            },
          },
        }}
        series={[opentasks, closedtasks, opentickets, closedtickets]}
        type="bar"
        width="500"
      />
    </CardEnhenced>
  );
};

export default withAuth(withSideMenuAndNavBar(ProjectsOverviewsPage));
