import type { RootState } from 'src/redux/store';

import * as Yup from 'yup';
import { useState } from 'react';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';

import { Box, Button, useTheme, TextField } from '@mui/material';

import APIService from 'src/service/api.service';
import { setLoading } from 'src/redux/reducers/loader';
import { mutate } from 'swr';

const UpdateExpress = ({ setOpen, data }: any) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state: RootState) => state.loader);
  const validate = Yup.object().shape({
    name: Yup.string().required('Express title is required'),
    fee: Yup.number().required('Fee is required'),
  });

  //   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const formik = useFormik({
    initialValues: {
      name: data?.name ?? '',
      fee: data?.fee ?? 0,
    },
    validationSchema: validate,
    onSubmit: async (values) => {
      try {
        dispatch(setLoading(true));

        // Now make a trip to create a new product here
        const payload = {
          ...values,
        };

        const response = APIService.updateExpress(data?.id ?? data?._id, payload);
        toast.promise(response, {
          pending: {
            render() {
              return 'Loading. Please wait...';
            },
            icon: false,
          },
          success: {
            render({ resp }: any) {
              dispatch(setLoading(false));
              mutate('/admins/express/all');
              const res = resp?.data?.message || 'Express update successfully';
              setOpen(false);
              return `${res}`;
            },
          },
          error: {
            render({ resp }: any) {
              dispatch(setLoading(false));
              const errorMsg = resp?.response?.data?.message || resp?.message || '';
              // When the promise reject, data will contains the error
              return `${errorMsg ?? 'An error occurred!'}`;
            },
          },
        });
      } catch (error) {
        dispatch(setLoading(false));
      }
    },
  });

  const { touched, errors, getFieldProps, handleSubmit } = formik;
  return (
    <Box p={4} minWidth={360}>
      <TextField
        variant="outlined"
        fullWidth
        required
        placeholder="Express title"
        label="Title"
       
        {...getFieldProps('name')}
        error={Boolean(touched.name && errors.name)}
        helperText={Boolean(touched.name && errors.name)}
      />
      <Box p={1} />
      <TextField
        variant="outlined"
        fullWidth
        required
        type="number"
        placeholder="Express fee"
        label="Fee"
        onInput={(e: any) => {
          e.target.value = Math.max(0, parseInt(e.target.value, 10)).toString().slice(0, 3);
        }}
        {...getFieldProps('fee')}
        error={Boolean(touched.fee && errors.fee)}
        helperText={Boolean(touched.fee && errors.fee)}
      />

      <Box p={1} />
      <Button
        fullWidth
        disabled={isLoading}
        variant="contained"
        onClick={() => handleSubmit()}
        sx={{ bgcolor: theme.palette.secondary.main }}
      >
        Save Changes
      </Button>
    </Box>
  );
};

export default UpdateExpress;
