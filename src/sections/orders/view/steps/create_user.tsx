import type { RootState } from 'src/redux/store';

import * as Yup from 'yup';
import { mutate } from 'swr';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';

import {
  Box,
  Grid,
  Button,
  useTheme,
  TextField,
} from '@mui/material';

import APIService from 'src/service/api.service';
import { setLoading } from 'src/redux/reducers/loader';

const adminTypes = [
  { label: 'Super Admin', value: 'superadmin' },
  { label: 'Admin', value: 'admin' },
];

const access = [
  { label: 'Read Only', value: 'readonly' },
  { label: 'Read/Write', value: 'read/write' },
];

const genders = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
];

const roles = [
  { label: 'Manager', value: 'manager' },
  { label: 'Support', value: 'support' },
  { label: 'Developer', value: 'developer' },
  { label: 'Editor', value: 'editor' },
];

const AddUser = ({ setOpen, setUser }: any) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state: RootState) => state.loader);
  const validate = Yup.object().shape({
    first_name: Yup.string().required('First name is required'),
    last_name: Yup.string().required('Last name is required'),
    email_address: Yup.string()
      .email('Email address is invalid')
      .required('Email address is required'),
    phone_number: Yup.string().required('Phone number is required'),
  });

  //   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const formik = useFormik({
    initialValues: {
      first_name: '',
      last_name: '',
      email_address: '',
      phone_number: '',
    },
    validationSchema: validate,
    onSubmit: async (values) => {
      try {
        dispatch(setLoading(true));

        // Now make a trip to create a new product here
        const payload = {
          first_name: values.first_name,
          last_name: values.last_name,
          email_address: values.email_address,
          phone_number: values.phone_number,
          dial_code: '+234',
          international_phone_format: `+234${values.phone_number}`,
        };

        const response = APIService.addUser(payload);
        toast.promise(response, {
          pending: {
            render() {
              return 'Loading. Please wait...';
            },
            icon: false,
          },
          success: {
            render({ data }) {
              dispatch(setLoading(false));
              const userObj = data?.data?.data;
              setUser(userObj)
              mutate('/users/list');
              mutate('/users/all');
              const res = data?.data?.message || 'New user enrolled successfully';
              setOpen(false);
              return `${res}`;
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

  const { touched, errors, getFieldProps, handleSubmit } = formik;
  return (
    <Box p={3}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            variant="outlined"
            fullWidth
            placeholder="First Name"
            label="First Name"
            {...getFieldProps('first_name')}
            error={Boolean(touched.first_name && errors.first_name)}
            helperText={touched.first_name && errors.first_name}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            variant="outlined"
            fullWidth
            placeholder="Last name"
            label="Last Name"
            {...getFieldProps('last_name')}
            error={Boolean(touched.last_name && errors.last_name)}
            helperText={touched.last_name && errors.last_name}
          />
        </Grid>
      </Grid>
      <Box p={1} />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            variant="outlined"
            fullWidth
            type="email"
            placeholder="Email address"
            label="Email Address"
            required
            {...getFieldProps('email_address')}
            error={Boolean(touched.email_address && errors.email_address)}
            helperText={touched.email_address && errors.email_address}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            variant="outlined"
            fullWidth
            placeholder="Phone number"
            label="Phone Number"
            required
            {...getFieldProps('phone_number')}
            error={Boolean(touched.phone_number && errors.phone_number)}
            helperText={touched.phone_number && errors.phone_number}
          />
        </Grid>
      </Grid>
      <Box p={1} />

      <Box p={1} />
      <Button
        fullWidth
        disabled={isLoading}
        variant="contained"
        onClick={() => handleSubmit()}
        sx={{ bgcolor: theme.palette.secondary.main }}
      >
        Submit
      </Button>
    </Box>
  );
};

export default AddUser;
