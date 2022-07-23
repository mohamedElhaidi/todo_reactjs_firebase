import TextEnhenced from "./TextEnhenced";

const { Card, Typography, Box } = require("@mui/material");

const CardEnhenced = ({ primary, secondary, children }) => {
  return (
    <Card>
      <Box p={2}>
        <Box>
          <TextEnhenced text={primary} variant="h5" component="h2" />
          <TextEnhenced
            text={secondary}
            sx={{ color: "#00000088" }}
            variant="body1"
            component="h2"
          />
        </Box>
        {children}
      </Box>
    </Card>
  );
};

export default CardEnhenced;
