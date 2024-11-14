
import React from 'react';
import * as Yup from 'yup';
import { mutate } from 'swr';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// import { ImagePicker } from '@abak/react-image-picker';

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
  const [images, setImages] = React.useState([]);

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

  const formik = useFormik({
    initialValues: {
      name: '',
      amount: 0,
      description: '',
    },
    validationSchema: validateSchema,
    onSubmit: async (values) => {
      console.log(values);

      dispatch(setLoading(true));

      // First check for file sizes and filter out here
      const filteredFiles = selectedFiles.filter((file) => file.size <= 1024 * 1024);
      console.log('FiLTERED HERE ::: ', filteredFiles);
      setSelectedFiles(filteredFiles);

      if (selectedFiles.length > 0) {
        // Now convert images to base64
        // const base64Images = selectedFiles.map((file) => URL.createObjectURL(file));
        const base64s = [];
        for (let i = 0; i < selectedFiles.length; i += 1) {
          const base: any = convertBase64(selectedFiles[i]);
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
          images: response?.data
        }

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
              console.log("SUCCESS :: ", data);
              dispatch(setLoading(false));
              mutate('/marketplace/all')
              const resp = data?.data?.message || "New product added successfully"
              return `${resp}`;
            },
          },
          error: {
            render({ data }: any) {
              dispatch(setLoading(false));
              console.log('ERRO ON TOAST HERE :: ', data?.response?.data?.message);
              const errorMsg =  data?.response?.data?.message || data?.message || ""
              // When the promise reject, data will contains the error
              return `${errorMsg ?? 'An error occurred!'}`;
            },
          },
        })
      } else {
        toast.error('Add at least one featured image');
        dispatch(setLoading(false));
      }
    },
  });

  const { getFieldProps, touched, errors, handleSubmit } = formik;

  React.useEffect(() => {
      // Now check the ones with bigger sizes and remove accordingly
      // const filteredFiles = selectedFiles.filter((file) => file.size <= 1024 * 100);
      // console.log("FiLTERED HERE ::: ", filteredFiles);

      // setSelectedFiles(filteredFiles);

  }, [selectedFiles])

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
      <Typography>Upload Featured Images (100KB max) </Typography>
      {/* <ImagePicker
        dragabble
        files={selectedFiles}
        onFilesChange={setSelectedFiles}
        images={images}
        showPreview
        multiple
        limit={5}
        onChange={(e) => {}}
        // onRemoveImage={onRemoveImageHandler}
      /> */}
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

export default AddNewProduct;
