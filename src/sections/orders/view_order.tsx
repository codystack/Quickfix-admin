import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Box, Grid, Avatar, Toolbar, Divider, IconButton, Typography } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { fNumber } from 'src/utils/format-number';

const OrderDetail = () => {
  const locaton = useLocation();
  const navigate = useNavigate();
  const [initials, setInitials] = useState('');

  const { data } = locaton.state;

  console.log('USER DATA JERE :::: ', data);
  console.log('DISCOUNT VALUE :::: ', data?.discount);
  console.log('ORIGINAL AMOUNT :::: ', data?.originalAmount);

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
        <Avatar sx={{ width: 128, height: 128, fontSize: 48 }} src={data?.photoUrl}>
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

      <Box sx={{ my: 1 }} />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Box>
            <Typography variant="body2">PHONE NUMBER</Typography>
            <Typography variant="h6">0{data?.user?.phone_number}</Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Box>
            <Typography variant="body2">LAST LOGIN</Typography>
            <Typography variant="h6">
              {new Date(data?.user?.last_login).toLocaleDateString('en-US')}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Box>
            <Typography variant="body2">USER ID</Typography>
            <Typography variant="h6">{data?.id}</Typography>
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Box>
            <Typography variant="body2">ORDER NUMBER</Typography>
            <Typography variant="h6">{data?.order_id}</Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Box>
            <Typography variant="body2">AMOUNT</Typography>
            <Typography variant="h6" textTransform="capitalize">
              {`₦${fNumber(data?.amount)}`}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Box>
            <Typography variant="body2">ORDER STATUS</Typography>
            <Typography variant="h6" textTransform="capitalize">
              {data?.status ?? ''}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ my: 1 }} />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Box>
            <Typography variant="body2">SERVICE</Typography>
            <Box display="flex" flexDirection="row" alignItems="center">
              <img src={data?.service?.icon_url} alt="" width={48} />
              <Box p={0.5} />
              <Typography variant="h6">{data?.service?.title}</Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Box>
            <Typography variant="body2">SERVICE CATEGORY</Typography>
            <Typography variant="h6" textTransform="capitalize">
              {data?.service?.category}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Box>
            <Typography variant="body2">LOCATION</Typography>
            <Typography variant="h6" textTransform="capitalize">
              {`${data?.location?.city}, ${data?.location?.region}`}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Box>
            <Typography variant="body2">DELIVERY TYPE</Typography>
            <Typography variant="h6" textTransform="capitalize">
              {`${data?.deliver_type ?? ""}`}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Box>
            <Typography variant="body2">DELIVERY FEE</Typography>
            <Typography variant="h6" textTransform="capitalize">
            {`₦${fNumber(data?.delivery_fee)}`}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      <Box>
        <Typography variant="body2" gutterBottom>
          ITEMS ORDERED
        </Typography>
        {data?.items?.map((item: any, index: number) => (
          <Box key={index} p={1} display="flex" justifyContent="space-between">
            <Typography>{item?.name}</Typography>
            <Typography>{`₦${fNumber(item?.price)} x ${
              item?.quantity
            } = ₦${fNumber(item.price * item.quantity)}`}</Typography>
          </Box>
        ))}
        {(data?.discount > 0 || data?.originalAmount > data?.amount) && (
          <Box p={1} display="flex" justifyContent="space-between">
            <Typography sx={{ color: 'error.main', fontWeight: 'bold' }}>
              Discount ({data?.discount || Math.round(((data?.originalAmount - data?.amount) / data?.originalAmount) * 100)}%)
            </Typography>
            <Typography sx={{ color: 'error.main', fontWeight: 'bold' }}>
              -₦{fNumber(data?.originalAmount ? (data?.originalAmount - data?.amount) : (data?.discount ? data.amount * (data.discount / (100 - data.discount)) : 0))}
            </Typography>
          </Box>
        )}
      </Box>

      <Divider sx={{ my: 4 }} />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Box>
            <Typography variant="body2">CREATION DATE</Typography>
            <Typography variant="h6">
              {new Date(data?.createdAt).toLocaleDateString('en-US')}
            </Typography>
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

export default OrderDetail;
