import type { RootState } from 'src/redux/store';

import * as Yup from 'yup';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import APIService from 'src/service/api.service';
import { setLoading } from 'src/redux/reducers/loader';

// ----------------------------------------------------------------------

export function ForgotPasswordView() {
  const navigate = useNavigate();

  const { isLoading } = useSelector((state: RootState) => state.loader);
  const dispatch = useDispatch();

  const validationSchema = Yup.object().shape({
    email_address: Yup.string()
      .email('Enter a valid email address')
      .required('Email address is required'),
  });

  const formik = useFormik({
    initialValues: {
      email_address: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        dispatch(setLoading(true));
        const payload = {
          email_address: values.email_address,
        };

        const respo = APIService.forgotPassword(payload);

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
              const resp =
                data?.data?.message || `OTP code successfully sent to ${values.email_address}`;
                navigate('/verify-otp', { state: { emailAddress: values.email_address} });
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
        label="Email address"
        {...getFieldProps('email_address')}
        error={Boolean(touched.email_address && errors.email_address)}
        helperText={errors.email_address}
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
      />

      <Box p={2} />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        color="inherit"
        variant="contained"
        disabled={isLoading}
        onClick={() => handleSubmit()}
      >
        Send
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
        <Typography variant="h5">Forgot Password</Typography>
      </Box>

      {renderForm}
    </div>
  );
}
