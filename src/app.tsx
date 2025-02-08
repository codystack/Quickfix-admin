/* eslint-disable */

import 'src/global.css';
import 'react-toastify/dist/ReactToastify.css';

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';

import { Backdrop, CircularProgress } from '@mui/material';

import { Router } from 'src/routes/sections';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import { ThemeProvider } from 'src/theme/theme-provider';

import type { RootState } from './redux/store';
import { setAuth, setProfile } from './redux/reducers/auth';
import APIService from './service/api.service';


// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();
  const { isLoading } = useSelector((state: RootState) => state.loader);
  const accessToken = localStorage.getItem("accessToken") ?? ""
  const [content, setContent] = React.useState( <Backdrop open sx={{zIndex: 100}} >
    <CircularProgress size={48} />
  </Backdrop>)

  const dispatch = useDispatch();

  React.useEffect(() => {
    if (accessToken) {
      // Now check or refetch data here
      dispatch(setAuth(true));
      try {
        APIService.getProfile().then((resp) => {
          const obj = resp.data;
          dispatch(setProfile(obj))
        }).catch((err) => console.log("PROFILE ERR:: ", err)
        )
      } catch (error) {
        console.log();
        
      }
    }
  }, [accessToken, dispatch])


  return (
    <ThemeProvider>
      <Backdrop open={isLoading}  sx={{zIndex: 1000}} >
        <CircularProgress size={48} />
      </Backdrop>
      <ToastContainer  position='top-right' />
      <Router />
    </ThemeProvider>
  );
}
