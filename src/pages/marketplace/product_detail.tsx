/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable import/no-extraneous-dependencies */
import 'react-alice-carousel/lib/alice-carousel.css';

import React from 'react';
import { Helmet } from 'react-helmet-async';
import AliceCarousel from 'react-alice-carousel';
import { useLocation, useNavigate } from 'react-router-dom';

import { Box, Button, Toolbar, IconButton, Typography } from '@mui/material';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

const ProductDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state;

  const handleDragStart = (e: any) => e.preventDefault();

  const items = data?.images?.map((item: any) => (
    <Box
      key={item.id}
      onDragStart={handleDragStart}
      sx={{
        borderRadius: 2,
        backgroundImage: `url(${item})`,
        height: 500,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    />
    // <img src={item} onDragStart={handleDragStart} role="presentation" style={{maxHeight: 550}} width='75%' />
  ));

  return (
    <>
      <Helmet>
        <title> {`${data?.name ?? 'Product Info'} - ${CONFIG.appName}`}</title>
      </Helmet>

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
            <Typography px={1} variant="h4" flexGrow={1}>
              {data?.title ?? 'Title'}
            </Typography>
          </Box>
          <Button variant="contained" color="inherit" startIcon={<Iconify icon="mingcute:edit" />}>
            Update
          </Button>
        </Box>

        <Toolbar />

        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          width="100%"
          alignItems="center"
        >
          <Box width="80%">
            <AliceCarousel
              mouseTracking
              items={items}
              autoHeight={false}
              autoPlay
              responsive={{
                0: {
                  items: 1,
                },
                1024: {
                  items: 1,
                  itemsFit: 'contain',
                },
              }}
              innerWidth={200}
            />
          </Box>
          <Box p={2} />
          <Box width="100%">
            <Typography variant="h5" textAlign="left">
              Amount
            </Typography>
            <Typography variant="body2">NGN {data?.amount}</Typography>
            <Box p={1} />
            <Typography variant="h5" textAlign="left">
              Description
            </Typography>
            <Typography variant="body2">{data?.details}</Typography>
          </Box>
        </Box>
      </DashboardContent>
    </>
  );
};

export default ProductDetail;
