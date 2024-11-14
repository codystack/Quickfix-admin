
import * as Yup from 'yup';
import { mutate } from 'swr';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Button, Toolbar, TextField, IconButton } from '@mui/material';

import APIService from 'src/service/api.service';
import { setLoading } from 'src/redux/reducers/loader';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';


// ----------------------------------------------------------------------

export function SettingsView({ data }: any) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validate = Yup.object().shape({
    phone_number: Yup.string().required('Phone number is required'),
    email_address: Yup.string().required('Email address is required'),
    office_address: Yup.string().required('Office address is required'),
  });

  const formik = useFormik({
    initialValues: {
        phone_number: data?.phone_number ?? "",
        email_address: data?.email_address ?? "",
        office_address: data?.office_address ?? ''
    },
    validationSchema: validate,
    onSubmit: async (values) => {
      dispatch(setLoading(true));
      // Now make a trip to create a new product here
      const payload = {
        phone_number: values?.phone_number,
        email_address: values.email_address,
        office_address: values.office_address,
      };

      const response = APIService.manageContact(payload);
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
            mutate('/admins/socials/all');
            const res = resp?.data?.message || 'Contact information updated successfully';
            return `${res}`;
          },
        },
        error: {
          render({ resp }: any) {
            dispatch(setLoading(false));
            const errorMsg = resp?.response?.data?.message || resp?.message || '';
            return `${errorMsg ?? 'An error occurred!'}`;
          },
        },
      });
    },
  });

  const { touched, errors, getFieldProps, handleSubmit } = formik;

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
      <IconButton onClick={() => navigate(-1)}>
            <Iconify icon="eva:arrow-back-fill" color="inherit" />
          </IconButton>
        <Typography variant="h4" flexGrow={1}>
          Contact Information
        </Typography>
      </Box>
      <Toolbar />
      <TextField
        variant="outlined"
        fullWidth
        type="email"
        placeholder="Platform Email"
        label="Platform Email Address"
        required
        {...getFieldProps('email_address')}
        error={Boolean(touched.email_address && errors.email_address)}
        helperText={Boolean(touched.email_address && errors.email_address)}
      />
      <Box p={1} />
      <TextField
        variant="outlined"
        fullWidth
        type="text"
        placeholder="Social platform name"
        label="Platform Phone Number"
        required
        {...getFieldProps('phone_number')}
        error={Boolean(touched.phone_number && errors.phone_number)}
        helperText={Boolean(touched.phone_number && errors.phone_number)}
      />
      <Box p={1} />
      <TextField
        variant="outlined"
        fullWidth
        type="text"
        placeholder="Office Address"
        label="Platform Office Address"
        required
        {...getFieldProps('office_address')}
        error={Boolean(touched.office_address && errors.office_address)}
        helperText={Boolean(touched.office_address && errors.office_address)}
      />
      <Box p={2} />
      <Button  variant='contained' onClick={() => handleSubmit()} >
        Save Changes
      </Button>
    </DashboardContent>
  );
}
