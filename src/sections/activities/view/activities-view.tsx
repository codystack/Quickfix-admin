import React from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

import ActivitiesTable from './activities-table';

// ----------------------------------------------------------------------

export function ActivitiesView() {
  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Activities
        </Typography>
      </Box>

      <Card sx={{ p: 1 }}>
        <ActivitiesTable />
      </Card>
    </DashboardContent>
  );
}
