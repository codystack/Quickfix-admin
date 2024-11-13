import type { RootState } from 'src/redux/store';

import * as Yup from 'yup';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';

import {
  Box,
  Grid,
  Button,
  useTheme,
  TextField,
  InputLabel,
  FormControl,
  NativeSelect,
  OutlinedInput,
  FormHelperText,
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

const AddAdmin = ({ setOpen }: any) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state: RootState) => state.loader);
  const validate = Yup.object().shape({
    first_name: Yup.string().required('First name is required'),
    last_name: Yup.string().required('Last name is required'),
    email_address: Yup.string()
      .email('Email address is invalid')
      .required('Email address is required'),
    type: Yup.string().required('Admin type is required'),
    role: Yup.string().required('Admin role is required'),
    access: Yup.string().required('Admin access is required'),
    address: Yup.string().required('Admin address is required'),
    phone_number: Yup.string().required('Phone number is required'),
    gender: Yup.string().required('Gender is required'),
  });

  //   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const formik = useFormik({
    initialValues: {
      first_name: '',
      last_name: '',
      email_address: '',
      type: '',
      role: '',
      access: '',
      address: '',
      gender: '',
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
          type: values.type,
          role: values.role,
          access: values.access,
          address: values.address,
        };

        const response = APIService.addAdmin(payload);
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
              // mutate('/admins/bookings/all')
              const res = data?.data?.message || 'New admin enrolled successfully';
              setOpen(false);
              return `${res}`;
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
      } catch (error) {
        dispatch(setLoading(false));
        console.log('SOCIAL ERR :: ', error);
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
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="outlined" error={Boolean(touched.gender && errors.gender)}>
            <InputLabel variant="outlined" htmlFor="gender">
              Gender
            </InputLabel>
            <NativeSelect
              inputProps={{
                name: 'gender',
                id: 'gender',
              }}
              input={<OutlinedInput label="Gender" {...getFieldProps('gender')} />}
            >
              <option disabled>Select gender</option>
              {genders?.map((elem) => (
                <option key={elem.value} value={elem.value}>
                  {elem.label}
                </option>
              ))}
            </NativeSelect>
            <FormHelperText>{touched.gender && errors.gender}</FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="outlined" error={Boolean(touched.type && errors.type)}>
            <InputLabel variant="outlined" htmlFor="ids">
              Admin Type
            </InputLabel>
            <NativeSelect
              inputProps={{
                name: 'type',
                id: 'ids',
              }}
              input={<OutlinedInput label="Banner Type" {...getFieldProps('type')} />}
            >
              <option disabled>Select admin type</option>
              {adminTypes?.map((elem) => (
                <option key={elem.value} value={elem.value}>
                  {elem.label}
                </option>
              ))}
            </NativeSelect>
            <FormHelperText>{touched.type && errors.type}</FormHelperText>
          </FormControl>
        </Grid>
      </Grid>

      <Box p={1} />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="outlined" error={Boolean(touched.role && errors.role)}>
            <InputLabel variant="outlined" htmlFor="role">
              Admin Role
            </InputLabel>
            <NativeSelect
              inputProps={{
                name: 'role',
                id: 'role',
              }}
              input={<OutlinedInput label="Banner Type" {...getFieldProps('role')} />}
            >
              <option disabled>Select admin role</option>
              {roles?.map((elem) => (
                <option key={elem.value} value={elem.value}>
                  {elem.label}
                </option>
              ))}
            </NativeSelect>
            <FormHelperText>{touched.role && errors.role}</FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl
            fullWidth
            variant="outlined"
            error={Boolean(touched.access && errors.access)}
          >
            <InputLabel variant="outlined" htmlFor="access">
              Access
            </InputLabel>
            <NativeSelect
              inputProps={{
                name: 'access',
                id: 'access',
              }}
              input={<OutlinedInput label="Access Type" {...getFieldProps('access')} />}
            >
              <option disabled>Select access type</option>
              {access?.map((elem) => (
                <option key={elem.value} value={elem.value}>
                  {elem.label}
                </option>
              ))}
            </NativeSelect>
            <FormHelperText>{touched.access && errors.access}</FormHelperText>
          </FormControl>
        </Grid>
      </Grid>

      <Box p={1} />

      <TextField
        variant="outlined"
        fullWidth
        placeholder="Address"
        label="Address"
        {...getFieldProps('address')}
        error={Boolean(touched.address && errors.address)}
        helperText={touched.address && errors.address}
      />
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

export default AddAdmin;
