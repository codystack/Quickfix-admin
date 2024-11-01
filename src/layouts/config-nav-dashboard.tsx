import { Label } from 'src/components/label';
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
    path: '/bookings',
    icon: icon('ic-user'),
  },
  {
    title: 'Market Place',
    path: '/market-place',
    icon: icon('ic-cart'),
    // info: (
    //   <Label color="error" variant="inverted">
    //     +3
    //   </Label>
    // ),
  },
  {
    title: 'Users',
    path: '/users',
    icon: icon('ic-user'),
  },
  {
    title: 'Interests',
    path: '/interests',
    icon: icon('ic-blog'),
  },
  {
    title: 'Support',
    path: '/support',
    icon: icon('ic-help'),
  },
  {
    title: 'Content Management',
    path: '/cms',
    icon: icon('ic-lock'),
  },

];
