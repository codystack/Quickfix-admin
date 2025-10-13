import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  Box,
  Grid,
  Avatar,
  Toolbar,
  Divider,
  IconButton,
  Typography,
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

const AdminDetail = () => {
  const locaton = useLocation();
  const navigate = useNavigate();
  const [initials, setInitials] = useState('');

  const { data } = locaton.state;


  useEffect(() => {
    if (data) {
      const initFN = data?.first_name?.slice(0, 1);
      const initLN = data?.last_name?.slice(0, 1);
      setInitials(`${initFN}${initLN ?? ''}`);
    }
  }, [data]);

  return (
    <DashboardContent>
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
        </Box>

      </Box>

      <Box
        display="flex"
        marginTop={-5}
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
      >
        <Avatar sx={{ width: 128, height: 128, fontSize: 48 }} src={data?.photoUrl}>
          {initials}
        </Avatar>
      </Box>

      <Toolbar />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Box>
            <Typography variant="body2">FIRST NAME</Typography>
            <Typography variant="h6">{data?.first_name}</Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Box>
            <Typography variant="body2">LAST NAME</Typography>
            <Typography variant="h6">{data?.last_name}</Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Box>
            <Typography variant="body2">EMAIL ADDRESS</Typography>
            <Typography variant="h6">{data?.email_address}</Typography>
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Box>
            <Typography variant="body2">PHONE NUMBER</Typography>
            <Typography variant="h6">
              {data?.dial_code}
              {data?.phone_number}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Box>
            <Typography variant="body2">TYPE</Typography>
            <Typography variant="h6">{data?.type}</Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Box>
            <Typography variant="body2">ADMIN ID</Typography>
            <Typography variant="h6">{data?.id}</Typography>
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Box>
            <Typography variant="body2">ROLE</Typography>
            <Typography variant="h6">{data?.role}</Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Box>
            <Typography variant="body2">GENDER</Typography>
            <Typography variant="h6" textTransform="capitalize">
              {data?.gender}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Box>
            <Typography variant="body2">ACCESS</Typography>
            <Typography variant="h6">{data?.access ?? ''}</Typography>
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Box>
            <Typography variant="body2">ACCOUNT VERIFIED</Typography>
            <Typography variant="h6">{data?.is_email_verified ? 'True' : 'False'}</Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Box>
            <Typography variant="body2">KYC DONE</Typography>
            <Typography variant="h6" textTransform="capitalize">
              {data?.is_profile_set ? 'True' : 'False'}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Box>
            <Typography variant="body2">ADDRESS</Typography>
            <Typography variant="h6">{data?.address ?? ''}</Typography>
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Box>
            <Typography variant="body2">CREATION DATE</Typography>
            <Typography variant="h6">{new Date(data?.createdAt).toLocaleDateString('en-US')}</Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Box>
            <Typography variant="body2">LAST UPDATE</Typography>
            <Typography variant="h6" textTransform="capitalize">
              {new Date(data?.updatedAt).toLocaleDateString('en-US')}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Box>
            <Typography variant="body2">LAST LOGIN</Typography>
            <Typography variant="h6">{new Date(data?.last_login).toLocaleDateString('en-US')}</Typography>
          </Box>
        </Grid>
      </Grid>
    </DashboardContent>
  );
};

export default AdminDetail;
