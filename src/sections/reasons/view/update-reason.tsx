import type { RootState } from 'src/redux/store';

import * as Yup from 'yup';
import { mutate } from 'swr';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';

import { Box, Button, useTheme, TextField } from '@mui/material';

import APIService from 'src/service/api.service';
import { setLoading } from 'src/redux/reducers/loader';


const UpdateLocation = ({ setOpen, reason }: any) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { isLoading } = useSelector((state: RootState) => state.loader);
    const validate = Yup.object().shape({
      title: Yup.string().required('Reason is required'),
    });
  
  
    const formik = useFormik({
      initialValues: {
        title: reason?.title ?? '',
      },
      validationSchema: validate,
      onSubmit: async (values) => {
        try {         
           dispatch(setLoading(true));
  
            const payload = {
              title: values.title,
            };
  
            const response = APIService.updateReason(payload, reason?._id  ??  reason?.id);
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
                  mutate('/admins/reasons/all')
                  const res = data?.data?.message || 'Reason updated successfully';
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
          console.log('LOCATION ERR :: ', error);
        }
      },
    });
  
  
    const { touched, errors, getFieldProps, handleSubmit } = formik;
    return (
      <Box p={3} minWidth={320} >
       
        <Box p={1} />
        <TextField
          variant="outlined"
          fullWidth
          placeholder="Reason"
          label="Reason"
          {...getFieldProps('title')}
          error={Boolean(touched.title && errors.title)}
          helperText={Boolean(touched.title && errors.title)}
        />
        <Box p={2} />
  
        <Button
          fullWidth
          disabled={isLoading}
          variant="contained"
          onClick={() => handleSubmit()}
          sx={{ bgcolor: theme.palette.secondary.main }}
        >
          Update Now
        </Button>
      </Box>
    );
  };

  export default UpdateLocation;