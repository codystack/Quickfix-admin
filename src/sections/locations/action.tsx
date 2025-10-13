import type { RootState } from 'src/redux/store';

import { mutate } from 'swr';
import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';
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

import UpdateLocation from './update_location';

const ActionButton = ({ row }: any) => {
  const dispatch = useDispatch();
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [title, setTitle] = useState('');
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const { profile } = useSelector((state: RootState) => state.auth);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const deleteLocation = () => {
    const prom = APIService.deleteLocation(row?.id ?? row?._id);

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
          mutate('/locations/all');
          const res = data?.data?.message || 'Location deleted successfully';
          setOpenDelete(false);
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
        open={openUpdate}
        setOpen={setOpenUpdate}
        title={title}
        body={<UpdateLocation setOpen={setOpenUpdate} data={row} />}
      />
      <CustomizedDialog
        open={openDelete}
        setOpen={setOpenDelete}
        title={title}
        body={
          <RenderConfirmation
            setOpen={setOpenDelete}
            message="Are you sure you want to delete this location?"
            action={() => deleteLocation()}
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
          {profile &&
            profile?.access === 'read/write' &&
            (profile?.role === 'manager' || profile?.role === 'developer') &&
            row?.status !== 'deleted' && (
              <>
                <MenuItem
                  onClick={() => {
                    setTitle(`Update Location`);
                    handleClosePopover();
                    setOpenUpdate(true);
                  }}
                  sx={{ color: 'info.main' }}
                >
                  Update
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setTitle(`Delete Location`);
                    handleClosePopover();
                    setOpenDelete(true);
                  }}
                  sx={{ color: 'error.main' }}
                >
                  Delete
                </MenuItem>
              </>
            )}
        </MenuList>
      </Popover>
    </>
  );
};

export default ActionButton;
