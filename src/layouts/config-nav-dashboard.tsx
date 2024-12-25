import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navData = [
  {
    title: 'Dashboard',
    path: '/',
    icon: icon('ic-analytics'),
  },
  {
    title: 'Orders',
    path: '/dashboard/orders',
    icon: icon('ic-cart'),
  },
  {
    title: 'Orders Status',
    path: '/dashboard/orders/status',
    icon: icon('ic-cart'),
  },
  {
    title: 'Users',
    path: '/dashboard/users',
    icon: icon('ic-user'),
  },
  {
    title: 'Transactions',
    path: '/dashboard/transactions',
    icon: icon('ic-glass-message'),
  },
  {
    title: 'Services',
    path: '/dashboard/services',
    icon: icon('ic-glass-bag'),
  },
  {
    title: 'Activities',
    path: '/dashboard/activities',
    icon: icon('ic-glass-message'),
  },
  {
    title: 'Content Management',
    path: '/dashboard/cms',
    icon: icon('ic-lock'),
  },

];
