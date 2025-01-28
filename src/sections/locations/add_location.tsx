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
  InputLabel,
  FormControl,
  NativeSelect,
  OutlinedInput,
  FormHelperText,
} from '@mui/material';

import { states } from 'src/utils/states';

import APIService from 'src/service/api.service';
import { setLoading } from 'src/redux/reducers/loader';
import { useState } from 'react';

const AddLocation = ({ setOpen }: any) => {
  const [cities, setCities] = useState<any[]>([]);
  const theme = useTheme();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state: RootState) => state.loader);
  const validate = Yup.object().shape({
    region: Yup.string().required('State/Region is required'),
    city: Yup.string().required('City is required'),
  });

  //   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const formik = useFormik({
    initialValues: {
      region: '',
      city: '',
    },
    validationSchema: validate,
    onSubmit: async (values) => {
      try {
        dispatch(setLoading(true));

        // Now make a trip to create a new product here
        const payload = {
          region: values.region,
          city: values.city,
        };

        const response = APIService.addLocation(payload);
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
    <Box p={4} minWidth={300}>
      <FormControl fullWidth variant="outlined" error={Boolean(touched.region && errors.region)}>
        <InputLabel variant="outlined" htmlFor="region">
          Region
        </InputLabel>
        <NativeSelect
          inputProps={{
            name: 'region',
            id: 'region',
          }}
          input={
            <OutlinedInput
              label="Gender"
              onChange={(e) => {
                formik.setFieldValue('region', e.target.value);
                const filtered = states?.filter(
                  (item) => item.name.toLowerCase() === e.target?.value.toLowerCase()
                );
                setCities(filtered[0].cities);
              }}
            />
          }
        >
          <option disabled>Region</option>
          {states?.map((elem) => (
            <option key={elem.name} value={elem.name}>
              {elem.name}
            </option>
          ))}
        </NativeSelect>
        <FormHelperText>{touched.region && errors.region}</FormHelperText>
      </FormControl>
      <Box p={1} />
      <FormControl fullWidth variant="outlined" error={Boolean(touched.city && errors.city)}>
        <InputLabel variant="outlined" htmlFor="city">
          City
        </InputLabel>
        <NativeSelect
          inputProps={{
            name: 'city',
            id: 'city',
          }}
          input={<OutlinedInput label="City" {...getFieldProps('city')} />}
        >
          <option disabled>City</option>
          {cities?.map((elem) => (
            <option key={elem} value={elem}>
              {elem}
            </option>
          ))}
        </NativeSelect>
        <FormHelperText>{touched.city && errors.city}</FormHelperText>
      </FormControl>

      {/* <TextField
        variant="outlined"
        fullWidth
        placeholder="Address"
        label="Address"
        {...getFieldProps('address')}
        error={Boolean(touched.address && errors.address)}
        helperText={touched.address && errors.address}
      /> */}
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

export default AddLocation;
