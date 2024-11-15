/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable import/no-extraneous-dependencies */
import 'react-alice-carousel/lib/alice-carousel.css';

import { mutate } from 'swr';
import { toast } from 'react-toastify';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import AliceCarousel from 'react-alice-carousel';
import { useLocation, useNavigate } from 'react-router-dom';

import { Box, Toolbar, Tooltip, IconButton, Typography } from '@mui/material';

import { CONFIG } from 'src/config-global';
import APIService from 'src/service/api.service';
import { setLoading } from 'src/redux/reducers/loader';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import CustomizedDialog from 'src/components/dialog';

import { RenderConfirmation } from 'src/sections/booking/booking-table-row';

const ProductDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data } = location.state;

  const [open, setOpen] = useState(false);

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

  const deleteProduct = async () => {
    dispatch(setLoading(true));
    const deleteResponse = APIService.deleteProduct(data?._id);
    toast.promise(deleteResponse, {
      pending: {
        render() {
          return 'Loading. Please wait...';
        },
        icon: false,
      },
      success: {
        render({ dt }: any) {
          console.log('SUCCESS :: ', dt);
          setOpen(false)
          dispatch(setLoading(false));
          mutate('/marketplace/all');
          const resp = dt?.data?.message || 'Product deleted successfully';
          return `${resp}`;
        },
      },
      error: {
        render({ dt }: any) {
          dispatch(setLoading(false));
          console.log('ERRO ON TOAST HERE :: ', dt?.response?.data?.message);
          const errorMsg = dt?.response?.data?.message || dt?.message || '';
          // When the promise reject, data will contains the error
          return `${errorMsg ?? 'An error occurred!'}`;
        },
      },
    });
  };

  return (
    <>
      <Helmet>
        <title> {`${data?.name ?? 'Product Info'} - ${CONFIG.appName}`}</title>
      </Helmet>

      <CustomizedDialog
        open={open}
        setOpen={setOpen}
        title="Delete Product"
        body={
          <RenderConfirmation
            setOpen={setOpen}
            message="Are you sure you want to delete this product?"
            action={() => deleteProduct()}
          />
        }
      />

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
          <Box>
            <Tooltip title="Edit Product">
              <IconButton
                onClick={() =>
                  navigate(`/dashboard/product/${data?._id}/update`, { state: { product: data } })
                }
              >
                <Iconify icon="basil:edit-outline" fontSize={48} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete Product">
              <IconButton onClick={() => setOpen(true)}>
                <Iconify icon="weui:delete-on-filled" fontSize={48} />
              </IconButton>
            </Tooltip>
          </Box>
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
