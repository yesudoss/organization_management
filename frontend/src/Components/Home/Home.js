import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MenuAppBar from './MenuAppBar';
import Organization from '../Organization/Organization';
import UserProfile from '../Profile/UserProfile';
import { getUserData } from '../Base/helper/helper';
import UpdatePassword from '../Profile/UpdatePassword';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function Home() {
  const userData = getUserData()
  const [value, setValue] = React.useState(0);
  console.log(value)

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <MenuAppBar />
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Profile" {...a11yProps(0)} />
          <Tab label="Password Update" {...a11yProps(1)} />
          {userData?.is_superuser && <Tab label="Organizations" {...a11yProps(2)} />}
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <UserProfile />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <UpdatePassword />
      </CustomTabPanel>
      {userData?.is_superuser && <CustomTabPanel value={value} index={2}>
        <Organization />
      </CustomTabPanel>}
    </Box>
  );
}