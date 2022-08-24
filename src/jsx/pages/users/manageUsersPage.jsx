import { Box, Chip } from "@mui/material";
import { collection, getDocs, onSnapshot, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import withAuth from "../../../js/hoc/withAuth";
import withSideMenuAndNavBar from "../../../js/hoc/withSideMenuAndNavBar";
import { firestoreInstance } from "../../../js/services/firebase/firestore";
import { timeSince } from "../../../js/utils";
import { EnhencedTableModified } from "../../components/EnhencedTableModified";
import EditProfileModal from "../../components/Modals/editProfileModal";

const ManageUsersPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  useEffect(() => {
    const usersColRef = collection(firestoreInstance, "/users");

    const unsub = onSnapshot(usersColRef, (snap) => {
      snap.docChanges().forEach((docChange) => {
        const user = { id: docChange.doc.id, ...docChange.doc.data() };
        switch (docChange.type) {
          case "added":
            setUsers((p) => [...p, user]);
            break;
          case "modified":
            setUsers((p) =>
              p.map((u) => (u.id !== docChange.doc.id ? u : user))
            );
            break;
          case "removed":
            setUsers((p) => p.filter((u) => u.id !== docChange.doc.id));
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

  const handleOpenUserEdit = (user) => {
    setSelectedUser(user);
  };

  const handleOpenUserView = (user) => {
    navigate(`/users/${user.id}`);
  };

  const createRow = (user) => {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      roleName: user.roleName,
      createdAt: {
        label: timeSince(user.createdAt),
        value: user.createdAt,
      },
      createdAt: {
        label: timeSince(user.createdAt),
        value: user.createdAt,
      },
      viewAction: {
        label: (
          <Chip
            size="small"
            label="view"
            onClick={() => handleOpenUserView(user)}
          />
        ),
        value: "",
      },
      manageAction: {
        label: (
          <Chip
            size="small"
            label="Manage"
            onClick={() => handleOpenUserEdit(user)}
          />
        ),
        value: "",
      },
    };
  };
  return (
    <Box width="100%">
      <EnhencedTableModified
        tableTitle=""
        tableheadCells={[
          {
            id: "name",
            visible: true,
            align: "left",
            disablePadding: true,
            sortable: true,
            label: "name",
          },
          {
            id: "email",
            visible: true,
            align: "left",
            disablePadding: true,
            sortable: true,
            label: "email",
          },
          {
            id: "roleName",
            visible: true,
            disablePadding: true,
            sortable: true,
            label: "Role",
          },
          {
            id: "createdAt",
            visible: true,
            disablePadding: true,
            sortable: true,
            label: "registered",
          },
          {
            id: "viewAction",
            visible: true,
            disablePadding: true,
            sortable: true,
            label: "",
          },
          {
            id: "manageAction",
            visible: true,
            disablePadding: true,
            sortable: true,
            label: "",
          },
        ]}
        rows={users.map((user) => createRow(user))}
        sx={{ maxWidth: "100%" }}
        // handleDeletion={(ids) => handleDeletion(ids)}
        filters={["name", "roleName"]}
        selectable={true}
        // actionButtons={[
        //   <IconButton key={0} onClick={() => handleAddNewTask()}>
        //     <AddCircleOutlineOutlined />
        //   </IconButton>,
        // ]}
      />
      <EditProfileModal
        user={selectedUser}
        open={Boolean(selectedUser)}
        handleClose={() => setSelectedUser(null)}
      />
    </Box>
  );
};

export default withAuth(withSideMenuAndNavBar(ManageUsersPage));
