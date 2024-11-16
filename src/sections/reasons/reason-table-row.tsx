import type { RootState } from 'src/redux/store';

import { mutate } from 'swr';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import APIService from 'src/service/api.service';
import { setLoading } from 'src/redux/reducers/loader';

import { Iconify } from 'src/components/iconify';
import CustomizedDialog from 'src/components/dialog';

import UpdateReason from './view/update-reason';
import { RenderConfirmation } from '../booking/booking-table-row';

// ----------------------------------------------------------------------

export type ReasonProps = {
  id: string;
  name: string;
  role: string;
  status: string;
  company: string;
  avatarUrl: string;
  isVerified: boolean;
};

type ReasonTableRowProps = {
  row: any;
  selected: boolean;
  onSelectRow: () => void;
};

export function ReasonTableRow({ row, selected, onSelectRow }: ReasonTableRowProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const { profile } = useSelector((state: RootState) => state.auth);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const deleteReason = () => {
    const prom = APIService.deleteReason(row?._id ?? row?.id);

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
          mutate('/admins/reasons/all');
          const res = data?.data?.message || 'Reason deleted successfully';
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
        open={openEdit}
        setOpen={setOpenEdit}
        title="Update Reason"
        body={
          <UpdateReason setOpen={setOpenEdit} reasonData={row} />
        }
      />

      <CustomizedDialog
        open={open}
        setOpen={setOpen}
        title={title}
        body={
          <RenderConfirmation setOpen={setOpen} message={message} action={() => deleteReason()} />
        }
      />

      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell>{row.title}</TableCell>

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
          {profile && profile?.role !== 'support' && (
            <>
              <MenuItem
                onClick={() => {
                  handleClosePopover();
                  setOpenEdit(true);
                }}
                sx={{ color: 'info.main' }}
              >
                <Iconify icon="akar-icons:edit" />
                Update
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setTitle(`Delete Reason`);
                  setMessage(
                    `Are you sure you want to delete this reason? Action is irreversible.`
                  );
                  handleClosePopover();
                  setOpen(true);
                }}
                sx={{ color: 'error.main' }}
              >
                <Iconify icon="fluent:person-delete-24-filled" />
                Delete
              </MenuItem>
            </>
          )}
        </MenuList>
      </Popover>
    </>
  );
}
