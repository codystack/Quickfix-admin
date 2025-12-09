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
  const [openWhatsAppCompleted, setOpenWhatsAppCompleted] = React.useState(false);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const updateOrderStatus = async (setOpen: any, status: string, isWhatsAppCompleted = false) => {
    try {
      const payload = {
        status: status,
        isWhatsAppCompleted: isWhatsAppCompleted,
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
            return `${errorMsg ?? 'An error occurred!'}`;
          },
        },
      });
    } catch (error) {}
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
    } catch (error) {}
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

      <CustomizedDialog
        open={openWhatsAppCompleted}
        setOpen={setOpenWhatsAppCompleted}
        title={`Mark As WhatsApp Completed`}
        body={
          <RenderConfirmation
            setOpen={setOpenWhatsAppCompleted}
            message={`Are you sure you want to mark this order ${row?.order_id} as WhatsApp Completed?`}
            action={() => updateOrderStatus(setOpenWhatsAppCompleted, 'completed', true)}
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

                {row?.status !== 'completed' && (
                  <MenuItem
                    onClick={() => {
                      handleClosePopover();
                      setOpenWhatsAppCompleted(true);
                    }}
                    style={{ display: 'flex', alignItems: 'center', gap: '19px' }}
                  >
                    <svg
                      fill="#008000"
                      width="17px"
                      height="17px"
                      viewBox="0 0 32 32"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        <title>whatsapp</title>
                        <path d="M26.576 5.363c-2.69-2.69-6.406-4.354-10.511-4.354-8.209 0-14.865 6.655-14.865 14.865 0 2.732 0.737 5.291 2.022 7.491l-0.038-0.070-2.109 7.702 7.879-2.067c2.051 1.139 4.498 1.809 7.102 1.809h0.006c8.209-0.003 14.862-6.659 14.862-14.868 0-4.103-1.662-7.817-4.349-10.507l0 0zM16.062 28.228h-0.005c-0 0-0.001 0-0.001 0-2.319 0-4.489-0.64-6.342-1.753l0.056 0.031-0.451-0.267-4.675 1.227 1.247-4.559-0.294-0.467c-1.185-1.862-1.889-4.131-1.889-6.565 0-6.822 5.531-12.353 12.353-12.353s12.353 5.531 12.353 12.353c0 6.822-5.53 12.353-12.353 12.353h-0zM22.838 18.977c-0.371-0.186-2.197-1.083-2.537-1.208-0.341-0.124-0.589-0.185-0.837 0.187-0.246 0.371-0.958 1.207-1.175 1.455-0.216 0.249-0.434 0.279-0.805 0.094-1.15-0.466-2.138-1.087-2.997-1.852l0.010 0.009c-0.799-0.74-1.484-1.587-2.037-2.521l-0.028-0.052c-0.216-0.371-0.023-0.572 0.162-0.757 0.167-0.166 0.372-0.434 0.557-0.65 0.146-0.179 0.271-0.384 0.366-0.604l0.006-0.017c0.043-0.087 0.068-0.188 0.068-0.296 0-0.131-0.037-0.253-0.101-0.357l0.002 0.003c-0.094-0.186-0.836-2.014-1.145-2.758-0.302-0.724-0.609-0.625-0.836-0.637-0.216-0.010-0.464-0.012-0.712-0.012-0.395 0.010-0.746 0.188-0.988 0.463l-0.001 0.002c-0.802 0.761-1.3 1.834-1.3 3.023 0 0.026 0 0.053 0.001 0.079l-0-0.004c0.131 1.467 0.681 2.784 1.527 3.857l-0.012-0.015c1.604 2.379 3.742 4.282 6.251 5.564l0.094 0.043c0.548 0.248 1.25 0.513 1.968 0.74l0.149 0.041c0.442 0.14 0.951 0.221 1.479 0.221 0.303 0 0.601-0.027 0.889-0.078l-0.031 0.004c1.069-0.223 1.956-0.868 2.497-1.749l0.009-0.017c0.165-0.366 0.261-0.793 0.261-1.242 0-0.185-0.016-0.366-0.047-0.542l0.003 0.019c-0.092-0.155-0.34-0.247-0.712-0.434z"></path>
                      </g>
                    </svg>
                    Completed
                  </MenuItem>
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
