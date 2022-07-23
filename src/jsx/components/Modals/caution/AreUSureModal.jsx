import { Button, Typography } from "@mui/material";
import EnhencedModal from "../../EnhencedModal";

const AreUSureModal = ({ message, handleYes, handleNo, handleCancel }) => {
  return (
    <EnhencedModal>
      <Typography vairant="body1" component="p">
        {message ? message : "Are you sure?"}
      </Typography>
      <Button variant="outlined" color="secondary">
        Yes
      </Button>
      <Button variant="contained" color="error">
        Cancel
      </Button>
    </EnhencedModal>
  );
};

export default AreUSureModal;
