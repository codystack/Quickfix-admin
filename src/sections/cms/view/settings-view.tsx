/* eslint-disable consistent-return */
import * as Yup from 'yup';
import { mutate } from 'swr';
import { useState } from 'react';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {
  Grid,
  Button,
  Toolbar,
  Divider,
  useTheme,
  TextField,
  IconButton,
  useMediaQuery,
} from '@mui/material';

import convertBase64 from 'src/utils/image-converter';

import APIService from 'src/service/api.service';
import { setLoading } from 'src/redux/reducers/loader';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function SettingsView({ data }: any) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const [preview, setPreview] = useState<any>(data?.get_started ?? '');
  const [file, setFile] = useState<any>(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const validate = Yup.object().shape({
    phone_number: Yup.string().required('Phone number is required'),
    email_address: Yup.string().required('Email address is required'),
    office_address: Yup.string().required('Office address is required'),
    get_started_title: Yup.string().required('Get started title is required'),
  });

  const handleFileChange = (event: any) => {
    const selectedFile: any = event.target.files[0];
    console.log('FILE INFO  ::: ', selectedFile);

    if (selectedFile) {
      try {
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
      } catch (error) {
        console.log(error);
      }
    }
  };

  async function uploadMultipleImages(imgs: any) {
    try {
      const payload = {
        images: imgs,
      };
      const response = await APIService.multiImagesUpload(payload);
      return response;
    } catch (error) {
      dispatch(setLoading(false));
      console.log(error);
    }
  }

  const formik = useFormik({
    initialValues: {
      phone_number: data?.phone_number ?? '',
      email_address: data?.email_address ?? '',
      office_address: data?.office_address ?? '',
      get_started_title: data?.get_started_title ?? '',
    },
    validationSchema: validate,
    onSubmit: async (values) => {
      dispatch(setLoading(true));
      if (file) {

        const base64s = [];
        const base: any = await convertBase64(file);
        base64s.push(base);
        const imgResp = await uploadMultipleImages(base64s);

        const payload = {
          phone_number: values?.phone_number,
          email_address: values.email_address,
          office_address: values.office_address,
          get_started_title: values.get_started_title,
          get_started: imgResp?.data[0],
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
      } else {
        const payload = {
          phone_number: values?.phone_number,
          email_address: values.email_address,
          office_address: values.office_address,
          get_started_title: values.get_started_title,
          get_started: data?.get_started ?? "",
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
              const res = resp?.data?.message || 'Settings updated successfully';
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
      }
    },
  });

  const handleButtonClick = () => {
    document.getElementById('file-input')?.click();
  };

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
      <Divider />
      <Box p={2} />
      <Box display="flex" alignItems="center" mb={2}>
        <IconButton />
        <Typography variant="h4" flexGrow={1}>
          Get Started Banner
        </Typography>
      </Box>
      <Box p={1} />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            variant="outlined"
            fullWidth
            placeholder="Get started banner title"
            label="Get Started Title"
            required
            {...getFieldProps('get_started_title')}
            error={Boolean(touched.get_started_title && errors.get_started_title)}
            helperText={Boolean(touched.get_started_title && errors.get_started_title)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 2,
              border: '2px dashed #1976d2',
              borderRadius: '8px',
              width: isMobile ? '320px' : '500px',
              textAlign: 'center',
            }}
          >
            <input id="file-input" type="file" hidden onChange={handleFileChange} />
            <Button
              variant="contained"
              color="primary"
              onClick={handleButtonClick}
              sx={{ marginBottom: 2 }}
            >
              Choose File
            </Button>
            <img alt="" src={preview} width="100%" />
            <Typography variant="body1" color="textSecondary">
              {file ? '' : 'No file selected'}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Box p={2} />
      <Button variant="contained" onClick={() => handleSubmit()}>
        Save Changes
      </Button>
    </DashboardContent>
  );
}
