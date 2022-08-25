import styled from "@emotion/styled";
import { Box, Modal, Paper } from "@mui/material";
import LoadingOverlay from "./LoadingOverlay";

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
const EnhencedModal = ({
  open,
  handleClose,
  children,
  sx,
  loading = false,
}) => {
  if (!open) return;
  return (
    <Modal
      open={open}
      onClose={() => {
        if (!loading) handleClose(false);
      }}
    >
      <InnerModalBox sx={sx}>
        <LoadingOverlay loading={loading} />
        {children}
      </InnerModalBox>
    </Modal>
  );
};

export default EnhencedModal;
