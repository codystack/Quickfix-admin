import type { RootState } from 'src/redux/store';
import type { IconButtonProps } from '@mui/material/IconButton';

import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { menuItemClasses } from '@mui/material/MenuItem';

import { useRouter } from 'src/routes/hooks';

import { _myAccount } from 'src/_mock';
import { setLoading } from 'src/redux/reducers/loader';
import { setAuth, setProfile } from 'src/redux/reducers/auth';

// ----------------------------------------------------------------------

export type AccountPopoverProps = IconButtonProps & {
  data?: {
    label: string;
    href: string;
    icon?: React.ReactNode;
    info?: React.ReactNode;
  }[];
};

export function AccountPopover({ data = [], sx, ...other }: AccountPopoverProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  // const pathname = usePathname();
  const { profile } = useSelector((state: RootState) => state.auth);

  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  // const handleClickItem = useCallback(
  //   (path: string) => {
  //     handleClosePopover();
  //     router.push(path);
  //   },
  //   [handleClosePopover, router]
  // );

  return (
    <>
      {profile && (
        <IconButton
          onClick={handleOpenPopover}
          sx={{
            p: '2px',
            width: 40,
            height: 40,
            background: (theme) =>
              `conic-gradient(${theme.vars.palette.primary.light}, ${theme.vars.palette.warning.light}, ${theme.vars.palette.primary.light})`,
            ...sx,
          }}
          {...other}
        >
          <Avatar
            src={profile?.photo ?? _myAccount.photoURL}
            alt={_myAccount.displayName}
            sx={{ width: 1, height: 1 }}
          >
            {(profile?.first_name ?? _myAccount.displayName).charAt(0).toUpperCase()}
          </Avatar>
        </IconButton>
      )}

      {profile && (
        <Popover
          open={!!openPopover}
          anchorEl={openPopover}
          onClose={handleClosePopover}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          slotProps={{
            paper: {
              sx: { width: 200 },
            },
          }}
        >
          <Box sx={{ p: 2, pb: 1.5 }}>
            <Typography variant="subtitle2" noWrap>
              {`${profile?.first_name} ${profile?.last_name}`}
            </Typography>

            <Typography fontSize={11} sx={{ color: 'text.secondary' }} noWrap>
              {`Last login ${new Date(profile?.last_login).toLocaleString('en-US')}`}
            </Typography>
          </Box>

          <Divider sx={{ borderStyle: 'dashed' }} />

          <MenuList
            disablePadding
            sx={{
              p: 1,
              gap: 0.5,
              display: 'flex',
              flexDirection: 'column',
              [`& .${menuItemClasses.root}`]: {
                px: 1,
                gap: 2,
                borderRadius: 0.75,
                color: 'text.secondary',
                '&:hover': { color: 'text.primary' },
                [`&.${menuItemClasses.selected}`]: {
                  color: 'text.primary',
                  bgcolor: 'action.selected',
                  fontWeight: 'fontWeightSemiBold',
                },
              },
            }}
          >
            {/* {data.map((option) => (
              <MenuItem
                key={option.label}
                selected={option.href === pathname}
                onClick={() => handleClickItem(option.href)}
              >
                {option.icon}
                {option.label}
              </MenuItem>
            ))} */}
          </MenuList>

          <Divider sx={{ borderStyle: 'dashed' }} />

          <Box sx={{ p: 1 }}>
            <Button fullWidth color="error" size="medium" variant="text" onClick={() => {
               dispatch(setLoading(true));
               setTimeout(() => {
                 localStorage.removeItem('accessToken');
                 dispatch(setProfile(null));
                 dispatch(setAuth(false))
                 dispatch(setLoading(false));
               }, 3000);
            }} >
              Logout
            </Button>
          </Box>
        </Popover>
      )}
    </>
  );
}
