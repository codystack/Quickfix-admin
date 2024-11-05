import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, IconButton, Toolbar, Typography } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

const AddNewProduct = () => {
  const navigate = useNavigate();
  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <IconButton onClick={() => navigate(-1)} >
          <Iconify icon="mdi:arrow-back" />
        </IconButton>
        <Typography px={1} variant="h4" flexGrow={1}>
          New Product
        </Typography>
      </Box>
      <Toolbar />
      
    </DashboardContent>
  )
};

export default AddNewProduct;
