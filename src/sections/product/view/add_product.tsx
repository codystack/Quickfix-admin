/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-await-in-loop */
import React from 'react';
import * as Yup from 'yup';
import { mutate } from 'swr';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// import { ImagePicker } from '@abak/react-image-picker';

import imageCompression from 'browser-image-compression';

import {
  Box,
  Grid,
  Button,
  Toolbar,
  useTheme,
  TextField,
  IconButton,
  Typography,
} from '@mui/material';

import convertBase64 from 'src/utils/image-converter';

import APIService from 'src/service/api.service';
import { setLoading } from 'src/redux/reducers/loader';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

const AddNewProduct = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const [images, setImages] = React.useState<any>([]);

  // dispatch(setLoading(false))

  const validateSchema = Yup.object().shape({
    name: Yup.string().required('Product name is required'),
    amount: Yup.number()
      .positive('Only postive numbers are allowed')
      .required('Product price is required'),
    description: Yup.string().required('Product description is required'),
  });

  // eslint-disable-next-line consistent-return
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

  const handleFileChange = (event: any) => {
    const selectedFile: any = event.target.files[0];
    console.log('FILE INFO  ::: ', selectedFile);

    if (selectedFile) {
      try {
        setSelectedFiles([...selectedFiles, selectedFile]);
        setImages([...images, URL.createObjectURL(selectedFile)]);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      amount: 0,
      description: '',
    },
    validationSchema: validateSchema,
    onSubmit: async (values) => {
      dispatch(setLoading(true));
      const options = {
        maxSizeMB: 0.05859375, // Target size in MB
        maxWidthOrHeight: 400, // Maximum dimension (width/height) in pixels
      };

      // First check for file sizes and filter out here
      const filteredFiles = selectedFiles.filter((file) => file.size <= 1024 * 1024);
      console.log('FiLTERED HERE ::: ', filteredFiles);
      setSelectedFiles(filteredFiles);

      if (selectedFiles.length > 0) {
        // Now convert images to base64
        // const base64Images = selectedFiles.map((file) => URL.createObjectURL(file));
        const base64s = [];
        const compresseds = [];
        for (let i = 0; i < selectedFiles.length; i += 1) {
          // First compress files
          const compressedFile = await imageCompression(selectedFiles[i], options);

          const base: any = await convertBase64(compressedFile);
          console.log('FILE ITEMITER ::: ', base);

          base64s.push(base);
        }
        console.log('BASE 64 EQUIV :: ', base64s);

        const response = await uploadMultipleImages(base64s);
        console.log('RESPONSE AFTER THE UPLOAD ::: ', response);

        const imageUrls = response.data.map((res: any) => res);

        console.log('RETRIEVED IMAGEURLS ::: ', imageUrls);

        // Now make a trip to create a new product here
        const payload = {
          title: values.name,
          amount: values.amount,
          detail: values.description,
          images: imageUrls,
        };

        const addResponse = APIService.addProduct(payload);
        toast.promise(addResponse, {
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
              mutate('/marketplace/all');
              const resp = data?.data?.message || 'New product added successfully';
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
      } else {
        toast.error('Add at least one featured image');
        dispatch(setLoading(false));
      }
    },
  });

  const { getFieldProps, touched, errors, handleSubmit } = formik;

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <IconButton onClick={() => navigate(-1)}>
          <Iconify icon="mdi:arrow-back" />
        </IconButton>
        <Typography px={1} variant="h4" flexGrow={1}>
          New Product
        </Typography>
      </Box>
      <Toolbar />
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            placeholder="Enter product name"
            variant="outlined"
            label="Name"
            fullWidth
            {...getFieldProps('name')}
            helperText={errors.name}
            error={Boolean(touched.name && errors.name)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            placeholder="Enter product amount"
            variant="outlined"
            label="Amount"
            fullWidth
            type="number"
            {...getFieldProps('amount')}
            helperText={errors.amount}
            error={Boolean(touched.amount && errors.amount)}
          />
        </Grid>
      </Grid>
      <Box p={2} />
      <TextField
        placeholder="Enter product description"
        variant="outlined"
        label="Description"
        multiline
        minRows={3}
        fullWidth
        {...getFieldProps('description')}
        helperText={errors.description}
        error={Boolean(touched.description && errors.description)}
      />

      <Toolbar />
      <Box
        p={2}
        border="1px solid"
        borderRadius={2}
        minHeight={256}
        display="flex"
        flexDirection="row"
        justifyContent="start"
        alignItems="center"
      >
        <Box>
          {selectedFiles.length < 1 ? (
            <Typography>No images added</Typography>
          ) : (
            <Grid container spacing={2}>
              {images.map((it: any, key: number) => (
                <Grid key={key} item xs={12} sm={6} md={4} lg={3}>
                  <Box
                    position="relative"
                    width="100%"
                    display="flex"
                    flexDirection="column"
                    justifyContent="start"
                    alignItems="stretch"
                  >
                    <IconButton
                      sx={{ alignSelf: 'flex-end', mb: -2 }}
                      onClick={() => {
                        const filtered = images.filter((itm: any) => itm !== it);
                        setImages(filtered);
                        const newFiles = [
                          ...selectedFiles.slice(0, key),
                          ...selectedFiles.slice(key + 1),
                        ];
                        setSelectedFiles(newFiles);
                      }}
                    >
                      <Iconify icon="mynaui:delete-solid" />
                    </IconButton>
                    <img src={it} alt="" width={150} />
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
        <Button
          variant="contained"
          sx={{ px: 2, mx: 1 }}
          onClick={() => {
            document.getElementById('htns')?.click();
          }}
        >
          Add More
        </Button>
      </Box>
      {/* <Typography>Upload Featured Images (100KB max) </Typography> */}

      <Box p={2} />
      <input type="file" size={1024} hidden id="htns" onChange={handleFileChange} />
      <Button
        variant="contained"
        sx={{ bgcolor: theme.palette.secondary.main, py: 1 }}
        onClick={() => handleSubmit()}
      >
        Submit
      </Button>
    </DashboardContent>
  );
};

export default AddNewProduct;
