import React, { useState, useCallback } from 'react';

import IconButton from '@mui/material/IconButton';
import { Popover, MenuList } from '@mui/material';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { Iconify } from 'src/components/iconify';

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
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  // const { profile } = useSelector((state: RootState) => state.auth);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  return (
    <>
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
          // onClick={() => {
          //   navigate(`/dashboard/activities/${row?.id}`, { state: { data: row } });
          // }}
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
