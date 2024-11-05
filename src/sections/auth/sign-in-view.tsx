import type { RootState } from 'src/redux/store';

import * as Yup from 'yup';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import APIService from 'src/service/api.service';
import { setLoading } from 'src/redux/reducers/loader';

import { Iconify } from 'src/components/iconify';
import { setAuth, setProfile } from 'src/redux/reducers/auth';

// ----------------------------------------------------------------------

export function SignInView() {
  const router = useRouter();

  // const [isLoading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { isLoading } = useSelector((state: RootState) => state.loader);
  const dispatch = useDispatch();

  const handleSignIn = useCallback(() => {
    router.push('/');
  }, [router]);

  const validationSchema = Yup.object().shape({
    email_address: Yup.string()
      .email('Enter a valid email address')
      .required('Email address is required'),
    password: Yup.string()
      .min(8, 'Minimum of 8 characters required')
      .required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      email_address: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        dispatch(setLoading(true));
        const payload = {
          email_address: values.email_address,
          password: values.password,
        };

        const respo = APIService.login(payload);
        console.log("RESPONSE ON LOGIN :: ", respo);
        
        toast.promise(respo, {
          pending: {
            render() {
              return 'Loading. Please wait...';
            },
            icon: false,
          },
          success: {
            render({ data }) {
              console.log("SUCCESS :: ", data);
              dispatch(setLoading(false));
              localStorage.setItem("accessToken", data?.data?.accessToken)
              dispatch(setAuth(true));
              dispatch(setProfile(data?.data?.user));
              const resp = data?.data?.message || "Logged in successfully"
              router.push('/dashboard');
              return `${resp}`;
            },
          },
          error: {
            render({ data }: any) {
              dispatch(setLoading(false));
              console.log('ERRO ON TOAST HERE :: ', data?.response?.data?.message);
              const errorMsg =  data?.response?.data?.message || data?.message || ""
              // When the promise reject, data will contains the error
              return `${errorMsg ?? 'An error occurred!'}`;
            },
          },
        });
      } catch (error) {
        console.log('ERROR :: ', error);
        dispatch(setLoading(false));
      }
    },
  });

  const { errors, touched, getFieldProps, handleSubmit } = formik;

  const renderForm = (
    <Box display="flex" flexDirection="column" alignItems="flex-end">
      <TextField
        fullWidth
        label="Email address"
        {...getFieldProps('email_address')}
        error={Boolean(touched.email_address && errors.email_address)}
        helperText={errors.email_address}
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
      />

      <Link variant="body2" color="inherit" sx={{ mb: 1.5 }}>
        Forgot password?
      </Link>

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

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        color="inherit"
        variant="contained"
        disabled={isLoading}
        onClick={() => handleSubmit()}
      >
        Sign in
      </LoadingButton>
    </Box>
  );

  return (
    <div >
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }} justifyContent="center" height="100%" >
        <Typography variant="h5">Sign in</Typography>
        <Typography variant="body2" color="text.secondary">
          Don’t have an account?
          <Link variant="subtitle2" sx={{ ml: 0.5 }}>
            Get started
          </Link>
        </Typography>
      </Box>

      {renderForm}

      {/* <Divider sx={{ my: 3, '&::before, &::after': { borderTopStyle: 'dashed' } }}>
        <Typography
          variant="overline"
          sx={{ color: 'text.secondary', fontWeight: 'fontWeightMedium' }}
        >
          OR
        </Typography>
      </Divider>

      <Box gap={1} display="flex" justifyContent="center">
        <IconButton color="inherit">
          <Iconify icon="logos:google-icon" />
        </IconButton>
        <IconButton color="inherit">
          <Iconify icon="eva:github-fill" />
        </IconButton>
        <IconButton color="inherit">
          <Iconify icon="ri:twitter-x-fill" />
        </IconButton>
      </Box> */}
    </div>
  );
}
