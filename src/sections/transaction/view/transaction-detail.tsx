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

import { fNumber } from 'src/utils/format-number';

import { DashboardContent } from 'src/layouts/dashboard'

import { Iconify } from 'src/components/iconify';

const TransactionDetail = () => {
  const locaton = useLocation();
  const navigate = useNavigate();
  const [initials, setInitials] = useState('');

  const { data } = locaton.state;

  console.log('TRANSACTION DATA JERE :::: ', data);

  useEffect(() => {
    if (data) {
      const initFN = data?.user?.first_name?.slice(0, 1);
      const initLN = data?.user?.last_name?.slice(0, 1);
      console.log('INFI FNAME :: ', initFN);
      console.log('INFI FNAME :: ', initLN);
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
        <Avatar sx={{ width: 128, height: 128, fontSize: 48 }} src={data?.user?.photoUrl}>
          {initials}
        </Avatar>
      </Box>

      <Toolbar />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Box>
            <Typography variant="body2">FIRST NAME</Typography>
            <Typography variant="h6">{data?.user?.first_name}</Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Box>
            <Typography variant="body2">LAST NAME</Typography>
            <Typography variant="h6">{data?.user?.last_name}</Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Box>
            <Typography variant="body2">EMAIL ADDRESS</Typography>
            <Typography variant="h6">{data?.user?.email_address}</Typography>
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Box>
            <Typography variant="body2">PHONE NUMBER</Typography>
            <Typography variant="h6">
              {data?.user?.phone_number}
            </Typography>
          </Box>
        </Grid>

       
        <Grid item xs={12} sm={6} md={4}>
          <Box>
            <Typography variant="body2">TRANSACTION ID</Typography>
            <Typography variant="h6">{data?._id}</Typography>
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Box>
            <Typography variant="body2">PRODUCT</Typography>
            <Typography variant="h6">{data?.marketplace?.title}</Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Box>
            <Typography variant="body2">AMOUNT</Typography>
            <Typography variant="h6">{`₦${fNumber(data?.marketplace?.amount)}`}</Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Box>
            <Typography variant="body2">PREVIEW</Typography>
            <img src={data?.marketplace?.images[0]} alt="capitalize" width={100} />
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


      </Grid>
    </DashboardContent>
  );
};

export default TransactionDetail;
