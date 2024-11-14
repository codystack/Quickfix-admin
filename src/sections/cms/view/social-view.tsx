/* eslint-disable jsx-a11y/alt-text */
import type { RootState } from 'src/redux/store';

import * as Yup from 'yup';
import { mutate } from 'swr';
import { useState } from 'react';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Grid, Card, Button, Toolbar, useTheme, TextField, IconButton } from '@mui/material';

import convertBase64 from 'src/utils/image-converter';

import APIService from 'src/service/api.service';
import { setLoading } from 'src/redux/reducers/loader';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import CustomizedDialog from 'src/components/dialog';

import { RenderConfirmation } from 'src/sections/booking/booking-table-row';

import UpdateSocial from './update-social';

// ----------------------------------------------------------------------

export function SocialView() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const { socials } = useSelector((state: RootState) => state.banner);

  return (
    <DashboardContent>
      <CustomizedDialog
        open={open}
        setOpen={setOpen}
        title="Add Social Platform"
        body={<AddSocial setOpen={setOpen} />}
      />

      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        mb={5}
        width="100%"
      >
        <Box display="flex" flexDirection="row" justifyContent="start" alignItems="center">
          <IconButton onClick={() => navigate(-1)}>
            <Iconify icon="mdi:arrow-back" />
          </IconButton>
          <Typography px={1} variant="h4" flexGrow={1}>
            Social Links
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="inherit"
          onClick={() => setOpen(true)}
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          Add New
        </Button>
      </Box>
      <Toolbar />
      <Box>
        <Grid container spacing={2}>
          {socials &&
            socials?.map((elem: any) => <Item elem={elem} />)}
        </Grid>
      </Box>
    </DashboardContent>
  );
}

const Item = ({ elem }: any) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [openDel, setOpenDel] = useState(false);

  const deleteSocial = async () => {
    dispatch(setLoading(true));
    const response = APIService.removeSocial(elem?._id);
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
          setOpenDel(false);
          mutate('/admins/socials/all');
          const resp = data?.data?.message || 'Operation successful';
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
  };

  return (
    <Grid item xs={12} sm={6} md={4}>
      <CustomizedDialog
        open={open}
        setOpen={setOpen}
        title="Edit Social Platform"
        body={<UpdateSocial setOpen={setOpen} social={elem} />}
      />

      <CustomizedDialog
        open={openDel}
        setOpen={setOpenDel}
        title="Delete Social Platform"
        body={
          <RenderConfirmation
            setOpen={setOpenDel}
            message="Are you sure you want to delete this social platform?"
            action={() => deleteSocial()}
          />
        }
      />
      <Card
        component={Box}
        p={2}
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box display="flex" flexDirection="row" justifyContent="start" alignItems="center">
          <img src={elem?.logo} width={48} height={48} style={{ borderRadius: 24 }} />
          <Typography variant="h5" pl={2}>
            {elem?.name}
          </Typography>
        </Box>
        <Box display="flex" flexDirection="column" justifyContent="start" alignItems="center">
          <IconButton
            onClick={() => {
              setOpen(true);
            }}
          >
            <Iconify icon="mdi:edit" />
          </IconButton>
          <IconButton onClick={() => setOpenDel(true)} >
            <Iconify icon="material-symbols-light:delete" />
          </IconButton>
        </Box>
      </Card>
    </Grid>
  );
};

const AddSocial = ({ setOpen }: any) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [file, setFile] = useState<File>();
  const { isLoading } = useSelector((state: RootState) => state.loader);
  const validate = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    url: Yup.string().url('Enter a valid URL').required('Url is required'),
  });

  const handleFileChange = (event: any) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      url: '',
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
            name: values.name,
            url: values.url,
            logo: resp?.data,
          };

          const response = APIService.addSocial(payload);
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
                const res = data?.data?.message || 'Social platform added successfully';
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
        console.log('SOCIAL ERR :: ', error);
      }
    },
  });

  const { touched, errors, getFieldProps, handleSubmit } = formik;
  return (
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
        helperText={touched.name && errors.name}
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
        helperText={touched.url && errors.url}
      />
      <Box p={1} />
      <TextField type="file" fullWidth required variant="outlined" onChange={handleFileChange} />

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
