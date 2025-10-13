import type { RootState } from 'src/redux/store';

import React from 'react';
import { useSelector } from 'react-redux';

import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

import { RecentOrders } from '../recent_orders';
import { AnalyticsCurrentVisits } from '../analytics-current-visits';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { AdminRoles, AdminType } from 'src/utils/enums';

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  const { profile, wallet } = useSelector((state: RootState) => state.auth);
  const { users } = useSelector((state: RootState) => state.user);
  const { revenue } = useSelector((state: RootState) => state.transaction);
  const { orders, carWashOrders, cleaningOrders, laundryOrders, pendingOrders } = useSelector(
    (state: RootState) => state.order
  );

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Hi, Welcome back 👋
      </Typography>

      <Grid container spacing={3}>
        {profile && profile?.role === AdminRoles.MANAGER && profile?.type === AdminType.SUPER_ADMIN && (
          <Grid xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              title="Revenue Amount"
              percent={-parseFloat(`${wallet?.prev_balance ?? 0.0}`)}
              total={parseFloat(`${revenue?.charges ?? 0.0}`)}
              color="error"
              icon={<img alt="icon" src="/assets/icons/glass/ic-glass-message.svg" />}
              chart={{
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                series: [56, 47, 40, 62, 73, 30, 23, 54],
              }}
            />
          </Grid>
        )}
        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Users"
            percent={-0.1}
            total={users?.totalItems}
            color="secondary"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-users.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [56, 47, 40, 62, 73, 30, 23, 54],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Orders"
            percent={2.6}
            total={orders?.totalItems}
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-bag.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [22, 8, 35, 50, 82, 84, 77, 12],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Pending Orders"
            percent={3.6}
            total={pendingOrders?.totalItems}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-buy.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [56, 30, 23, 54, 47, 40, 62, 73],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <RecentOrders
            title="Recent Orders"
            subheader="Most recent orders here"
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
              series: [
                { name: 'Team A', data: [43, 33, 22, 37, 67, 68, 37, 24, 55] },
                { name: 'Team B', data: [51, 70, 47, 67, 40, 37, 24, 70, 24] },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsCurrentVisits
            title="Service Engagements"
            chart={{
              series: [
                { label: 'Laundry', value: laundryOrders?.totalItems ?? 0 },
                { label: 'Cleaning', value: cleaningOrders?.totalItems ?? 0 },
                { label: 'Car Wash', value: carWashOrders?.totalItems ?? 0 },
              ],
            }}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
