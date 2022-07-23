import styled from "@emotion/styled";
import { Box, Modal, Paper } from "@mui/material";

const InnerModalBox = styled(Paper)(({ theme }) => {
  return {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: theme.paper,
    boxShadow: 24,
    maxHeight: "80vh",
    overflow: "auto",
  };
});
const EnhencedModal = ({ open, handleClose, children, sx }) => {
  if (!open) return;
  return (
    <Modal open={open} onClose={() => handleClose(false)}>
      <InnerModalBox sx={sx}>{children}</InnerModalBox>
    </Modal>
  );
};

export default EnhencedModal;
