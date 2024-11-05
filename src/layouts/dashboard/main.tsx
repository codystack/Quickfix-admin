import type { BoxProps } from '@mui/material/Box';
import type { Breakpoint } from '@mui/material/styles';
import type { ContainerProps } from '@mui/material/Container';

import React from 'react';
import { useDispatch } from 'react-redux';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';

import useUsers from 'src/hooks/use-users';
import useBookings from 'src/hooks/use-bookings';
import useProducts from 'src/hooks/use-products';
import useInterests from 'src/hooks/use-interests';

import { layoutClasses } from 'src/layouts/classes';
import { setUsers } from 'src/redux/reducers/users';
import { setBookings } from 'src/redux/reducers/bookings';
import { setProducts, setInterests } from 'src/redux/reducers/products';

// ----------------------------------------------------------------------

export function Main({ children, sx, ...other }: BoxProps) {
  return (
    <Box
      component="main"
      className={layoutClasses.main}
      sx={{
        display: 'flex',
        flex: '1 1 auto',
        flexDirection: 'column',
        ...sx,
      }}
      {...other}
    >
      {children}
    </Box>
  );
}

// ----------------------------------------------------------------------

type DashboardContentProps = ContainerProps & {
  disablePadding?: boolean;
};

export function DashboardContent({
  sx,
  children,
  disablePadding,
  maxWidth = 'xl',
  ...other
}: DashboardContentProps) {
  const theme = useTheme();

  const layoutQuery: Breakpoint = 'lg';
  const dispatch = useDispatch()

  // Now fetch and store data into state
  const {  data: usersData, } = useUsers();
  const {  data: bookingsData, } = useBookings(1);
  const {  data: productsData, } = useProducts(1);
  const {  data: interestsData, } = useInterests(1);

  console.log("BOOKINGS NOW :: ", bookingsData);
  

  React.useEffect(() => {
    if (usersData) {
      dispatch(setUsers(usersData));
    }

    if (bookingsData) {
      dispatch(setBookings(bookingsData));
    }

    if (productsData) {
      dispatch(setProducts(productsData));
    }

    if (interestsData) {
      dispatch(setInterests(interestsData));
    }
  }, [bookingsData, dispatch, interestsData, productsData, usersData])


  return (
    <Container
      className={layoutClasses.content}
      maxWidth={maxWidth || false}
      sx={{
        display: 'flex',
        flex: '1 1 auto',
        flexDirection: 'column',
        pt: 'var(--layout-dashboard-content-pt)',
        pb: 'var(--layout-dashboard-content-pb)',
        [theme.breakpoints.up(layoutQuery)]: {
          px: 'var(--layout-dashboard-content-px)',
        },
        ...(disablePadding && {
          p: {
            xs: 0,
            sm: 0,
            md: 0,
            lg: 0,
            xl: 0,
          },
        }),
        ...sx,
      }}
      {...other}
    >
      {children}
    </Container>
  );
}
