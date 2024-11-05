import 'src/global.css';
import 'react-toastify/dist/ReactToastify.css';

import React from 'react';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';

import { Backdrop, CircularProgress } from '@mui/material';

import { Router } from 'src/routes/sections';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import { ThemeProvider } from 'src/theme/theme-provider';

import type { RootState } from './redux/store';


// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();
  const { isLoading } = useSelector((state: RootState) => state.loader);


  return (
    <ThemeProvider>
      <Backdrop open={isLoading}  sx={{zIndex: 100}} >
        <CircularProgress size={48} />
      </Backdrop>
      <ToastContainer  position='top-right' />
      <Router />
    </ThemeProvider>
  );
}
