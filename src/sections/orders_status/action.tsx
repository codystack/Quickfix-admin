import React, { useState, useCallback } from 'react';
import IconButton from '@mui/material/IconButton';
import { Popover, MenuList, MenuItem } from '@mui/material';
import { Iconify } from 'src/components/iconify';

type ActionButtonProps = {
  row: any;
  onView: (order: any) => void;
};

const ActionButton = ({ row, onView }: ActionButtonProps) => {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

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
      <Popover open={!!openPopover} anchorEl={openPopover} onClose={handleClosePopover} anchorOrigin={{ vertical: 'top', horizontal: 'left' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <MenuList sx={{ p: 0.5, gap: 0.5, width: 140, display: 'flex', flexDirection: 'column' }}>
          <MenuItem
            onClick={() => {
              onView(row);
              handleClosePopover();
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
