import * as React from 'react';
import { Chip, Avatar, Typography, Box, Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import CloseIcon from '@mui/icons-material/Close';

import useOrderStatus from 'src/hooks/use-orders-status';
import { fNumber } from 'src/utils/format-number';
import CustomNoRowsOverlay from 'src/components/custom_no_row';

import ActionButton from './action';
import OrderDetails from './OrderDetails';

export default function OrderStatusTable({ data, orderStatus }: any) {
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 25,
  });
  const [loading, setLoading] = React.useState(false);
  const [filteredOrders, setFilteredOrders] = React.useState(data?.data ?? []);
  const [selectedOrder, setSelectedOrder] = React.useState(null);

  const { data: ordersData } = useOrderStatus(paginationModel.page + 1, orderStatus);
  console.log('ORDERS HERE :::: ', data);

  const handleClose = () => setSelectedOrder(null);

  const columns = [
    {
      field: 'user',
      headerName: 'User',
      flex: 1,
      renderCell: (params: any) => (
        <Box display="flex" flexDirection="row" alignItems="center" sx={{ textTransform: 'capitalize', fontSize: 14, height: '100%' }}>
          <Avatar src={params?.row?.user?.photo_url} variant="circular">
            {params?.row?.user?.first_name?.[0]}
            {params?.row?.user?.last_name?.[0]}
          </Avatar>
          <Typography pl={0.5} style={{ textTransform: 'capitalize', fontSize: 14 }}>
            {`${params?.row?.user?.first_name ?? ''} ${params?.row?.user?.last_name ?? ''}`}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'name',
      headerName: 'Service',
      flex: 1,
      renderCell: (params: any) => <p style={{ textTransform: 'capitalize', fontSize: 14 }}>{params?.row?.service?.title ?? ''}</p>,
    },
    {
      field: 'order_id',
      headerName: 'Order Num',
      width: 110,
      renderCell: (params: any) => <p style={{ textTransform: 'capitalize', fontSize: 14 }}>{params?.row?.order_id ?? ''}</p>,
    },
    {
      field: 'amount',
      headerName: 'Amount',
      flex: 1,
      renderCell: (params: any) => <p style={{ textTransform: 'capitalize', fontSize: 14 }}>{`₦${fNumber(params?.row?.amount)}`}</p>,
    },
    {
      field: 'items',
      headerName: 'Items',
      width: 70,
      renderCell: (params: any) => <p style={{ textTransform: 'capitalize', fontSize: 14 }}>{fNumber(params?.row?.items?.length)}</p>,
    },
    {
      field: 'location',
      headerName: 'Location',
      flex: 1,
      renderCell: (params: any) => <p style={{ textTransform: 'capitalize', fontSize: 14 }}>{`${params.row?.location?.region}, ${params.row?.location?.city}`}</p>,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 108,
      renderCell: (params: any) => (
        <Chip
          label={params.row.status}
          sx={{
            color: params.row.status === 'active' ? 'green' : 'red',
            textTransform: 'capitalize',
          }}
        />
      ),
    },
    {
      field: 'tx_ref',
      headerName: 'Trans Ref',
      flex: 1,
      renderCell: (params: any) => <p style={{ textTransform: 'capitalize', fontSize: 14 }}>{params?.row?.transaction?.trans_ref ?? 'Manual Order'}</p>,
    },
    {
      field: 'created_at',
      headerName: 'Created On',
      width: 100,
      renderCell: (params: any) => <p style={{ textTransform: 'capitalize', fontSize: 14 }}>{new Date(params.row?.createdAt).toLocaleDateString('en-GB')}</p>,
    },
    {
      field: 'id',
      headerName: 'Action',
      width: 80,
      renderCell: (params: any) => <ActionButton row={params?.row} onView={() => setSelectedOrder(params?.row)} />,
    },
  ];

  React.useEffect(() => {
    let active = true;

    (async () => {
      setLoading(true);
      if (ordersData) {
        console.log('SECOND PAGE DATA', ordersData);
        setFilteredOrders(ordersData?.data);
      }

      if (!active) {
        return;
      }

      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [paginationModel.page, ordersData]);

  return (
    <div style={{ height: '75vh', width: '100%' }}>
      {data && data?.data && filteredOrders && (
        <DataGrid
          sx={{ padding: 1 }}
          rows={filteredOrders}
          columns={columns}
          paginationMode="server"
          pageSizeOptions={[25]}
          rowCount={data?.totalItems}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          loading={loading}
          slots={{
            noRowsOverlay: CustomNoRowsOverlay,
            toolbar: GridToolbar,
          }}
        />
      )}

      {/* Dialog to show OrderDetails */}
      <Dialog open={Boolean(selectedOrder)} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          Order Details
          <IconButton onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedOrder && <OrderDetails order={selectedOrder} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
