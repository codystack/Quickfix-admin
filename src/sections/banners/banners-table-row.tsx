import { mutate } from 'swr';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import React, { useState, useCallback } from 'react';

import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import { Box, Switch, IconButton } from '@mui/material';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { fNumber } from 'src/utils/format-number';

import APIService from 'src/service/api.service';
import { setLoading } from 'src/redux/reducers/loader';

import { Iconify } from 'src/components/iconify';
import CustomizedDialog from 'src/components/dialog';
// import { UpdateBanner } from '../cms/view/banner-view';
import { RenderConfirmation } from 'src/components/confirmation';

// import { UpdateBanner } from '../cms/view/banner-view';
import UpdateBanner from './view/update_banner';

// ----------------------------------------------------------------------

export type BannerProps = {
  id: string;
  name: string;
  email: string;
  phone: string;
  amount: number;
  title: string;
  createdAt: string;
};

type BannerTableRowProps = {
  row: any;
  selected: boolean;
  onSelectRow: () => void;
};

export function BannerTableRow({ row, selected, onSelectRow }: BannerTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const [active, setActive] = React.useState(row?.status === 'active');
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const dispatch = useDispatch();

  // const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
  //   setOpenPopover(event.currentTarget);
  // }, []);

  React.useEffect(() => {
    if (row) {
      if (row?.status === 'active') {
        setActive(true);
      } else {
        setActive(false);
      }
    }
  }, [row]);

  const setStatus = async (status: string) => {
    try {
      const payload = {
        preview: row?.preview,
        title: row?.title,
        type: row?.type,
        status,
        url: row?.url,
      };

      console.log('PAYLOAD ::: ', payload);

      const resp = await APIService.updateBanner(payload, row?._id);
      console.log('UPDATE STATUS RESP ::: ', resp);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteBanner = async () => {
    const response = APIService.removeBanner(row?._id);
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
          mutate('/admins/banners/all');
          const resp = data?.data?.message || 'Operation successful';
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

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  return (
    <>
      <CustomizedDialog
        open={open}
        setOpen={setOpen}
        title="Delete Banner"
        body={
          <RenderConfirmation
            setOpen={setOpen}
            message="Are you sure you want to delete this banner?"
            action={() => deleteBanner()}
          />
        }
      />

      <CustomizedDialog
        open={openEdit}
        setOpen={setOpenEdit}
        title="Update Banner"
        body={<UpdateBanner banner={row} setOpen={setOpenEdit} />}
      />

      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        {/* <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell> */}

        {/* <TableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center">
            {/* <Avatar alt={row.name} src={row?.banner?.photoUrl} /> 
            {`${row.banner?.first_name} ${row?.banner?.last_name}`}
          </Box>
        </TableCell> */}

        <TableCell>{row?.title}</TableCell>

        <TableCell>
          <img alt="" src={row?.preview} width={50} />
        </TableCell>

        <TableCell>{`₦${fNumber(row?.amount) ?? 0}`}</TableCell>

        <TableCell>{row?.type}</TableCell>

        <TableCell>{row?.url}</TableCell>

        <TableCell>{row?.status}</TableCell>

        <TableCell>
          {row?.createdAt && new Date(row?.createdAt).toLocaleDateString('en-US')}
        </TableCell>

        <TableCell align="right">
          <Box display="flex" flexDirection="row" justifyContent="end" alignItems="center">
            <Switch
              checked={active}
              onChange={(e) => {
                if (active) {
                  setActive(false);
                  setStatus('inactive');
                } else {
                  setActive(true);
                  setStatus('active');
                }
              }}
            />
            <IconButton onClick={() => setOpenEdit(true)} >
              <Iconify icon="basil:edit-outline" color="info.main" />
            </IconButton>
            <IconButton onClick={() => setOpen(true)}>
              <Iconify icon="weui:delete-on-filled" color="error.main" />
            </IconButton>
          </Box>
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
          <MenuItem onClick={handleClosePopover}>
            <Iconify icon="solar:eye-bold" />
            View
          </MenuItem>

          {/* <MenuItem onClick={handleClosePopover} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Suspend
          </MenuItem>

          <MenuItem onClick={handleClosePopover} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:chat-bold" />
            Message
          </MenuItem> */}
        </MenuList>
      </Popover>
    </>
  );
}
