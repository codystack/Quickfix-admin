import { Box, Button, IconButton, Typography } from '@mui/material';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate } from 'react-router-dom';
import { Iconify } from 'src/components/iconify';
import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';

const ProductDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product } = location.state;

  return (
    <>
      <Helmet>
        <title> {`${product?.name ?? "Product Info"} - ${CONFIG.appName}`}</title>
      </Helmet>

      <DashboardContent>
        <Box display="flex" flexDirection='row' justifyContent='space-between' alignItems="center" mb={5} width='100%'>
          <Box display="flex" flexDirection="row" alignItems="center" justifyContent='start' >
            <IconButton onClick={() => navigate(-1)} >
              <Iconify icon='eva:arrow-back-fill' />
            </IconButton>
            <Typography px={1} variant="h4" flexGrow={1}>
              {product?.name ?? 'Title'}
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:edit" />}
          >
            Update
          </Button>
        </Box>
      </DashboardContent>
    </>
  );
};

export default ProductDetail;
