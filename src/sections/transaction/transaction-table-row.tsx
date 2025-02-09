import { useNavigate } from 'react-router-dom';
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

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export type TransactionProps = {
  id: string;
  name: string;
  email: string;
  phone: string;
  amount: number;
  title: string;
  createdAt: string;
};

type TransactionTableRowProps = {
  row: any;
  selected: boolean;
  onSelectRow: () => void;
};

export function TransactionTableRow({ row, selected, onSelectRow }: TransactionTableRowProps) {
  const navigate = useNavigate();
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
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center">
            <Avatar alt={row.name} src={row?.transaction?.photoUrl} />
            {`${row.transaction?.first_name} ${row?.transaction?.last_name}`}
          </Box>
        </TableCell>

        <TableCell>{row?.transaction?.email_address}</TableCell>

        <TableCell>{row?.transaction?.phone_number}</TableCell>

        <TableCell>
          <img src={row?.marketplace?.images[0]} alt='' width={100} />
        </TableCell>

        <TableCell>{row?.marketplace?.amount}</TableCell>

        <TableCell>{row?.marketplace?.title}</TableCell>

        <TableCell>
          {row?.createdAt && new Date(row?.createdAt).toLocaleDateString('en-US')}
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
          <MenuItem  onClick={() => {
              navigate(`/dashboard/transactions/${row?._id}`, { state: { data: row } });
            }}>
            <Iconify icon="solar:eye-bold" />
            View
          </MenuItem>

        </MenuList>
      </Popover>
    </>
  );
}
