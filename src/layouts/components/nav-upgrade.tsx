import type { StackProps } from '@mui/material/Stack';

import React from 'react';
import { useDispatch } from 'react-redux';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

// import { textGradient } from 'src/theme/styles';
import { setLoading } from 'src/redux/reducers/loader';
import { setAuth, setProfile } from 'src/redux/reducers/auth';

// ----------------------------------------------------------------------

export function NavUpgrade({ sx, ...other }: StackProps) {
  const dispatch = useDispatch();

  return (
    <Box
      display="flex"
      alignItems="center"
      flexDirection="column"
      sx={{ mb: 4, textAlign: 'center', ...sx }}
      {...other}
    >
      {/* <Typography
        variant="body1"
        sx={(theme) => ({
          ...textGradient(
            `to right, ${theme.vars.palette.secondary.main}, ${theme.vars.palette.warning.main}`
          ),
        })}
        gutterBottom
      >
        Version 1.0.1
      </Typography> */}
      {/* <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
        {`From only `}
        <Box component="strong" sx={{ color: 'text.primary' }}>
          $69
        </Box>
      </Typography> */}

      {/* <Box
        component="img"
        alt="Minimal dashboard"
        src="/assets/illustrations/illustration-dashboard.webp"
        sx={{ width: 200, my: 2 }}
      /> */}

      <Button
        variant="contained"
        sx={{
          backgroundColor: "white",
          color: "#06413d",
        }}
        color="inherit"
        onClick={() => {
          dispatch(setLoading(true));
          setTimeout(() => {
            localStorage.removeItem('accessToken');
            dispatch(setProfile(null));
            dispatch(setAuth(false))
            dispatch(setLoading(false));
          }, 3000);
        }}
      >
        Logout
      </Button>
    </Box>
  );
}
