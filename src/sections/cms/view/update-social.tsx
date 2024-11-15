/* eslint-disable consistent-return */
/* eslint-disable no-await-in-loop */
import type { RootState } from 'src/redux/store';

import * as Yup from 'yup';
import { mutate } from 'swr';
import { useState } from 'react';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';

import { Box, Button, Toolbar, useTheme, TextField } from '@mui/material';

import convertBase64 from 'src/utils/image-converter';

import APIService from 'src/service/api.service';
import { setLoading } from 'src/redux/reducers/loader';

const UpdateSocial = ({ setOpen, social }: any) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [file, setFile] = useState<File>();
  const [preview, setPreview] = useState<any>(social?.logo ?? '');
  const { isLoading } = useSelector((state: RootState) => state.loader);
  const validate = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    url: Yup.string().url('Enter a valid URL').required('Url is required'),
  });

  // console.log('SOCIALITY ::: ', social);

  const handleFileChange = (event: any) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
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
      name: social?.name,
      url: social?.url,
    },
    validationSchema: validate,
    onSubmit: async (values) => {
      //   try {
      dispatch(setLoading(true));
      if (file) {
        const base64s = [];
        const base: any = await convertBase64(file);
        base64s.push(base);
        const resp = await uploadMultipleImages(base64s);

        // Now make a trip to create a new product here
        const payload = {
          name: values.name,
          url: values.url,
          logo: resp?.data[0],
        };

        const response = APIService.updateSocial(payload, social?._id);
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
              mutate('/admins/socials/all');
              const res = data?.data?.message || 'Social platform updated successfully';
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
          logo: social?.logo,
          name: values.name,
          url: values.url,
        };

        const response = APIService.updateSocial(payload, social?._id);
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
              mutate('/admins/socials/all');
              const res = data?.data?.message || 'Social platform updated successfully';
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
      }
      //   } catch (error) {
      //     dispatch(setLoading(false));
      //     console.log('SOCIAL ERR :: ', error);
      //   }
    },
  });

  const { touched, errors, getFieldProps, handleSubmit } = formik;
  return (
    <>
      {social && (
        <Box p={3}>
          <TextField
            variant="outlined"
            fullWidth
            type="text"
            placeholder="Social platform name"
            label="Platform Name"
            required
            {...getFieldProps('name')}
            error={Boolean(touched.name && errors.name)}
            helperText={Boolean(touched.name && errors.name)}
          />
          <Box p={1} />
          <TextField
            variant="outlined"
            fullWidth
            type="url"
            placeholder="Link to page/profile"
            label="URL Link"
            required
            {...getFieldProps('url')}
            error={Boolean(touched.url && errors.url)}
            helperText={Boolean(touched.url && errors.url)}
          />
          <Box p={1} />
          <TextField
            type="file"
            fullWidth
            required
            variant="outlined"
            onChange={handleFileChange}
          />
          <Box p={1} />
          <img src={preview} alt="" width={72} height={72} style={{ borderRadius: 36 }} />

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
      )}
    </>
  );
};

export default UpdateSocial;
