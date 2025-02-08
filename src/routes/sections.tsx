import type { RootState } from 'src/redux/store';

import { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import CMS from 'src/pages/cms';
import Orders from 'src/pages/orders';
import Location from 'src/pages/location';
import { varAlpha } from 'src/theme/styles';
import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';
// import ProductDetail from 'src/pages/marketplace/product_detail';

import ProductDetail from 'src/pages/orders/order_detail';

import { AdminsView } from 'src/sections/admins/';
import AdminDetail from 'src/sections/admins/admin-detail';
import UserDetail from 'src/sections/user/view/user-detail';
import { OrderStatusView } from 'src/sections/orders_status';
import { ActivitiesView } from 'src/sections/activities/view';
import { SocialView } from 'src/sections/cms/view/social-view';
import { BannerView } from 'src/sections/cms/view/banner-view';
import AddService from 'src/sections/service/view/add-service';
// import AddNewProduct from 'src/sections/product/view/add_product';
import { SettingsView } from 'src/sections/cms/view/settings-view';
import UpdateService from 'src/sections/service/view/update-service';
// import { TransactionView } from 'src/sections/transaction/view';
import TransactionDetail from 'src/sections/transaction/view/transaction-detail';
import { LocationsView } from 'src/sections/locations';
import AddOrderView from 'src/sections/orders/add_order';
import { ExpressView } from 'src/sections/express';
// import UpdateProduct from 'src/sections/product/view/update_product';
// import InterestDetail from 'src/sections/transaction/view/interest-detail';

// ----------------------------------------------------------------------

export const HomePage = lazy(() => import('src/pages/home'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const SupportPage = lazy(() => import('src/pages/support'));
export const UserPage = lazy(() => import('src/pages/users/user'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const ServicePage = lazy(() => import('src/pages/services/services'));
export const ForgotPasswordPage = lazy(() => import('src/pages/forgot-password'));
export const VerifyOTPPage = lazy(() => import('src/pages/verify-otp'));
export const ResetPasswordPage = lazy(() => import('src/pages/reset-password'));
export const TransactionPage = lazy(() => import('src/pages/transactions'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------

const renderFallback = (
  <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto">
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

export function Router() {
  const { isAuth } = useSelector((state: RootState) => state.auth)
  const { settings } = useSelector((state: RootState) => state.loader)

  return useRoutes([
    {
      path: '',
      element: isAuth ? <Navigate to="/dashboard" replace /> : (
        <AuthLayout>
          <SignInPage />
        </AuthLayout>
      ),
    },
    {
      path: 'forgot-password',
      element: isAuth ? <Navigate to="/dashboard" replace /> : (
        <AuthLayout>
          <ForgotPasswordPage />
        </AuthLayout>
      ),
    },
    {
      path: 'verify-otp',
      element: isAuth ? <Navigate to="/dashboard" replace /> : (
        <AuthLayout>
          <VerifyOTPPage />
        </AuthLayout>
      ),
    },
    {
      path: 'reset-password',
      element: isAuth ? <Navigate to="/dashboard" replace /> : (
        <AuthLayout>
          <ResetPasswordPage />
        </AuthLayout>
      ),
    },
    {
      path: "dashboard",
      element: isAuth ? (
        <DashboardLayout>
          <Suspense fallback={renderFallback}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ) : <Navigate to="/" replace />,
      children: [
        { element: <HomePage />, index: true },
        { path: 'orders', element: <Orders /> },

        { path: 'orders/create', element: <AddOrderView /> },

        { path: 'location', element: <Location /> },

        { path: 'orders/status', element: <OrderStatusView /> },
        { path: 'orders/:id', element: <ProductDetail /> },
        { path: 'users', element: <UserPage /> },
        { path: 'users/:id', element: <UserDetail /> },
        { path: 'transactions', element: <TransactionPage /> },
        { path: 'transactions/:id', element: <TransactionDetail /> },
        { path: 'cms', element: <CMS /> },
        { path: 'cms/social', element: <SocialView /> },
        { path: 'cms/banners', element: <BannerView /> },
        { path: 'cms/admins', element: <AdminsView /> },
        { path: 'cms/locations', element: <LocationsView /> },
        { path: 'cms/express', element: <ExpressView /> },
        { path: 'cms/admins/:id', element: <AdminDetail /> },
        { path: 'cms/settings', element: settings && <SettingsView data={settings[0]}  /> },
        { path: 'activities', element: <ActivitiesView /> },
        { path: 'services', element: <ServicePage /> },
        { path: 'service/add', element: <AddService /> },
        { path: 'service/:id/update', element: <UpdateService /> },
      ],
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
}
