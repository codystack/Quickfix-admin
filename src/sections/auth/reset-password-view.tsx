import type { RootState } from 'src/redux/store';

import * as Yup from 'yup';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import APIService from 'src/service/api.service';
import { setLoading } from 'src/redux/reducers/loader';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function ResetPasswordView() {
  const router = useRouter();
  const dispatch = useDispatch();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const { isLoading } = useSelector((state: RootState) => state.loader);
  const { emailAddress } = location.state

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, 'Minimum of 8 characters required')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .min(8, 'Minimum of 8 characters required')
      .required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      confirmPassword: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        dispatch(setLoading(true));
        const payload = {
          email_address: emailAddress,
          new_password: values.password,
          confirm_password: values.confirmPassword
        };

        const respo = APIService.resetPassword(payload);

        toast.promise(respo, {
          pending: {
            render() {
              return 'Loading. Please wait...';
            },
            icon: false,
          },
          success: {
            render({ data }) {
              dispatch(setLoading(false));
              const resp = data?.data?.message || 'Password updated successfully';
              router.push('/');
              return `${resp}`;
            },
          },
          error: {
            render({ data }: any) {
              dispatch(setLoading(false));
              const errorMsg = data?.response?.data?.message || data?.message || '';
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

  const { errors, touched, getFieldProps, handleSubmit } = formik;

  const renderForm = (
    <Box display="flex" flexDirection="column" alignItems="flex-end">
      <TextField
        fullWidth
        label="Password"
        InputLabelProps={{ shrink: true }}
        type={showPassword ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
        {...getFieldProps('password')}
        error={Boolean(touched.password && errors.password)}
        helperText={errors.password}
        sx={{ mb: 3 }}
      />

      <Box p={1} />

      <TextField
        fullWidth
        label="Confirm Password"
        InputLabelProps={{ shrink: true }}
        type={showPassword2 ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword2(!showPassword2)} edge="end">
                <Iconify icon={showPassword2 ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
        {...getFieldProps('confirmPassword')}
        error={Boolean(touched.confirmPassword && errors.confirmPassword)}
        helperText={errors.confirmPassword}
        sx={{ mb: 3 }}
      />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        color="inherit"
        variant="contained"
        disabled={isLoading}
        onClick={() => handleSubmit()}
      >
        Reset Password
      </LoadingButton>
    </Box>
  );

  return (
    <div>
      <Box
        gap={1.5}
        display="flex"
        flexDirection="column"
        alignItems="center"
        sx={{ mb: 5 }}
        justifyContent="center"
        height="100%"
      >
        <Typography variant="h5">Set New Password</Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Enter your new password to continue
        </Typography>
      </Box>
      <Box p={1} />

      {renderForm}
    </div>
  );
}
