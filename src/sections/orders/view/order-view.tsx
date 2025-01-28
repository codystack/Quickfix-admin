import type { RootState } from 'src/redux/store';

import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { TabPanel, TabContext } from '@mui/lab';
import Typography from '@mui/material/Typography';
import { Tab, Tabs, Button, styled } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

import LaundryTable from './laundry';
import CarWashTable from './car-wash';
import CleaningTable from './cleaning';
import AllOrdersTable from './all-order';


// ---------------------------------------------------------------------

interface StyledTabsProps {
  children?: React.ReactNode;
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const StyledTabs = styled((props: StyledTabsProps) => (
  <Tabs {...props} TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }} />
))({
  '& .MuiTabs-indicator': {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  '& .MuiTabs-indicatorSpan': {
    maxWidth: 40,
    width: '100%',
    backgroundColor: '#7CE200',
  },
});

interface StyledTabProps {
  label: string;
}

const StyledTab = styled((props: StyledTabProps) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    textTransform: 'none',
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(1),
    color: 'rgba(255, 255, 255, 0.7)',
    '&.Mui-selected': {
      color: '#7CE200',
    },
    '&.Mui-focusVisible': {
      backgroundColor: 'rgba(100, 95, 228, 0.32)',
    },
  })
);

export function OrderView() {
  const navigate = useNavigate();
  const [value, setValue] = React.useState('0');
  const { cleaningOrders } = useSelector((state: RootState) => state.order);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(`${newValue}`);
  };

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Orders
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => navigate("/dashboard/orders/create")}
        >
          Place Order
        </Button>
      </Box>

      <Card>
        <TabContext value={value}>
          <Box sx={{ width: '100%' }}>
            <Box sx={{ bgcolor: '#06413D' }}>
              <StyledTabs
                value={parseInt(value, 10)}
                onChange={handleChange}
                aria-label="styled tabs example"
              >
                <StyledTab label="All" />
                <StyledTab label="Laundry" />
                <StyledTab label="Cleaning" />
                <StyledTab label="Car Wash" />
              </StyledTabs>
              <Box sx={{ p: 0.5 }} />
            </Box>
          </Box>
          <Box width="100%">
            <TabPanel value="0">
             <AllOrdersTable />
            </TabPanel>
            <TabPanel value="1">
              <LaundryTable />
            </TabPanel>
            <TabPanel value="2">
              <CleaningTable cleaningOrders={cleaningOrders} />
            </TabPanel>
            <TabPanel value="3">
              <CarWashTable />
            </TabPanel>
          </Box>
        </TabContext>
      </Card>
    </DashboardContent>
  );
}

