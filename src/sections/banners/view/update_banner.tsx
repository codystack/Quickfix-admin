/* eslint-disable consistent-return */
import type { RootState } from 'src/redux/store';

import * as Yup from 'yup';
import { mutate } from 'swr';
import { useState } from 'react';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';

import {
  Box,
  Button,
  Toolbar,
  useTheme,
  TextField,
  InputLabel,
  Typography,
  FormControl,
  NativeSelect,
  OutlinedInput,
  useMediaQuery,
  FormHelperText,
} from '@mui/material';

import convertBase64 from 'src/utils/image-converter';

import APIService from 'src/service/api.service';
import { setLoading } from 'src/redux/reducers/loader';

const bannerTypes = [
  { label: 'Image', value: 'image' },
  { label: 'Video', value: 'video' },
];

const UpdateBanner = ({ banner, setOpen }: any) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [file, setFile] = useState<any>(null);
  const [preview, setPreview] = useState<any>(banner.preview);
  const { isLoading } = useSelector((state: RootState) => state.loader);
  const validate = Yup.object().shape({
    title: Yup.string().nullable(),
    type: Yup.string().required('Banner type is required'),
    url: Yup.string().url('Enter a valid URL').nullable(),
  });

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
      title: banner?.title ?? '',
      type: banner?.type ?? '',
      url: banner?.url ?? '',
    },
    validationSchema: validate,
    onSubmit: async (values) => {
      try {
        if (file) {
          dispatch(setLoading(true));

          const base64s = [];
          const base: any = await convertBase64(file);
          base64s.push(base);
          const resp = await uploadMultipleImages(base64s);

          const payload = {
            title: values.title,
            url: values.url,
            preview: resp?.data[0],
            type: values.type,
            amount: 0,
            status: banner?.status,
          };

          const response = APIService.updateBanner(payload, banner?._id);
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
                mutate('/admins/banners/all');
                const res = data?.data?.message || 'Banner updated successfully';
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
        } else {
          // Now make a trip to create a new product here
          const payload = {
            title: values.title,
            url: values.url,
            preview: banner?.preview ?? '',
            type: values.type,
            status: banner?.status,
            amount: 0,
          };

          const response = APIService.updateBanner(payload, banner?._id);
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
                mutate('/admins/banners/all');
                const res = data?.data?.message || 'Banner updated successfully';
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
        }
      } catch (error) {
        dispatch(setLoading(false));
        console.log('SOCIAL ERR :: ', error);
      }
    },
  });

  const handleButtonClick = () => {
    document.getElementById('file-input')?.click();
  };

  const { touched, errors, getFieldProps, handleSubmit } = formik;
  return (
    <Box p={3}>
      <TextField
        variant="outlined"
        fullWidth
        type="text"
        required
        placeholder="Banner title"
        label="Banner Title"
        {...getFieldProps('title')}
        error={Boolean(touched.title && errors.title)}
        helperText={Boolean(touched.title && errors.title)}
      />
      <Box p={1} />
      <TextField
        variant="outlined"
        fullWidth
        type="url"
        placeholder="Link to page/profile"
        label="URL Link"
        {...getFieldProps('url')}
        error={Boolean(touched.url && errors.url)}
        helperText={Boolean(touched.url && errors.url)}
      />
      <Box p={1} />

      <FormControl fullWidth variant="outlined" error={Boolean(touched.type && errors.type)}>
        <InputLabel variant="outlined" htmlFor="ids">
          Banner Type
        </InputLabel>
        <NativeSelect
          inputProps={{
            name: 'type',
            id: 'ids',
          }}
          input={<OutlinedInput label="Banner Type" {...getFieldProps('type')} />}
        >
          <option disabled>Select banner type</option>
          {bannerTypes?.map((elem) => (
            <option key={elem.value} value={elem.value}>
              {elem.label}
            </option>
          ))}
        </NativeSelect>
        <FormHelperText>{Boolean(touched.type && errors.type)}</FormHelperText>
      </FormControl>
      <Box p={1} />
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
      <Toolbar />

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

export default UpdateBanner;
