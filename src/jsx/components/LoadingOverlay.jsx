import { Box, CircularProgress } from "@mui/material";

const LoadingOverlay = ({ loading, value }) => {
  if (!loading) return;
  return (
    <Box
      sx={{
        position: "absolute",
        backgroundColor: "#ffffff5c",
        width: "100%",
        height: "100%",
        zIndex: "99",
      }}
    >
      <CircularProgress
        color="secondary"
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(50%,50%)",
        }}
        variant={value ? "determinate" : "indeterminate"}
        value={value}
      />
    </Box>
  );
};

export default LoadingOverlay;
