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

import UserDetail from 'src/sections/user/view/user-detail';
import AddNewProduct from 'src/sections/product/view/add_new';
import { SocialView } from 'src/sections/cms/view/social-view';
import { BannerView } from 'src/sections/cms/view/banner-view';

// ----------------------------------------------------------------------

export const HomePage = lazy(() => import('src/pages/home'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const InterestPage = lazy(() => import('src/pages/interests/interest'));
export const SupportPage = lazy(() => import('src/pages/support'));
export const UserPage = lazy(() => import('src/pages/users/user'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
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
  const { isAuth } = useSelector((state: any) => state.auth)

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
        { path: 'support', element: <SupportPage /> },
        { path: 'interests', element: <InterestPage /> },
        { path: 'product/new', element: <AddNewProduct /> },
        // { path: 'product/:id/detail', element: <ProductDetail /> },
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
