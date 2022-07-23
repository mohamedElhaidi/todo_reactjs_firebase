import { Skeleton, Typography } from "@mui/material";

const TextEnhenced = ({ text, noWrap, component, variant, ...props }) => {
  return (
    <Typography
      noWrap={noWrap}
      component={component}
      variant={variant}
      {...props}
    >
      {text || text instanceof Number ? text : <Skeleton animation="wave" />}
    </Typography>
  );
};

export default TextEnhenced;
