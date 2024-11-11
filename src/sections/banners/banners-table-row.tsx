import React, { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Switch } from '@mui/material';
import { fNumber } from 'src/utils/format-number';

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

export function InterestTableRow({ row, selected, onSelectRow }: BannerTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  return (
    <>
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
          <img alt='' src={row?.preview} width={50} />
        </TableCell>

        <TableCell>{`₦${fNumber(row?.amount) ?? 0}`}</TableCell>

        <TableCell>{row?.type}</TableCell>

        <TableCell>{row?.url}</TableCell>

        <TableCell>
          {row?.createdAt && new Date(row?.createdAt).toLocaleDateString('en-US')}
        </TableCell>


        <TableCell align="right">
          <Switch />
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
