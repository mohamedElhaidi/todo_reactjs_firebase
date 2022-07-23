import {
  Avatar,
  Box,
  Card,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";

import ArrowRightOutlinedIcon from "@mui/icons-material/ArrowRightOutlined";

// const dData = [
//   { icon: null, primary: "ToDo-app-reactJs", secondary: "3 members" },
//   { icon: null, primary: "Ecommerce-reactJs-php-sql", secondary: "3 members" },
// ];
const ProfileItemsList = ({ headIcon, title, data }) => {
  return (
    <>
      <Box display="flex" flexDirection="row" gap={1} alignItems="center">
        {headIcon}
        <Typography variant="h5" component="h2">
          {title}
        </Typography>
      </Box>
      <List dense>
        {data &&
          data.map((i, index) => {
            return (
              <ListItemButton
                sx={{
                  borderRadius: 1,
                }}
                key={index}
                onClick={i.onClick}
              >
                <ListItemIcon>
                  {i.icon || <ArrowRightOutlinedIcon />}
                </ListItemIcon>
                <ListItemText>{i.primary}</ListItemText>
                <Divider />
              </ListItemButton>
            );
          })}
      </List>
    </>
  );
};
export default ProfileItemsList;
