/* eslint-disable consistent-return */
/* eslint-disable import/no-extraneous-dependencies */
import type { RootState } from 'src/redux/store';

import { useState } from 'react';
import { toast } from 'react-toastify';
import { OtpInput } from 'reactjs-otp-input';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import APIService from 'src/service/api.service';
import { setLoading } from 'src/redux/reducers/loader';

// ----------------------------------------------------------------------

export function VerifyOTPView() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { isLoading } = useSelector((state: RootState) => state.loader);
  const [otp, setOtp] = useState('');
  const { emailAddress } = location.state;

  const handleSubmit = () => {
    dispatch(setLoading(true));
    const payload = {
      email_address: emailAddress,
      code: otp
    };

    const response = APIService.verifyOTP(payload);
    toast.promise(response, {
      pending: {
        render() {
          return 'Loading. Please wait...';
        },
        icon: false,
      },
      success: {
        render({ data }) {
          console.log('SUCCESS :: ', data);
          dispatch(setLoading(false));
          const resp = data?.data?.message || 'OTP verified successfully';
          navigate('/reset-password', { state: { emailAddress } });
          return `${resp}`;
        },
      },
      error: {
        render({ data }: any) {
          dispatch(setLoading(false));
          console.log('ERRO ON TOAST HERE :: ', data?.response?.data?.message);
          const errorMsg = data?.response?.data?.message || data?.message || '';
          // When the promise reject, data will contains the error
          return `${errorMsg ?? 'An error occurred!'}`;
        },
      },
    });
  };

  const resendCode = () => {
    dispatch(setLoading(true));
    const payload = {
      email_address: emailAddress
    };

    const response = APIService.sendOTP(payload);
    toast.promise(response, {
      pending: {
        render() {
          return 'Loading. Please wait...';
        },
        icon: false,
      },
      success: {
        render({ data }) {
          console.log('SUCCESS :: ', data);
          dispatch(setLoading(false));
          const resp = data?.data?.message || 'OTP sent successfully';
          return `${resp}`;
        },
      },
      error: {
        render({ data }: any) {
          dispatch(setLoading(false));
          console.log('ERRO ON TOAST HERE :: ', data?.response?.data?.message);
          const errorMsg = data?.response?.data?.message || data?.message || '';
          // When the promise reject, data will contains the error
          return `${errorMsg ?? 'An error occurred!'}`;
        },
      },
    });
  };

  const renderForm = (
    <Box display="flex" flexDirection="column" alignItems="center">
      {/* <OtpInput value={otp} onChange={handleChange} numInputs={6} separator={<span>-</span>} /> */}
      <OtpInput
        value={otp}
        onChange={(value) => {
          let otpValue = '';
          setOtp(value);
          otpValue += value;
          if (otpValue.length === 4) {
            // setOtp(otpValue);
            // return handleSubmit();
          }
        }}
        shouldAutoFocus
        numInputs={4}
        inputStyle={{
          width: '100%',
          height: 50,
          marginRight: 10,
          marginLeft: 10,
          borderRadius: 8,
          fontSize: 18,
          border: '1px solid',
        }}
        isInputNum
        separator={<span>-</span>}
      />
      <Box p={2} />
      <Box display='flex' width='100%' flexDirection='row' justifyContent='flex-end' alignItems='center' >
        <Button variant='text' onClick={() => resendCode()} >
          Resend Code
        </Button>
      </Box>
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
        <Typography variant="h5">Verify One Time Password (OTP)</Typography>
      </Box>

      {renderForm}
    </div>
  );
}
