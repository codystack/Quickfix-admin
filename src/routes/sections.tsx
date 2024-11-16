import type { RootState } from 'src/redux/store';

import { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import CMS from 'src/pages/cms';
import Bookings from 'src/pages/bookings';
import { varAlpha } from 'src/theme/styles';
import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';
import ProductDetail from 'src/pages/marketplace/product_detail';

import { AdminsView } from 'src/sections/admins/view';
import UserDetail from 'src/sections/user/view/user-detail';
import { ActivitiesView } from 'src/sections/activities/view';
import { SocialView } from 'src/sections/cms/view/social-view';
import { BannerView } from 'src/sections/cms/view/banner-view';
import AdminDetail from 'src/sections/admins/view/admin-detail';
import AddNewProduct from 'src/sections/product/view/add_product';
import { SettingsView } from 'src/sections/cms/view/settings-view';
import UpdateProduct from 'src/sections/product/view/update_product';
import InterestDetail from 'src/sections/interest/view/interest-detail';

// ----------------------------------------------------------------------

export const HomePage = lazy(() => import('src/pages/home'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const InterestPage = lazy(() => import('src/pages/interests/interest'));
export const SupportPage = lazy(() => import('src/pages/support'));
export const UserPage = lazy(() => import('src/pages/users/user'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const ReasonsPage = lazy(() => import('src/pages/reasons'));
export const LocationsPage = lazy(() => import('src/pages/locations/location'));
export const ForgotPasswordPage = lazy(() => import('src/pages/forgot-password'));
export const VerifyOTPPage = lazy(() => import('src/pages/verify-otp'));
export const ResetPasswordPage = lazy(() => import('src/pages/reset-password'));
export const ProductsPage = lazy(() => import('src/pages/marketplace'));
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
        { path: 'bookings', element: <Bookings /> },
        { path: 'users', element: <UserPage /> },
        { path: 'users/:id', element: <UserDetail /> },
        { path: 'market-place', element: <ProductsPage /> },
        { path: 'market-place/product/:id', element: <ProductDetail /> },
        { path: 'cms', element: <CMS /> },
        { path: 'cms/social', element: <SocialView /> },
        { path: 'cms/banners', element: <BannerView /> },
        { path: 'cms/admins', element: <AdminsView /> },
        { path: 'cms/admins/:id', element: <AdminDetail /> },
        { path: 'cms/contact', element: settings && <SettingsView data={settings[0]}  /> },
        { path: 'activities', element: <ActivitiesView /> },
        { path: 'interests', element: <InterestPage /> },
        { path: 'locations', element: <LocationsPage /> },
        { path: 'reasons', element: <ReasonsPage /> },
        { path: 'interests/:id', element: <InterestDetail /> },
        { path: 'product/new', element: <AddNewProduct /> },
        { path: 'product/:id/update', element: <UpdateProduct /> },
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
