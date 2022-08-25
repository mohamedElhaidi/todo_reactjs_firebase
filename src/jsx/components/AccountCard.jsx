import styled from "@emotion/styled";
import { Card } from "@mui/material";

const AccountCard = styled(Card)({
  display: "flex",
  flexDirection: "column",
  padding: "5px",
  alignItems: "center",
  justifyContent: "center",
  width: "250px",
  height: "250px",
  ":hover": {
    backgroundColor: "#7557c949",
    cursor: "pointer",
  },
  "& img": {
    width: "80px",
    height: "80px",
  },
});

export default AccountCard;
