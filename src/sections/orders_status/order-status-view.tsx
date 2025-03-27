import type { RootState } from 'src/redux/store';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { TabPanel, TabContext } from '@mui/lab';
import { Tab, Tabs, styled } from '@mui/material';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';
import OrderStatusTable from './table';

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

export function OrderStatusView() {
  const [value, setValue] = React.useState('0');

  const {
    damagedOrders,
    declinedOrders,
    deliveredOrders,
    ironedOrders,
    packagedOrders,
    pendingOrders,
    washedOrders,
    completedOrders,
  } = useSelector((state: RootState) => state.order);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(`${newValue}`);
  };

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Orders Statuses
        </Typography>
        {/* <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          Schedule
        </Button> */}
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
                <StyledTab label="Pending" />
                <StyledTab label="Declined" />
                <StyledTab label="Washed" />
                <StyledTab label="Ironed" />
                <StyledTab label="Packaged" />
                <StyledTab label="Delivered" />
                <StyledTab label="Damaged" />
                <StyledTab label="Completed" />
              </StyledTabs>
              <Box sx={{ p: 0.5 }} />
            </Box>
          </Box>
          <Box width="100%">
            <TabPanel value="0">
              <OrderStatusTable data={pendingOrders} orderStatus="pending" />
            </TabPanel>
            <TabPanel value="1">
              <OrderStatusTable data={declinedOrders} orderStatus="declined" />
            </TabPanel>
            <TabPanel value="2">
              <OrderStatusTable data={washedOrders} orderStatus="washed" />
            </TabPanel>
            <TabPanel value="3">
              <OrderStatusTable data={ironedOrders} orderStatus="ironed" />
            </TabPanel>
            <TabPanel value="4">
              <OrderStatusTable data={packagedOrders} orderStatus="packaged" />
            </TabPanel>
            <TabPanel value="5">
              <OrderStatusTable data={deliveredOrders} orderStatus="delivered" />
            </TabPanel>
            <TabPanel value="6">
              <OrderStatusTable data={damagedOrders} orderStatus="damaged" />
            </TabPanel>
            <TabPanel value="7">
              <OrderStatusTable data={completedOrders} orderStatus="completed" />
            </TabPanel>
          </Box>
        </TabContext>
      </Card>
    </DashboardContent>
  );
}
