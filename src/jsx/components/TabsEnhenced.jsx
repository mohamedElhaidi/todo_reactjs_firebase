import { useState } from "react";
import { Box, Card, Tab, Tabs } from "@mui/material";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const TabsEnhenced = ({ tabHeads, children, tabHeadProps, tabPanelProps }) => {
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Card>
      <Tabs value={value} onChange={handleChange}>
        {tabHeads &&
          tabHeads.map((head, index) => (
            <Tab
              key={index}
              icon={head.icon}
              iconPosition={head.iconPosition}
              label={head.label}
              {...tabHeadProps}
            />
          ))}
      </Tabs>
      {children &&
        children.map((child, index) => (
          <Box
            hidden={value !== index}
            key={index}
            value={value}
            index={index}
            {...tabPanelProps}
          >
            {child}
          </Box>
        ))}
    </Card>
  );
};

export default TabsEnhenced;
