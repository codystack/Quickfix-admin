import type { RootState } from 'src/redux/store';

import * as Yup from 'yup';
import { mutate } from 'swr';
import { useState } from 'react';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import {
  Box,
  Grid,
  Button,
  Toolbar,
  useTheme,
  TextField,
  IconButton,
  Typography,
  InputLabel,
  FormControl,
  NativeSelect,
  OutlinedInput,
  FormHelperText,
} from '@mui/material';

import { fNumber } from 'src/utils/format-number';
import convertBase64 from 'src/utils/image-converter';

import APIService from 'src/service/api.service';
import { setLoading } from 'src/redux/reducers/loader';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

const categories = [
  {
    label: 'Laundry',
    value: 'laundry',
  },
  {
    label: 'Car Wash',
    value: 'car_wash',
  },
  {
    label: 'Cleaning',
    value: 'cleaning',
  },
];

const UpdateService = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { data } = location.state;

  const [file, setFile] = useState<any>(null);
  const [preview, setPreview] = useState<any>(data?.icon_url);
  const { isLoading } = useSelector((state: RootState) => state.loader);
  const [items, setItems] = useState<any>(data?.items);
  const [showInputs, setShowInputs] = useState(false);
  const [showInputs2, setShowInputs2] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);

  const validate = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    category: Yup.string().required('Category is required'),
    description: Yup.string().nullable(),
  });

  //   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

  const formik = useFormik({
    initialValues: {
      title: data?.title ?? '',
      category: data?.category ?? '',
      description: data?.description ?? '',
    },
    validationSchema: validate,
    onSubmit: async (values) => {
      try {
        if (file) {
          dispatch(setLoading(true));

          // Upload image to cloudinary first
          const base64: any = await convertBase64(file);

          const resp = await APIService.singleImageUpload({
            image: base64,
          });
          console.log('RESPONSE AFTER THE UPLOAD ::: ', resp);

          // Now make a trip to create a new product here
          const payload = {
            title: values.title,
            category: values.category,
            icon_url: resp?.data,
            description: values.description,
            items,
          };

          const response = APIService.updateService(payload, data?._id ?? data?.id);
          toast.promise(response, {
            pending: {
              render() {
                return 'Loading. Please wait...';
              },
              icon: false,
            },
            success: {
              render({ data: dt }) {
                dispatch(setLoading(false));
                mutate('/services/all');
                const res = dt?.data?.message || 'Service updated successfully';
                navigate(-1);
                return `${res}`;
              },
            },
            error: {
              render({ data: errDt }: any) {
                dispatch(setLoading(false));
                console.log('ERRO ON TOAST HERE :: ', errDt?.response?.data?.message);
                const errorMsg = errDt?.response?.data?.message || errDt?.message || '';
                // When the promise reject, data will contains the error
                return `${errorMsg ?? 'An error occurred!'}`;
              },
            },
          });
        } else {
          // Update with changing icon
          const payload = {
            title: values.title,
            category: values.category,
            icon_url: data?.icon_url,
            description: values.description,
            items,
          };

          const response = APIService.updateService(payload, data?._id ?? data?.id);
          toast.promise(response, {
            pending: {
              render() {
                return 'Loading. Please wait...';
              },
              icon: false,
            },
            success: {
              render({ data: dt }) {
                dispatch(setLoading(false));
                mutate('/services/all');
                const res = dt?.data?.message || 'Service updated successfully';
                navigate(-1);
                return `${res}`;
              },
            },
            error: {
              render({ data: errDt }: any) {
                dispatch(setLoading(false));
                console.log('ERRO ON TOAST HERE :: ', errDt?.response?.data?.message);
                const errorMsg = errDt?.response?.data?.message || errDt?.message || '';
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

  const { touched, errors, getFieldProps, handleSubmit } = formik;

  const handleButtonClick = () => {
    document.getElementById('file-input')?.click();
  };

  return (
    <DashboardContent>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        mb={5}
        mt={1}
      >
        <Box display="flex" flexDirection="row" justifyContent="start" alignItems="start">
          <IconButton onClick={() => navigate(-1)}>
            <Iconify icon="eva:arrow-back-fill" color="inherit" />
          </IconButton>
          <Typography px={1} variant="h4" flexGrow={1}>
            Update Service
          </Typography>
        </Box>
      </Box>
      <Toolbar />
      <Box p={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              variant="outlined"
              fullWidth
              required
              placeholder="Service title"
              label="Title"
              {...getFieldProps('title')}
              error={Boolean(touched.title && errors.title)}
              helperText={Boolean(touched.title && errors.title)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl
              fullWidth
              variant="outlined"
              required
              error={Boolean(touched.category && errors.category)}
            >
              <InputLabel variant="outlined" htmlFor="ids">
                Category
              </InputLabel>
              <NativeSelect
                inputProps={{
                  name: 'category',
                  id: 'ids',
                }}
                input={<OutlinedInput label="Service Category" {...getFieldProps('category')} />}
              >
                <option disabled>Select service category</option>
                {categories?.map((elem) => (
                  <option key={elem.value} value={elem.value}>
                    {elem.label}
                  </option>
                ))}
              </NativeSelect>
              <FormHelperText>{Boolean(touched.category && errors.category)}</FormHelperText>
            </FormControl>
          </Grid>
        </Grid>
        <Box p={2} />
        <TextField
          variant="outlined"
          fullWidth
          placeholder="Service description"
          label="Description"
          multiline
          minRows={2}
          {...getFieldProps('description')}
          error={Boolean(touched.description && errors.description)}
          helperText={Boolean(touched.description && errors.description)}
        />
        <Box p={2} />
        <Typography variant="body2">Service Icon</Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 2,
            border: '2px dashed #1976d2',
            borderRadius: '8px',
            width: '100%',
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
          <img alt="" src={preview} width="100%" style={{ maxHeight: 400 }} />
          <Typography variant="body1" color="textSecondary">
            {file ? '' : 'No file selected'}
          </Typography>
        </Box>
        <Box p={2} />

        {items?.length < 1 && (
          <Button onClick={() => setShowInputs(true)}>
            {items?.length > 0 ? 'Add More Items' : 'Add Items and Price*'}
          </Button>
        )}
        {showInputs && (
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  fullWidth
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  label="Name"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  type="number"
                  fullWidth
                  placeholder="Enter unit price"
                  label="Price"
                  required
                  value={price}
                  onChange={(e) => {
                    setPrice(parseInt(e.target.value, 10));
                  }}
                />
              </Grid>
            </Grid>
            <Box p={1} />
            <Button
              variant="contained"
              onClick={() => {
                const obj: any = {
                  name,
                  price,
                };
                // const it = items.push(obj);
                setItems([...items, obj]);
                setName('');
                setPrice(0);
                setShowInputs(false);
              }}
            >
              Save
            </Button>
          </Box>
        )}

        <Box p={1} />
        {items?.length > 0 && (
          <Typography sx={{ textDecoration: 'underline' }}>Items & Pricing</Typography>
        )}
        <Grid container spacing={1}>
          {items?.map((elem: any, index: number) => (
            <Grid item key={index} xs={12} sm={6}>
              <Box display="flex" flexDirection="row" justifyContent="start" alignItems="center">
                <Typography px={1}>{index + 1}.</Typography>
                <Typography>{elem?.name}</Typography>
                <Typography pl={4}>₦{fNumber(elem?.price)}</Typography>
                <Box px={2} />
                <IconButton
                  onClick={() => {
                    const filtered = items?.filter((el: any) => el !== elem);
                    setItems(filtered);
                  }}
                >
                  <Iconify icon="carbon:delete" />
                </IconButton>
              </Box>
            </Grid>
          ))}
        </Grid>
        <Box p={0.5} />
        {items?.length > 0 && <Button onClick={() => setShowInputs2(true)}>Add More Items</Button>}
        <Box p={1} />
        {showInputs2 && (
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  fullWidth
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  label="Name"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  type="number"
                  fullWidth
                  placeholder="Enter unit price"
                  label="Price"
                  required
                  value={price}
                  onChange={(e) => {
                    setPrice(parseInt(e.target.value, 10));
                  }}
                />
              </Grid>
            </Grid>
            <Box p={1} />
            <Button
              variant="contained"
              onClick={() => {
                const obj: any = {
                  name,
                  price,
                };
                // const it = items.push(obj);
                setItems([...items, obj]);
                setName('');
                setPrice(0);
                setShowInputs(false);
                setShowInputs2(false);
              }}
            >
              Save
            </Button>
          </Box>
        )}
        <Box p={2} />

        <Button
          fullWidth
          disabled={isLoading || items?.length < 1}
          variant="contained"
          onClick={() => handleSubmit()}
          sx={{ bgcolor: theme.palette.secondary.main }}
        >
          Submit
        </Button>
      </Box>
    </DashboardContent>
  );
};

export default UpdateService;
