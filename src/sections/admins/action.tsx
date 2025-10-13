import type { RootState } from 'src/redux/store';

import { mutate } from 'swr';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import IconButton from '@mui/material/IconButton';
import {
    Popover,
  MenuList,
} from '@mui/material';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import APIService from 'src/service/api.service';
import { setLoading } from 'src/redux/reducers/loader';

import { Iconify } from 'src/components/iconify';
import CustomizedDialog from 'src/components/dialog';
import { RenderConfirmation } from 'src/components/confirmation';



export type UserProps = {
    id: string;
    name: string;
    role: string;
    status: string;
    company: string;
    avatarUrl: string;
    isVerified: boolean;
  };
  
  type UserTableRowProps = {
    row: any;
    // onSelectRow: () => void;
  };

const ActionButton = ({ row }: UserTableRowProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
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
          mutate('/admins/all');
          const res = data?.data?.message || 'Admin account suspended successfully';
          setOpen(false);
          return `${res}`;
        },
      },
      error: {
        render({ data }: any) {
          dispatch(setLoading(false));
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
          mutate('/admins/all');
          const res = data?.data?.message || 'Admin account pardoned successfully';
          setOpen(false);
          return `${res}`;
        },
      },
      error: {
        render({ data }: any) {
          dispatch(setLoading(false));
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
          mutate('/admins/all');
          const res = data?.data?.message || 'Admin account deleted successfully';
          setOpen(false);
          return `${res}`;
        },
      },
      error: {
        render({ data }: any) {
          dispatch(setLoading(false));
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
      <IconButton onClick={handleOpenPopover}>
        <Iconify icon="eva:more-vertical-fill" />
      </IconButton>
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

          {profile &&
            profile?.access === 'read/write' &&
            (profile?.role === 'manager' || profile?.role === 'developer') && row?.status === 'active' ? (
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

          {profile &&
            profile?.access === 'read/write' &&
            (profile?.role === 'manager' || profile?.role === 'developer') && row?.status !== 'deleted' && (
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
};

export default ActionButton;
