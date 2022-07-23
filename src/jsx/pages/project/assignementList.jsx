import AddCircleOutlineOutlined from "@mui/icons-material/AddCircleOutlineOutlined";
import { Chip, Avatar, Box, IconButton } from "@mui/material";

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers } from "../../../js/services/user";
import { EnhencedTableModified } from "../../components/EnhencedTableModified";

const tableheadCells = [
  {
    id: "name",
    visible: true,
    disablePadding: true,
    sortable: true,
    label: "Name",
  },

  {
    id: "viewProfileAction",
    visible: true,
    disablePadding: true,
    sortable: false,
    label: "",
  },
];

const AssignementList = ({ assignees, sx = {} }) => {
  const [rows, setRows] = React.useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    if (!assignees) return;
    setRows(assignees.map((m) => createRow(m)));
  }, [assignees]);

  const createRow = (member) => {
    return {
      id: member.id,
      name: member.name,
      viewProfileAction: {
        value: "",
        label: (
          <Chip
            size="small"
            label="Profile"
            onClick={() => navigate(`/users/${member.id}/profile`)}
          />
        ),
      },
    };
  };

  return (
    <Box sx={sx}>
      <EnhencedTableModified
        variant="outlined"
        tableTitle="Members"
        tableheadCells={tableheadCells}
        rows={rows}
        sx={{ maxWidth: "100%" }}
        handleDeletion={(e) => alert(e)}
        filters={["name", "roleName"]}
        dense
        // actionButtons={[
        //   <IconButton key={0}>
        //     <AddCircleOutlineOutlined />
        //   </IconButton>,
        // ]}
      />
    </Box>
  );
};

export default AssignementList;
