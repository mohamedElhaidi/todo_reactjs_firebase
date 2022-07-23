import { Alert, Box, Chip, IconButton, Stack } from "@mui/material";
import { collection, onSnapshot } from "firebase/firestore";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import withAuth from "../../../js/hoc/withAuth";
import { firestoreInstance } from "../../../js/services/firebase/firestore";
import { deleteARole } from "../../../js/services/roles";
import { EnhencedTableModified } from "../../components/EnhencedTableModified";
import LoadingOverlay from "../../components/LoadingOverlay";
import TitlePageWrap from "../../components/pageTitleWrap";
import RoleDetailsModal from "../../components/Modals/RoleDetailsModal";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import withSideMenuAndNavBar from "../../../js/hoc/withSideMenuAndNavBar";

const ManageRolesPage = () => {
  const [roles, setRoles] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState(null);
  const [selectedRoleId, setSelectedRoleId] = React.useState(null);

  const navigate = useNavigate();
  const goTo = (url) => {
    navigate(url);
  };

  useEffect(() => {
    onSnapshot(collection(firestoreInstance, "/roles"), async (snapshot) => {
      setLoading(true);
      snapshot.docChanges().forEach((docChange) => {
        switch (docChange.type) {
          case "added": {
            setRoles((prev) => [
              ...prev,
              { ...docChange.doc.data(), id: docChange.doc.id },
            ]);
            break;
          }
          case "removed": {
            setRoles((prev) => [
              ...prev.filter(({ id }) => docChange.doc.id !== id),
            ]);
            break;
          }
        }
      });
      setLoading(false);
    });
  }, []);
  const handleDeletion = async (roleIds) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      await Promise.all(
        roleIds.forEach(async (roleId) => {
          // const roleDocRef = doc(firestoreInstance, `/roles/${roleId}`);
          await deleteARole({ roleId });
          // console.log(roleDocRef);
        })
      );
    } catch (error) {
      console.error(error.message);
      setErrorMessage(error.message);
    }
    setLoading(false);
  };

  const handleRoleDetailsModalOpen = (roleId) => {
    setSelectedRoleId(roleId);
  };

  const createTableRow = (id, roleName, numberOfAssignment) => {
    return {
      id,
      roleName,
      numberOfAssignment,
      manageAction: {
        value: "",
        label: (
          <Chip
            size="small"
            label="Manage"
            onClick={() => handleRoleDetailsModalOpen(id)}
          />
        ),
      },
    };
  };
  return (
    <TitlePageWrap title="Managing Roles">
      <Box width="100%">
        <LoadingOverlay loading={loading} />

        <EnhencedTableModified
          tableTitle=""
          tableheadCells={[
            {
              id: "roleName",
              visible: true,
              disablePadding: true,
              sortable: true,
              label: "Role Name",
            },
            {
              id: "numberOfAssignment",
              visible: true,
              disablePadding: true,
              sortable: true,
              label: "Assignmenets",
            },
            {
              id: "manageAction",
              visible: true,
              disablePadding: true,
              sortable: false,
              label: "",
            },
          ]}
          rows={roles.map((r) =>
            createTableRow(r.id, r.name, r.numberOfAssignment)
          )}
          filters={["roleName", "numberOfAssignment"]}
          handleDeletion={handleDeletion}
          actionButtons={[
            <IconButton key={0} onClick={() => goTo("/roles/add-role")}>
              <AddBoxOutlinedIcon />
            </IconButton>,
          ]}
          selectable
        />
        <RoleDetailsModal
          roleId={selectedRoleId}
          open={Boolean(selectedRoleId)}
          handleClose={() => setSelectedRoleId(null)}
        />
      </Box>
    </TitlePageWrap>
  );
};

export default withAuth(withSideMenuAndNavBar(ManageRolesPage));
