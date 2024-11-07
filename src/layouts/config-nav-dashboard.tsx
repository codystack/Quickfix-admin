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
    title: 'Bookings',
    path: '/dashboard/bookings',
    icon: icon('ic-blog'),
  },
  {
    title: 'Market Place',
    path: '/dashboard/market-place',
    icon: icon('ic-cart'),
    // info: (
    //   <Label color="error" variant="inverted">
    //     +3
    //   </Label>
    // ),
  },
  {
    title: 'Users',
    path: '/dashboard/users',
    icon: icon('ic-user'),
  },
  {
    title: 'Interests',
    path: '/dashboard/interests',
    icon: icon('ic-glass-bag'),
  },
  {
    title: 'Support',
    path: '/dashboard/support',
    icon: icon('ic-glass-message'),
  },
  {
    title: 'Content Management',
    path: '/dashboard/cms',
    icon: icon('ic-lock'),
  },

];
