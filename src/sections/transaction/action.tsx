import type { RootState } from 'src/redux/store';

import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import IconButton from '@mui/material/IconButton';
import { Popover, MenuList } from '@mui/material';
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

  // const deleteUser = () => {
  //   const payload = {
  //     ...row,
  //     status: 'deleted',
  //   };

  //   const prom = APIService.updateUser(payload);

  //   toast.promise(prom, {
  //     pending: {
  //       render() {
  //         return 'Loading. Please wait...';
  //       },
  //       icon: false,
  //     },
  //     success: {
  //       render({ data }) {
  //         dispatch(setLoading(false));
  //         // mutate('/admins/bookings/all')
  //         const res = data?.data?.message || 'User account suspended successfully';
  //         setOpen(false);
  //         return `${res}`;
  //       },
  //     },
  //     error: {
  //       render({ data }: any) {
  //         dispatch(setLoading(false));
  //         const errorMsg = data?.response?.data?.message || data?.message || '';
  //         // When the promise reject, data will contains the error
  //         return `${errorMsg ?? 'An error occurred!'}`;
  //       },
  //     },
  //   });
  // };

  return (
    <>
      {/* <CustomizedDialog
        open={open}
        setOpen={setOpen}
        title={title}
        body={
          <RenderConfirmation
            setOpen={setOpen}
            message={message}
            action={() =>
               title.toLowerCase().startsWith('delete')
                    ? deleteUser()
                    : {}
            }
          />
        }
      /> */}
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
              navigate(`/dashboard/transactions/${row?.id}`, { state: { data: row } });
            }}
          >
            <Iconify icon="solar:eye-bold" />
            View
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
};

export default ActionButton;
