import { Box, Button, Typography } from "@mui/material";

export const RenderConfirmation = ({ message, action, setOpen }: any) => (
  <Box p={2}>
    <Typography gutterBottom>{message}</Typography>
    <Box p={2} />
    <Box display="flex" flexDirection="row" justifyContent="end" alignItems="center">
      <Button onClick={() => setOpen(false)}>Cancel</Button>
      <Box p={1} />
      <Button variant="contained" color="success" onClick={() => action()}>
        Yes, Proceed
      </Button>
    </Box>
  </Box>
);
