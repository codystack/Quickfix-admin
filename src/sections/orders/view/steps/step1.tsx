/* eslint-disable react/prop-types */
import type { RootState } from 'src/redux/store';

import React from 'react';
import { useSelector } from 'react-redux';

import {
  Box,
  Grid,
  Button,
  Avatar,
  Toolbar,
  TextField,
  Typography,
  Autocomplete,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';
import CustomizedDialog from 'src/components/dialog';

import AddUser from './create_user';

const UserStepForm = ({ setUser, user }: any) => {
  const { usersList } = useSelector((state: RootState) => state.user);
  const [open, setOpen] = React.useState(false);

  return (
    <Box p={2}>
      <CustomizedDialog
        open={open}
        setOpen={setOpen}
        title="Add New User"
        body={<AddUser setOpen={setOpen} setUser={setUser} />}
      />
      <Box p={4} />
      <Grid container spacing={2} display="flex" flexDirection="row" alignItems="center">
        <Grid item xs={12} md={5}>
          <Autocomplete
            id="country-select-demo"
            sx={{ width: 300 }}
            options={usersList}
            autoHighlight
            fullWidth
            onChange={(event: any, newValue: any | null) => {
              // setValue(newValue);
              setUser(newValue);
            }}
            onInputChange={(event, newInputValue) => {
              // setInputValue(newInputValue);
            }}
            getOptionLabel={(option: any) => `${option?.first_name} ${option?.last_name}`}
            renderOption={(props, option) => {
              const { key, ...optionProps } = props;
              return (
                <Box
                  key={key}
                  component="li"
                  sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                  {...optionProps}
                >
                  {/* <img
                loading="lazy"
                width="20"
                srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                alt=""
              /> */}
                  <Typography>{`${option?.first_name} ${option?.last_name}`}</Typography>
                  {/* {option.label} ({option.code}) +{option.phone} */}
                </Box>
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={user ? 'Choose another user' : 'Choose a user'}
                // slotProps={{
                //   htmlInput: {
                //     ...params.inputProps,
                //     autoComplete: 'new-password', // disable autocomplete and autofill
                //   },
                // }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <Typography>OR</Typography>
        </Grid>
        <Grid item xs={12} md={5}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => setOpen(true)}
          >
            Create New User
          </Button>
        </Grid>
      </Grid>
      <Toolbar />
      {user && (
        <Box display="flex" flexDirection="row" justifyContent="start" alignItems="center">
          <Avatar variant="rounded">{`${user?.first_name.toString().substring(0, 1)}${user?.last_name?.toString().substring(0, 1)}`}</Avatar>
          <Box p={1} />
          <Box display="flex" flexDirection="column" justifyContent="start" alignItems="start">
            <Typography>{`${user?.first_name} ${user?.last_name}`}</Typography>
            <Typography fontSize={12}>{`${user?.email_address}`}</Typography>
            <Typography fontSize={12}>{`${user?.phone_number}`}</Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default UserStepForm;
