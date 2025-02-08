/* eslint-disable react/no-unstable-nested-components */
import type { RootState } from 'src/redux/store';

/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { useSelector } from 'react-redux';

// import { Download } from "@mui/icons-material";
import { Box, Chip, Avatar, Typography } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import useOrders from 'src/hooks/use-orders';

import { fNumber } from 'src/utils/format-number';

import CustomNoRowsOverlay from 'src/components/custom_no_row';

import ActionButton from './action';

export default function AllOrdersTable() {
  const { orders } = useSelector((state: RootState) => state.order);
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 25,
  });
  const [loading, setLoading] = React.useState(false);
  const [filteredOrders, setFilteredOrders] = React.useState(orders?.data ?? []);

  const { data: ordersData } = useOrders(paginationModel.page + 1);
  console.log('ORDERS HERE :::: ', orders);

  const columns = [
    {
      field: 'user',
      headerName: 'User',
      flex: 1,
      renderCell: (params: any) => (
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="start"
          alignItems="center"
          sx={{
            textTransform: 'capitalize',
            fontSize: 14,
            height: '100%',
          }}
        >
          <Avatar src={params?.row?.user?.photo_url} variant="circular">
            {`${params?.row?.user?.first_name}`.substring(0, 1)}
            {`${params?.row?.user?.last_name}`.substring(0, 1)}
          </Avatar>
          <Typography
            pl={0.5}
            style={{ textTransform: 'capitalize', fontSize: 14 }}
          >{`${params?.row?.user?.first_name ?? ''} ${params?.row?.user?.last_name ?? ''}`}</Typography>
        </Box>
      ),
    },
    {
      field: 'name',
      headerName: 'Service',
      flex: 1,
      renderCell: (params: any) => (
        <Typography
          style={{
            textTransform: 'capitalize',
            fontSize: 14,
            display: 'flex',
            alignItems: 'center',
            height: '100%',
          }}
        >{`${params?.row?.service?.title ?? ''}`}</Typography>
      ),
    },
    {
      field: 'order_id',
      headerName: 'Order Num',
      width: 110,
      renderCell: (params: any) => (
        <Typography
          style={{
            textTransform: 'capitalize',
            fontSize: 14,
            display: 'flex',
            alignItems: 'center',
            height: '100%',
          }}
        >{`${params?.row?.order_id ?? ''}`}</Typography>
      ),
    },
    {
      field: 'amount',
      headerName: 'Amount',
      flex: 1,
      renderCell: (params: any) => (
        <Typography
          style={{
            textTransform: 'capitalize',
            fontSize: 14,
            display: 'flex',
            alignItems: 'center',
            height: '100%',
          }}
        >{`₦${fNumber(params?.row?.amount)}`}</Typography>
      ),
    },
    {
      field: 'items',
      headerName: 'Items',
      width: 70,
      renderCell: (params: any) => (
        <Typography
          style={{
            textTransform: 'capitalize',
            fontSize: 14,
            display: 'flex',
            alignItems: 'center',
            height: '100%',
          }}
        >{`${fNumber(params?.row?.items?.length)}`}</Typography>
      ),
    },
    {
      field: 'location',
      headerName: 'Location',
      flex: 1,
      renderCell: (params: any) => (
        <Typography
          style={{
            textTransform: 'capitalize',
            fontSize: 14,
            display: 'flex',
            alignItems: 'center',
            height: '100%',
          }}
        >{`${params.row?.location?.region}, ${params.row?.location?.city}`}</Typography>
      ),
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
      renderCell: (params: any) => (
        <Typography
          style={{
            textTransform: 'capitalize',
            fontSize: 14,
            display: 'flex',
            alignItems: 'center',
            height: '100%',
          }}
        >{`${params?.row?.transaction?.trans_ref ?? 'Manual Order'}`}</Typography>
      ),
    },
    {
      field: 'created_at',
      headerName: 'Created On',
      width: 110,
      renderCell: (params: any) => (
        <Typography
          style={{
            textTransform: 'capitalize',
            fontSize: 14,
            display: 'flex',
            alignItems: 'center',
            height: '100%',
          }}
        >{`${new Date(params.row?.createdAt).toLocaleDateString('en-GB')}`}</Typography>
      ),
    },
    {
      field: 'id',
      headerName: 'Action',
      width: 90,
      renderCell: (params: any) => <ActionButton row={params?.row} />,
    },
  ];

  React.useEffect(() => {
    let active = true;

    (async () => {
      setLoading(true);
      // const newData = await loadServerRows(paginationModel.page, data);
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
      {orders && orders?.data && filteredOrders && (
        <DataGrid
          sx={{ padding: 1 }}
          rows={filteredOrders}
          columns={columns}
          paginationMode="server"
          pageSizeOptions={[25]}
          rowCount={orders?.totalItems}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          loading={loading}
          slots={{
            noRowsOverlay: CustomNoRowsOverlay,
            toolbar: GridToolbar,
          }}
        />
      )}
    </div>
  );
}
