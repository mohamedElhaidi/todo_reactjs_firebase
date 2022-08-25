import ScoreCard from "./scoreCard";
import UserDetailedInfoCard from "./userDetailedInfoCard";
import { Box, Button, Card, Paper } from "@mui/material";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { firestoreInstance } from "../../../../js/services/firebase/firestore";
import ProfileItemsList from "./profileItemsList";
import EditProfileModal from "../../../components/Modals/editProfileModal";
import EditPasswordModal from "../../../components/Modals/editPasswordModal";
import withAuth from "../../../../js/hoc/withAuth";
import TitlePageWrap from "../../../components/pageTitleWrap";
import withSideMenuAndNavBar from "../../../../js/hoc/withSideMenuAndNavBar";

const ProfilePage = ({ user: userAuth }) => {
  const [openEditProfileModal, setOpenEditProfileModal] = useState(false);
  const [openEditPasswordModal, setOpenEditPasswordModal] = useState(false);
  const [fetchedUser, setFetchedUser] = useState({});
  const [projectsAssignedRows, setProjectsAssignedRows] = useState([]);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!params.userId && !userAuth) return;
    const uid = userAuth ? userAuth.uid : params.userId;
    const userDocRef = doc(firestoreInstance, "/users/" + uid);
    const userProjectsColRef = collection(
      firestoreInstance,
      "/users/" + uid + "/projects"
    );
    const unsubUserDocChangeListener = onSnapshot(
      userDocRef,
      (doc) => {
        setFetchedUser({ id: doc.id, ...doc.data() });
      },
      (err) => console.log(err.message)
    );

    const unsubUserProjectsColChangeListener = onSnapshot(
      userProjectsColRef,
      (snap) => {
        snap.docChanges().forEach((docChange) => {
          switch (docChange.type) {
            case "added":
              setProjectsAssignedRows((prev) => [
                ...prev,
                {
                  id: docChange.doc.data().id,
                  primary: docChange.doc.data().name,
                  onClick: () =>
                    navigate(`/projects/${docChange.doc.data().id}`),
                },
              ]);
              break;
            case "removed":
              setProjectsAssignedRows((prev) =>
                prev.filter((p) => p.id !== docChange.doc.data().id)
              );
              break;

            default:
              break;
          }
        });
      }
    );
    return () => {
      unsubUserDocChangeListener();
      unsubUserProjectsColChangeListener();
    };
  }, [userAuth]);
  return (
    <TitlePageWrap title={userAuth ? "My Profile" : fetchedUser.name}>
      <Paper variant="none">
        <Box p={5} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { md: "row", sm: "column" },
              gap: 3,
              width: "100%",
            }}
          >
            <Card variant="outlined" sx={{ p: 2, flex: 2 }}>
              <UserDetailedInfoCard
                pfp={fetchedUser.pfp}
                name={fetchedUser.name}
                email={fetchedUser.email}
                createdAt={fetchedUser.createdAt}
              />
              {userAuth && (
                <>
                  <Button onClick={() => setOpenEditProfileModal(true)}>
                    Edit
                  </Button>
                  <Button onClick={() => setOpenEditPasswordModal(true)}>
                    change password
                  </Button>
                </>
              )}
            </Card>
            <Card
              variant="outlined"
              sx={{ p: 2, flex: 1, height: "100%", overflow: "auto" }}
            >
              <ScoreCard
                projects={fetchedUser.projectsCount}
                finishedTickets={fetchedUser.finishedTicketsCount}
                openTickets={fetchedUser.ticketsCount}
                finishedTasks={fetchedUser.finishedTasksCount}
                openTasks={fetchedUser.tasksCount}
              />
            </Card>
          </Box>
          <Box>
            <Card
              variant="outlined"
              sx={{ display: "flex", flexDirection: "column", p: 2 }}
            >
              <Box>
                <ProfileItemsList
                  headIcon={<AccountTreeOutlinedIcon />}
                  data={projectsAssignedRows}
                  title="Projects"
                />
              </Box>
            </Card>
          </Box>
        </Box>
        <EditProfileModal
          open={openEditProfileModal}
          handleClose={setOpenEditProfileModal}
          user={fetchedUser}
        />
        <EditPasswordModal
          open={openEditPasswordModal}
          handleClose={setOpenEditPasswordModal}
          user={fetchedUser}
        />
      </Paper>
    </TitlePageWrap>
  );
};

export default withAuth(withSideMenuAndNavBar(ProfilePage));
