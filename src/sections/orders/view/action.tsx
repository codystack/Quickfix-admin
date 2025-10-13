import type { RootState } from 'src/redux/store';

import { mutate } from 'swr';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import IconButton from '@mui/material/IconButton';
import { Popover, MenuList } from '@mui/material';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { AdminType, AdminRoles, AccessRights } from 'src/utils/enums';

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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const { profile } = useSelector((state: RootState) => state.auth);
  const [title, setTitle] = React.useState('');
  const [openDelete, setOpenDelete] = React.useState(false);
  const [openWashed, setOpenWashed] = React.useState(false);
  const [openDeclined, setOpenDeclined] = React.useState(false);
  const [openIroned, setOpenIroned] = React.useState(false);
  const [openPackaged, setOpenPackaged] = React.useState(false);
  const [openDelivered, setOpenDelivered] = React.useState(false);
  const [openDamaged, setOpenDamaged] = React.useState(false);
  const [openCompleted, setOpenCompleted] = React.useState(false);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const updateOrderStatus = async (setOpen: any, status: string) => {
    try {
      const payload = {
        status,
      };
      const resp = APIService.updateOrder(payload, row?.id ?? row?._id);
      toast.promise(resp, {
        pending: {
          render() {
            return 'Loading. Please wait...';
          },
          icon: false,
        },
        success: {
          render({ data }) {
            dispatch(setLoading(false));
            mutate('/orders/all');
            const res = data?.data?.message || 'Order status updated successfully';
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
    } catch (error) {
    }
  };

  const deleteOrder = async () => {
    try {
      const resp = APIService.deleteOrder(row?.id ?? row?._id);
      toast.promise(resp, {
        pending: {
          render() {
            return 'Loading. Please wait...';
          },
          icon: false,
        },
        success: {
          render({ data }) {
            dispatch(setLoading(false));
            mutate('/orders/all');
            const res = data?.data?.message || 'Order deleted successfully';
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
    } catch (error) {
    }
  };

  return (
    <>
      <CustomizedDialog
        open={openDelete}
        setOpen={setOpenDelete}
        title={`Delete Order`}
        body={
          <RenderConfirmation
            setOpen={setOpenDelete}
            message={`Are you sure you want to delete this order ${row?.order_id}?`}
            action={() => deleteOrder()}
          />
        }
      />

      <CustomizedDialog
        open={openDeclined}
        setOpen={setOpenDeclined}
        title={`Mark As '${title}'`}
        body={
          <RenderConfirmation
            setOpen={setOpenDeclined}
            message={`Are you sure you want to ${title} this order ${row?.order_id}?`}
            action={() => updateOrderStatus(setOpenDeclined, 'declined')}
          />
        }
      />

      <CustomizedDialog
        open={openWashed}
        setOpen={setOpenWashed}
        title={`Mark As '${title}'`}
        body={
          <RenderConfirmation
            setOpen={setOpenWashed}
            message={`Are you sure you want to mark this order ${row?.order_id} as 'Washed'?`}
            action={() => updateOrderStatus(setOpenWashed, 'washed')}
          />
        }
      />

      <CustomizedDialog
        open={openIroned}
        setOpen={setOpenIroned}
        title={`Mark As '${title}'`}
        body={
          <RenderConfirmation
            setOpen={setOpenIroned}
            message={`Are you sure you want to mark this order ${row?.order_id} as 'Ironed'?`}
            action={() => updateOrderStatus(setOpenIroned, 'ironed')}
          />
        }
      />

      <CustomizedDialog
        open={openPackaged}
        setOpen={setOpenPackaged}
        title={`Mark As '${title}'`}
        body={
          <RenderConfirmation
            setOpen={setOpenPackaged}
            message={`Are you sure you want to mark this order ${row?.order_id} as 'Packaged'?`}
            action={() => updateOrderStatus(setOpenPackaged, 'packaged')}
          />
        }
      />

      <CustomizedDialog
        open={openDamaged}
        setOpen={setOpenDamaged}
        title={`Mark As '${title}'`}
        body={
          <RenderConfirmation
            setOpen={setOpenDamaged}
            message={`Are you sure you want to mark this order ${row?.order_id} as 'Damaged'?`}
            action={() => updateOrderStatus(setOpenDamaged, 'damaged')}
          />
        }
      />

      <CustomizedDialog
        open={openDelivered}
        setOpen={setOpenDelivered}
        title={`Mark As '${title}'`}
        body={
          <RenderConfirmation
            setOpen={setOpenDelivered}
            message={`Are you sure you want to mark this order ${row?.order_id} as 'Delivered'?`}
            action={() => updateOrderStatus(setOpenDelivered, 'delivered')}
          />
        }
      />

      <CustomizedDialog
        open={openCompleted}
        setOpen={setOpenCompleted}
        title={`Mark As '${title}'`}
        body={
          <RenderConfirmation
            setOpen={setOpenCompleted}
            message={`Are you sure you want to mark this order ${row?.order_id} as 'Completed'?`}
            action={() => updateOrderStatus(setOpenCompleted, 'completed')}
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
              navigate(`/dashboard/orders/${row?.id}`, { state: { data: row } });
            }}
          >
            <Iconify icon="solar:eye-bold" />
            View
          </MenuItem>
          {profile &&
            (profile?.type === AdminType.SUPER_ADMIN ||
              profile?.role === AdminRoles.MANAGER ||
              profile?.role === AdminRoles.DEVELOPER) &&
            profile?.access === AccessRights.READ_WRITE && (
              <>
                {row?.status === 'pending' && (
                  <>
                    <MenuItem
                      onClick={() => {
                        handleClosePopover();
                        setOpenDeclined(true);
                        setTitle('decline');
                      }}
                    >
                      <Iconify icon="fluent:text-change-reject-20-filled" />
                      Decline
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleClosePopover();
                        setOpenWashed(true);
                        setTitle('washed');
                      }}
                    >
                      <Iconify icon="solar:washing-machine-minimalistic-line-duotone" />
                      Washed
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleClosePopover();
                        setOpenIroned(true);
                        setTitle('ironed');
                      }}
                    >
                      <Iconify icon="lucide-lab:iron" />
                      Ironed
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleClosePopover();
                        setOpenPackaged(true);
                        setTitle('packaged');
                      }}
                    >
                      <Iconify icon="oui:package" />
                      Packaged
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleClosePopover();
                        setOpenDamaged(true);
                        setTitle('damaged');
                      }}
                    >
                      <Iconify icon="icon-park-outline:damage-map" />
                      Damaged
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleClosePopover();
                        setOpenDelivered(true);
                        setTitle('delivered');
                      }}
                    >
                      <Iconify icon="ic:round-delivery-dining" />
                      Delivered
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleClosePopover();
                        setOpenCompleted(true);
                        setTitle('completed');
                      }}
                    >
                      <Iconify icon="famicons:checkmark-done-circle-outline" />
                      Completed
                    </MenuItem>
                  </>
                )}

                {row?.status === 'washed' && (
                  <>
                    <MenuItem
                      onClick={() => {
                        handleClosePopover();
                        setOpenIroned(true);
                        setTitle('ironed');
                      }}
                    >
                      <Iconify icon="lucide-lab:iron" />
                      Ironed
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleClosePopover();
                        setOpenPackaged(true);
                        setTitle('packaged');
                      }}
                    >
                      <Iconify icon="oui:package" />
                      Packaged
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleClosePopover();
                        setOpenDamaged(true);
                        setTitle('damaged');
                      }}
                    >
                      <Iconify icon="icon-park-outline:damage-map" />
                      Damaged
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleClosePopover();
                        setOpenDelivered(true);
                        setTitle('delivered');
                      }}
                    >
                      <Iconify icon="ic:round-delivery-dining" />
                      Delivered
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleClosePopover();
                        setOpenCompleted(true);
                        setTitle('completed');
                      }}
                    >
                      <Iconify icon="famicons:checkmark-done-circle-outline" />
                      Completed
                    </MenuItem>
                  </>
                )}

                {(row?.status === 'ironed' || row?.status === 'packaged') && (
                  <>
                    {row?.status === 'ironed' && (
                      <MenuItem
                        onClick={() => {
                          handleClosePopover();
                          setOpenPackaged(true);
                          setTitle('packaged');
                        }}
                      >
                        <Iconify icon="oui:package" />
                        Packaged
                      </MenuItem>
                    )}

                    <MenuItem
                      onClick={() => {
                        handleClosePopover();
                        setOpenDamaged(true);
                        setTitle('damaged');
                      }}
                    >
                      <Iconify icon="icon-park-outline:damage-map" />
                      Damaged
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleClosePopover();
                        setOpenDelivered(true);
                        setTitle('delivered');
                      }}
                    >
                      <Iconify icon="ic:round-delivery-dining" />
                      Delivered
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleClosePopover();
                        setOpenCompleted(true);
                        setTitle('completed');
                      }}
                    >
                      <Iconify icon="famicons:checkmark-done-circle-outline" />
                      Completed
                    </MenuItem>
                  </>
                )}

                {row?.status === 'delivered' && (
                  <>
                    <MenuItem
                      onClick={() => {
                        handleClosePopover();
                        setOpenCompleted(true);
                        setTitle('completed');
                      }}
                    >
                      <Iconify icon="famicons:checkmark-done-circle-outline" />
                      Completed
                    </MenuItem>
                  </>
                )}

                <MenuItem
                  onClick={() => {
                    handleClosePopover();
                    setOpenDelete(true);
                  }}
                >
                  <Iconify icon="weui:delete-on-outlined" />
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
