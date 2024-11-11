import { mutate } from 'swr';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import React, { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { Button, Typography } from '@mui/material';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import APIService from 'src/service/api.service';
import { setLoading } from 'src/redux/reducers/loader';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import CustomizedDialog from 'src/components/dialog';

// ----------------------------------------------------------------------

export type UserProps = {
  id: string;
  name: string;
  amount: number;
  status: string;
  reason: string;
  location: string;
  category: string;
  avatarUrl: string;
  isVerified: boolean;
};

type UserTableRowProps = {
  row: any;
  selected: boolean;
  onSelectRow: () => void;
};

export function UserTableRow({ row, selected, onSelectRow }: UserTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);
  const [confirmationTitle, setConfirmationTitle] = useState('');
  const dispatch = useDispatch();

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const approveAppointment = async () => {
    dispatch(setLoading(true));
    const response = APIService.approveBooking(row?._id);
    toast.promise(response, {
      pending: {
        render() {
          return 'Loading. Please wait...';
        },
        icon: false,
      },
      success: {
        render({ data }) {
          dispatch(setLoading(false));
          setOpen(false);
          mutate('/admins/bookings/all');
          const resp = data?.data?.message || 'Booking approved successfully';
          return `${resp}`;
        },
      },
      error: {
        render({ data }: any) {
          dispatch(setLoading(false));
          console.log('ERRO ON TOAST HERE :: ', data?.response?.data?.message);
          const errorMsg = data?.response?.data?.message || data?.message || '';
          // When the promise reject, data will contains the error
          return `${errorMsg ?? 'An error occurred!'}`;
        },
      },
    });
  };

  const declineAppointment = async () => {
    dispatch(setLoading(true));
    const response = APIService.declineBooking(row?._id);
    toast.promise(response, {
      pending: {
        render() {
          return 'Loading. Please wait...';
        },
        icon: false,
      },
      success: {
        render({ data }) {
          dispatch(setLoading(false));
          mutate('/admins/bookings/all');
          setOpen(false);
          const resp = data?.data?.message || 'Booking declined successfully';
          return `${resp}`;
        },
      },
      error: {
        render({ data }: any) {
          dispatch(setLoading(false));
          console.log('ERRO ON TOAST HERE :: ', data?.response?.data?.message);
          const errorMsg = data?.response?.data?.message || data?.message || '';
          // When the promise reject, data will contains the error
          return `${errorMsg ?? 'An error occurred!'}`;
        },
      },
    });
  };

  return (
    <>
      <CustomizedDialog
        open={open}
        setOpen={setOpen}
        title={`${confirmationTitle}`}
        body={
          <RenderConfirmation
            setOpen={setOpen}
            message={`Are you sure you want to ${confirmationTitle}?`}
            action={() =>
              confirmationTitle.toLowerCase().includes('approve')
                ? approveAppointment()
                : declineAppointment()
            }
          />
        }
      />
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center">
            <Avatar alt={row.user?.first_name} src={row.user?.photoUrl} />
            {`${row.user?.first_name} ${row?.user?.last_name}`}
          </Box>
        </TableCell>

        <TableCell>{row.amount}</TableCell>

        <TableCell>{row.category}</TableCell>

        <TableCell>{row.reason}</TableCell>

        <TableCell>{row.location}</TableCell>

        <TableCell>
          <Label
            color={row.status === 'pending' || row.status === 'cancelled' ? 'error' : 'success'}
          >
            {row.status}
          </Label>
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {row.status !== 'cancelled' && (
          <MenuList
            disablePadding
            sx={{
              p: 0.5,
              gap: 0.5,
              width: 140,
              display: 'flex',
              flexDirection: 'column',
              [`& .${menuItemClasses.root}`]: {
                px: 1,
                gap: 2,
                borderRadius: 0.75,
                [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
              },
            }}
          >
            <MenuItem
              onClick={() => {
                setConfirmationTitle('Approve Appointment');
                handleClosePopover();
                setOpen(true);
              }}
            >
              <Iconify icon="hugeicons:inbox-check" fontSize={28} />
              Approve
            </MenuItem>

            <MenuItem
              onClick={() => {
                setConfirmationTitle('Decline Appointment');
                handleClosePopover();
                setOpen(true);
              }}
            >
              <Iconify icon="proicons:filter-cancel" fontSize={28} />
              Decline
            </MenuItem>

            {/* <MenuItem onClick={handleClosePopover} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Cancel
          </MenuItem> */}
          </MenuList>
        )}
      </Popover>
    </>
  );
}

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
