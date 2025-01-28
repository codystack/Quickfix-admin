import type { BoxProps } from '@mui/material/Box';
import type { Breakpoint } from '@mui/material/styles';
import type { ContainerProps } from '@mui/material/Container';

import React from 'react';
import { useDispatch } from 'react-redux';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';

import useAdmins from 'src/hooks/use-admins';
import useOrders from 'src/hooks/use-orders';
import useProfile from 'src/hooks/use-profile';
import useSocials from 'src/hooks/use-socials';
import useBanners from 'src/hooks/use-banners';
import useExpress from 'src/hooks/use-express';
import useSettings from 'src/hooks/use-settings';
import useServices from 'src/hooks/use-services';
import useActivities from 'src/hooks/use-activities';
import useTransactions from 'src/hooks/use-transactions';
import useOrderStatus from 'src/hooks/use-orders-status';
import useUsers, { useUsersList } from 'src/hooks/use-users';
import useOrderCategory from 'src/hooks/use-orders-category';
import useLocations, { useLocationsList } from 'src/hooks/use-locations';

import { layoutClasses } from 'src/layouts/classes';
import { setProfile } from 'src/redux/reducers/auth';
import { setSettings } from 'src/redux/reducers/loader';
import { setServices } from 'src/redux/reducers/services';
import { setExpressList } from 'src/redux/reducers/express';
import { setTransactions } from 'src/redux/reducers/transactions';
import { setBanners, setSocials } from 'src/redux/reducers/banners';
import { setLocations, setLocationList } from 'src/redux/reducers/locations';
import { setUsers, setAdmins, setUsersList, setActivities } from 'src/redux/reducers/users';
import {
  setOrders,
  setWashedOrders,
  setIronedOrders,
  setCarWashOrders,
  setLaundryOrders,
  setPendingOrders,
  setDamagedOrders,
  setCleaningOrders,
  setPackagedOrders,
  setDeclinedOrders,
  setDeliveredOrders,
} from 'src/redux/reducers/orders';

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
  const { data: usersData } = useUsers(1);
  const { data: usersListData } = useUsersList();
  const { data: adminsData } = useAdmins(1);
  const { data: profileData } = useProfile();
  const { data: bannersData } = useBanners();
  const { data: socialsData } = useSocials();
  const { data: servicesData } = useServices(1);
  const { data: settingsData } = useSettings();
  const { data: ordersData } = useOrders(1);
  const { data: transactionsData } = useTransactions(1);
  const { data: activitiesData } = useActivities(1);
  const { data: laundryOrdersData } = useOrderCategory(1, 'laundry');
  const { data: cleaningOrdersData } = useOrderCategory(1, 'cleaning');
  const { data: carwashOrdersData } = useOrderCategory(1, 'car_wash');

  const { data: pendingOrdersData } = useOrderStatus(1, 'pending');
  const { data: washedOrdersData } = useOrderStatus(1, 'washed');
  const { data: ironedOrdersData } = useOrderStatus(1, 'ironed');
  const { data: packagedOrdersData } = useOrderStatus(1, 'packaged');
  const { data: deliveredOrdersData } = useOrderStatus(1, 'delivered');
  const { data: declinedOrdersData } = useOrderStatus(1, 'declined');
  const { data: damagedOrdersData } = useOrderStatus(1, 'damaged');

  const { data: expressData } = useExpress();
  const { data: locationsData } = useLocations(1);
  const { data: locationListData } = useLocationsList();

  React.useEffect(() => {
    if (usersData) {
      dispatch(setUsers(usersData));
    }

    if (usersListData) {
      dispatch(setUsersList(usersListData));
    }

    if (adminsData) {
      dispatch(setAdmins(adminsData));
    }

    if (profileData) {
      dispatch(setProfile(profileData));
    }

    if (ordersData) {
      dispatch(setOrders(ordersData));
      dispatch(setLaundryOrders(laundryOrdersData));
      dispatch(setCleaningOrders(cleaningOrdersData));
      dispatch(setCarWashOrders(carwashOrdersData));
    }

    if (pendingOrdersData) {
      dispatch(setPendingOrders(pendingOrdersData));
    }

    if (washedOrdersData) {
      dispatch(setWashedOrders(washedOrdersData));
    }

    if (ironedOrdersData) {
      dispatch(setIronedOrders(ironedOrdersData));
    }

    if (packagedOrdersData) {
      dispatch(setPackagedOrders(packagedOrdersData));
    }

    if (deliveredOrdersData) {
      dispatch(setDeliveredOrders(deliveredOrdersData));
    }

    if (declinedOrdersData) {
      dispatch(setDeclinedOrders(declinedOrdersData));
    }

    if (damagedOrdersData) {
      dispatch(setDamagedOrders(damagedOrdersData));
    }

    if (servicesData) {
      dispatch(setServices(servicesData));
    }

    if (transactionsData) {
      dispatch(setTransactions(transactionsData));
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

    if (locationListData) {
      dispatch(setLocationList(locationListData));
    }

    if (expressData) {
      dispatch(setExpressList(expressData));
    }
  }, [
    activitiesData,
    expressData,
    adminsData,
    bannersData,
    carwashOrdersData,
    cleaningOrdersData,
    damagedOrdersData,
    declinedOrdersData,
    deliveredOrdersData,
    dispatch,
    ironedOrdersData,
    laundryOrdersData,
    locationListData,
    locationsData,
    ordersData,
    packagedOrdersData,
    pendingOrdersData,
    profileData,
    servicesData,
    settingsData,
    socialsData,
    transactionsData,
    usersData,
    usersListData,
    washedOrdersData,
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
