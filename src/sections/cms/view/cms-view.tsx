import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { Card, CardActionArea } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function CMSView() {
  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Content Management
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid xs={12} sm={7} md={8}>
          <CardItem
            title="Banner Slides"
            routeTo="/dashboard/cms/banners"
            description="Manage banner adverts here"
            bgImage="/assets/images/cover/cover-1.webp"
          />
        </Grid>

        <Grid xs={12} sm={5} md={4}>
          <CardItem title="Admin Management" bgImage="/assets/images/cover/cover-3.webp" routeTo="/dashboard/cms/admins" />
        </Grid>
      </Grid>
      <Box p={2} />
      <Grid container spacing={3}>
        <Grid xs={12} sm={5} md={4}>
          <CardItem
            title="Social Links"
            routeTo="/dashboard/cms/social"
            description="Manage banner adverts here"
            bgImage="/assets/images/cover/cover-6.webp"
          />
        </Grid>

        <Grid xs={12} sm={7} md={8}>
          <CardItem
            title="Platform Settings"
            bgImage="/assets/images/cover/cover-12.webp"
            description="Manage your platform settings with ease"
            routeTo="/dashboard/cms/settings"
          />
        </Grid>

        <Grid xs={12} sm={7} md={8}>
          <CardItem
            title="Locations"
            bgImage="/assets/images/cover/cover-15.webp"
            description="Manage your various locations in one place"
            routeTo="/dashboard/cms/locations"
          />
        </Grid>

        <Grid xs={12} sm={5} md={4}>
          <CardItem
            title="Express Fee"
            bgImage="/assets/images/cover/cover-18.webp"
            description="Manage your express delivery fee"
            routeTo="/dashboard/cms/express"
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}

const CardItem = ({ title, description, bgImage, routeTo }: any) => {
  const navigate = useNavigate();

  return (
    <Box
      component={Card}
      sx={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <CardActionArea onClick={() => navigate(`${routeTo}`)}>
        <Box p={4} height={300} display="flex" flexDirection="column" justifyContent="end">
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
          >
            <Box display="flex" flexDirection="column" justifyContent="start">
              <Typography color="white" variant="h4" gutterBottom>
                {title}
              </Typography>
              <Typography color="white" fontFamily="fantasy">
                {description}
              </Typography>
            </Box>
            <Iconify icon="ei:arrow-right" color="white" width={60} height={60} />
          </Box>
        </Box>
      </CardActionArea>
    </Box>
  );
};
