import type { BoxProps } from '@mui/material/Box';
import type { Breakpoint } from '@mui/material/styles';
import type { ContainerProps } from '@mui/material/Container';

import React from 'react';
import { useDispatch } from 'react-redux';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';

import useUsers from 'src/hooks/use-users';
import useAdmins from 'src/hooks/use-admins';
import useProfile from 'src/hooks/use-profile';
import useSocials from 'src/hooks/use-socials';
import useBanners from 'src/hooks/use-banners';
import useReasons from 'src/hooks/use-reasons';
import useBookings from 'src/hooks/use-bookings';
import useProducts from 'src/hooks/use-products';
import useSettings from 'src/hooks/use-settings';
import useInterests from 'src/hooks/use-interests';
import useLocations from 'src/hooks/use-locations';
import useActivities from 'src/hooks/use-activities';
import useBookingsCategory from 'src/hooks/use-bookings-category';

import { layoutClasses } from 'src/layouts/classes';
import { setProfile } from 'src/redux/reducers/auth';
import { setSettings } from 'src/redux/reducers/loader';
import { setReasons, setLocations } from 'src/redux/reducers/misc';
import { setBanners, setSocials } from 'src/redux/reducers/banners';
import { setProducts, setInterests } from 'src/redux/reducers/products';
import { setUsers, setAdmins, setActivities } from 'src/redux/reducers/users';
import { setBookings, setSessionBooking, setFastTrackBookings } from 'src/redux/reducers/bookings';

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
  const dispatch = useDispatch();

  // Now fetch and store data into state
  const { data: usersData } = useUsers();
  const { data: adminsData } = useAdmins();
  const { data: profileData } = useProfile();
  const { data: bannersData } = useBanners();
  const { data: socialsData } = useSocials();
  const { data: reasonsData } = useReasons();
  const { data: settingsData } = useSettings();
  const { data: bookingsData } = useBookings(1);
  const { data: productsData } = useProducts(1);
  const { data: locationsData } = useLocations();
  const { data: interestsData } = useInterests(1);
  const { data: activitiesData } = useActivities(1);
  const { data: sessionBookingsData } = useBookingsCategory(1, 'book-session');
  const { data: fastTrackBookingsData } = useBookingsCategory(1, 'fast-track');

  React.useEffect(() => {
    if (usersData) {
      dispatch(setUsers(usersData));
    }

    if (adminsData) {
      dispatch(setAdmins(adminsData));
    }

    if (profileData) {
      dispatch(setProfile(profileData));
    }

    if (bookingsData) {
      dispatch(setBookings(bookingsData));
      dispatch(setSessionBooking(sessionBookingsData));
      dispatch(setFastTrackBookings(fastTrackBookingsData));
    }

    if (productsData) {
      dispatch(setProducts(productsData));
    }

    if (interestsData) {
      dispatch(setInterests(interestsData));
    }

    if (socialsData) {
      dispatch(setSocials(socialsData));
    }

    if (bannersData) {
      dispatch(setBanners(bannersData));
    }

    if (settingsData) {
      dispatch(setSettings(settingsData));
    }

    if (activitiesData) {
      dispatch(setActivities(activitiesData));
    }

    if (locationsData) {
      dispatch(setLocations(locationsData));
    }

    if (reasonsData) {
      dispatch(setReasons(reasonsData));
    }
  }, [
    activitiesData,
    adminsData,
    bannersData,
    bookingsData,
    dispatch,
    fastTrackBookingsData,
    interestsData,
    locationsData,
    productsData,
    profileData,
    reasonsData,
    sessionBookingsData,
    settingsData,
    socialsData,
    usersData,
  ]);

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
