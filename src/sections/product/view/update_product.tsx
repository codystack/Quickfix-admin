/* eslint-disable consistent-return */
/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-irregular-whitespace */
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import * as Yup from 'yup';
import { mutate } from 'swr';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
// import { ImagePicker } from '@abak/react-image-picker';
import { useLocation, useNavigate } from 'react-router-dom';

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

const UpdateProduct = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { product } = location.state;

  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const [images, setImages] = React.useState(product?.images);
  const [imgChange, setImgChange] = React.useState(false);

  const validateSchema = Yup.object().shape({
    name: Yup.string().required('Product name is required'),
    amount: Yup.number()
      .positive('Only postive numbers are allowed')
      .required('Product price is required'),
    description: Yup.string().required('Product description is required'),
  });

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
      name: product?.title ?? '',
      amount: product?.amount ?? '',
      description: product?.details ?? '',
    },
    validationSchema: validateSchema,
    onSubmit: async (values) => {
      if (selectedFiles) {
        console.log(values);

        dispatch(setLoading(true));

        // First check for file sizes and filter out here
        // const filteredFiles = selectedFiles.filter((file) => file.size <= 1024 * 1024);
        // console.log('FiLTERED HERE ::: ', filteredFiles);
        // setSelectedFiles(filteredFiles);

        if (selectedFiles.length > 0) {
          // Now convert images to base64
          // const base64Images = selectedFiles.map((file) => URL.createObjectURL(file));
          const base64s = [];
          for (let i = 0; i < selectedFiles.length; i += 1) {
            const base: any = await convertBase64(selectedFiles[i]);
            // const base64Data = base.split(',')[1];
            base64s.push(base);
          }
          console.log('BASE 64 EQUIV :: ', base64s);

          const response = await uploadMultipleImages(base64s);
          console.log('RESPONSE AFTER THE UPLOAD ::: ', response);

          // Now make a trip to create a new product here
          const payload = {
            title: values.name,
            amount: values.amount,
            detail: values.description,
            images: response?.data,
          };

          const addResponse = APIService.updateProduct(payload, product?._id);
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
                const resp = data?.data?.message || 'Product updated successfully';
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
        }
      } else {
        // not upddating image
        // Now make a trip to create a new product here
        const payload = {
          ...product,
          title: values.name,
          amount: values.amount,
          detail: values.description,
        };

        const addResponse = APIService.updateProduct(payload, product?._id);
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
              const resp = data?.data?.message || 'Product updated successfully';
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
      }
    },
  });

  const { getFieldProps, touched, errors, handleSubmit } = formik;

  React.useEffect(() => {
    // Now check the ones with bigger sizes and remove accordingly
    // const filteredFiles = selectedFiles.filter((file) => file.size <= 1024 * 100);
    // console.log("FiLTERED HERE ::: ", filteredFiles);
    // setSelectedFiles(filteredFiles);
  }, [selectedFiles]);

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <IconButton onClick={() => navigate(-1)}>
          <Iconify icon="mdi:arrow-back" />
        </IconButton>
        <Typography px={1} variant="h4" flexGrow={1}>
          Update Product
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
            helperText={Boolean(touched.name && errors.name)}
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
            helperText={Boolean(touched.amount && errors.amount)}
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
        helperText={Boolean(touched.description && errors.description)}
        error={Boolean(touched.description && errors.description)}
      />
      <Toolbar />
      <Typography>Upload Featured Images (100KB max) </Typography>
      {!imgChange ? (
        <Box
          height={256}
          width="100%"
          border="1px solid"
          p={2}
          borderRadius={2}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <Grid container spacing={2}>
            {product?.images?.map((elem: any) => (
              <Grid key={elem} height={200} item xs={12} sm={6} md={4} xl={3}>
                <Box position="relative" width="100%">
                  <IconButton
                    sx={{ mb: -2, mr: -1 }}
                    onClick={() => {
                      const removed = product?.images?.filter((itm: any) => itm !== elem);
                      setImages(removed);
                      if (removed?.length === 0) {
                        setImgChange(true);
                      }
                    }}
                  >
                    <Iconify icon="f7:delete-left-fill" />
                  </IconButton>
                  <img src={elem} alt="" width={144} />
                </Box>
              </Grid>
            ))}
          </Grid>
          <Button variant="contained" onClick={() => setImgChange(true)}>
            Add More
          </Button>
        </Box>
      ) : (
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
            {images.length < 1 ? (
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
          <input type="file" size={1024} hidden id="htns" onChange={handleFileChange} />
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
        // <ImagePicker
        //   dragabble
        //   files={selectedFiles}
        //   onFilesChange={setSelectedFiles}
        //   images={images}
        //   showPreview
        //   multiple
        //   limit={5}
        //   onChange={(e) => {}}
        //   // onRemoveImage={onRemoveImageHandler}
        // />
      )}

      <Box p={2} />
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

export default UpdateProduct;
