import { useNavigate } from 'react-router-dom';
import React, { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export type ActivityProps = {
  id: string;
  name: string;
  email: string;
  phone: string;
  amount: number;
  title: string;
  createdAt: string;
};

type ActivityTableRowProps = {
  row: any;
  selected: boolean;
  onSelectRow: () => void;
};

export function ActivitiesTableRow({ row, selected, onSelectRow }: ActivityTableRowProps) {
  const navigate = useNavigate();
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  // const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
  //   setOpenPopover(event.currentTarget);
  // }, []);

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
            <Avatar alt={row.name} src={row?.admin?.photoUrl} />
            {`${row.admin?.first_name} ${row?.admin?.last_name}`}
          </Box>
        </TableCell>

        <TableCell>{row?.admin?.email_address}</TableCell>

        <TableCell>{row?.admin?.phone_number}</TableCell>

        <TableCell>{row?.admin?.role}</TableCell>

        <TableCell>{row?.title}</TableCell>

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
              navigate(`/dashboard/interests/${row?._id}`, { state: { data: row } });
            }}>
            <Iconify icon="solar:eye-bold" />
            View
          </MenuItem>

        </MenuList>
      </Popover>
    </>
  );
}
