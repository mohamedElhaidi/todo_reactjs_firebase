import { ListItem } from "@mui/material";
import { styled } from "@mui/system";

export const SideMenuListItem = styled(ListItem)(({ theme }) => {
  return {
    "& .css-tlelie-MuiListItemText-root": {
      [theme.breakpoints.down("md")]: {
        display: "none",
      },
    },
  };
});
