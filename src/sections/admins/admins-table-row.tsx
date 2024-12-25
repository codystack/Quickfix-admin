import type { RootState } from 'src/redux/store';

import { mutate } from 'swr';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import { Box, Chip, Avatar, IconButton } from '@mui/material';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import APIService from 'src/service/api.service';
import { setLoading } from 'src/redux/reducers/loader';

import { Iconify } from 'src/components/iconify';
import CustomizedDialog from 'src/components/dialog';
import { RenderConfirmation } from '../orders/order-table-row';


// ----------------------------------------------------------------------

export type AdminProps = {
  id: string;
  name: string;
  email: string;
  phone: string;
  amount: number;
  title: string;
  createdAt: string;
};

type AdminTableRowProps = {
  row: any;
  selected: boolean;
  onSelectRow: () => void;
};

export function AdminTableRow({ row, selected, onSelectRow }: AdminTableRowProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile } = useSelector((state: RootState) => state.auth);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  console.log('POLIOI', profile);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const suspendAdmin = () => {

    const prom = APIService.suspendAdmin(row?.id ?? row?._id);

    toast.promise(prom, {
      pending: {
        render() {
          return 'Loading. Please wait...';
        },
        icon: false,
      },
      success: {
        render({ data }) {
          dispatch(setLoading(false));
          mutate('/admins/all')
          const res = data?.data?.message || 'Admin account suspended successfully';
          setOpen(false);
          return `${res}`;
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

  const pardonAdmin = () => {

    const prom = APIService.pardonAdmin(row?.id ?? row?._id);

    toast.promise(prom, {
      pending: {
        render() {
          return 'Loading. Please wait...';
        },
        icon: false,
      },
      success: {
        render({ data }) {
          dispatch(setLoading(false));
          mutate('/admins/all')
          const res = data?.data?.message || 'Admin account pardoned successfully';
          setOpen(false);
          return `${res}`;
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

  const deleteAdmin = () => {

    const prom = APIService.deleteAdmin(row?.id ?? row?._id);

    toast.promise(prom, {
      pending: {
        render() {
          return 'Loading. Please wait...';
        },
        icon: false,
      },
      success: {
        render({ data }) {
          dispatch(setLoading(false));
          mutate('/admins/all')
          const res = data?.data?.message || 'Admin account deleted successfully';
          setOpen(false);
          return `${res}`;
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
        title={title}
        body={
          <RenderConfirmation
            setOpen={setOpen}
            message={message}
            action={() =>
              title.toLowerCase().startsWith('suspend')
                ? suspendAdmin()
                : title.toLowerCase().startsWith('pardon')
                  ? pardonAdmin()
                  : title.toLowerCase().startsWith('delete')
                    ? deleteAdmin()
                    : {}
            }
          />
        }
      />

      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        {/* <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell> */}

        <TableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center">
            <Avatar alt={row.name} src={row.photoUrl} />
            {`${row.first_name} ${row.last_name}`}
          </Box>
        </TableCell>

        <TableCell>{row.email_address}</TableCell>

        <TableCell>{row.phone_number}</TableCell>

        <TableCell>{row.type}</TableCell>

        <TableCell>{row.access}</TableCell>

        <TableCell>{row.role}</TableCell>

        <TableCell>
          <Chip
            label={row.status}
            sx={{ color: row.status === 'active' ? 'green' : 'red', textTransform: 'capitalize' }}
          />
        </TableCell>

        {profile?._id !== row?.id && (
          <TableCell align="right">
            <IconButton onClick={handleOpenPopover}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </TableCell>
        )}
      </TableRow>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
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
              navigate(`/dashboard/cms/admins/${row?.id}`, { state: { data: row } });
            }}
          >
            <Iconify icon="solar:eye-bold" />
            View
          </MenuItem>

          {row?.status === 'active' ? (
            <MenuItem
              onClick={() => {
                setTitle(`Suspend ${row?.first_name}`);
                setMessage(
                  `Are you sure you want to suspend ${row?.first_name} ${row?.last_name}? You can pardon this user later.`
                );
                handleClosePopover();
                setOpen(true);
              }}
              sx={{ color: 'warning.main' }}
            >
              <Iconify icon="lsicon:suspend-filled" />
              Suspend
            </MenuItem>
          ) : (
            <MenuItem
              onClick={() => {
                setTitle(`Pardon ${row?.first_name}`);
                setMessage(
                  `Are you sure you want to pardon ${row?.first_name} ${row?.last_name}? You can always suspend this user later.`
                );
                handleClosePopover();
                setOpen(true);
              }}
              sx={{ color: 'info.main' }}
            >
              <Iconify icon="mage:user-check-fill" />
              Pardon
            </MenuItem>
          )}

          {row?.status !== 'deleted' && (
            <MenuItem
              onClick={() => {
                setTitle(`Delete ${row?.first_name}'s Account`);
                setMessage(
                  `Are you sure you want to remove ${row?.first_name} ${row?.last_name} account from the platform? Action is irreversible.`
                );
                handleClosePopover();
                setOpen(true);
              }}
              sx={{ color: 'error.main' }}
            >
              <Iconify icon="fluent:person-delete-24-filled" />
              Delete
            </MenuItem>
          )}
        </MenuList>
      </Popover>
    </>
  );
}
