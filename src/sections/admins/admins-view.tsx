
import React from 'react';
import { useNavigate } from 'react-router-dom';

import Card from '@mui/material/Card';
import { Box, Button, IconButton, Typography } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import CustomizedDialog from 'src/components/dialog';

import AddAdmin from './add_admin';
import AllAdminsTable from './admin-table';

// ----------------------------------------------------------------------

export function AdminsView() {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  return (
    <DashboardContent>
      <CustomizedDialog
        open={open}
        setOpen={setOpen}
        title="Add New Admin"
        body={<AddAdmin setOpen={setOpen} />}
      />
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        mb={5}
        width="100%"
      >
        <Box display="flex" flexDirection="row" alignItems="center" justifyContent="start">
          <IconButton onClick={() => navigate(-1)}>
            <Iconify icon="eva:arrow-back-fill" />
          </IconButton>
          <Typography variant="h4" flexGrow={1}>
            Admins
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => setOpen(true)}
        >
          New admin
        </Button>
      </Box>

      <Box p={1} />
      <Card sx={{ p: 1 }}>
        <AllAdminsTable />
      </Card>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------
