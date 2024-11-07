/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/img-redundant-alt */
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Button, IconButton, Toolbar } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function SocialView() {
  const navigate = useNavigate();

  return (
    <DashboardContent>
      <Box display="flex" flexDirection='row' justifyContent='space-between'  alignItems="center" mb={5} width='100%' >
        <Box display='flex' flexDirection="row" justifyContent='start' alignItems='center' >
          <IconButton onClick={() => navigate(-1)}>
            <Iconify icon="mdi:arrow-back" />
          </IconButton>
          <Typography px={1} variant="h4" flexGrow={1}>
            Social Links
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          Add New
        </Button>
      </Box>
      <Toolbar />
      <Box>
      <img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD…vB2YH/lwNDWngv+BDvhQYoL2r4M2Q6Zf8O5Te5/yPHa1//9k=" alt="fd"
      />
      </Box>
    </DashboardContent>
  );
}
