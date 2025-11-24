/* eslint-disable react/no-unstable-nested-components */
import type { RootState } from 'src/redux/store';

/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { useSelector } from 'react-redux';

// import { Download } from "@mui/icons-material";
import { Box, Chip, Avatar, Typography } from '@mui/material';
import { DataGrid, GridToolbar, GridColDef } from '@mui/x-data-grid';

import APIService from 'src/service/api.service';

import { fNumber } from 'src/utils/format-number';

import CustomNoRowsOverlay from 'src/components/custom_no_row';

import ActionButton from './action';

const DEFAULT_PAGE_SIZE = 25;

const getTotalItems = (payload: any) =>
  payload?.totalItems ??
  payload?.pagination?.total ??
  payload?.total ??
  payload?.meta?.total ??
  payload?.data?.length ??
  0;

const getPerPage = (payload: any) =>
  payload?.pagination?.pageSize ??
  payload?.meta?.per_page ??
  payload?.perPage ??
  payload?.data?.length ??
  DEFAULT_PAGE_SIZE;

export default function AllOrdersTable() {
  const { orders } = useSelector((state: RootState) => state.order);
  const [loading, setLoading] = React.useState(false);
  const [allOrders, setAllOrders] = React.useState(orders?.data ?? []);
  const [selectedLocation, setSelectedLocation] = React.useState('');

  // Filter orders by selected location
  const filteredOrdersByLocation = React.useMemo(() => {
    if (!selectedLocation) return allOrders;
    const filtered = allOrders.filter((order: any) => {
      const locationString = `${order?.location?.region}, ${order?.location?.city}`.toLowerCase();
      const selectedLower = selectedLocation.toLowerCase();
      return locationString.includes(selectedLower) || selectedLower.includes(locationString);
    });
    return filtered;
  }, [allOrders, selectedLocation]);

  const columns: GridColDef[] = [
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
      filterable: false,
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
            color:
              params.row.status === 'delivered' || params?.row?.status === 'completed'
                ? 'green'
                : params.row.status === 'pending' || params?.row?.status === 'washed'
                  ? 'orange'
                  : params.row.status === 'ironed' || params?.row?.status === 'packaged'
                    ? 'blue'
                    : 'red',
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

    const hydrateOrders = async () => {
      if (!orders?.data) {
        setAllOrders([]);
        return;
      }

      setAllOrders(orders.data);

      const totalItems = getTotalItems(orders);
      const perPage = getPerPage(orders);
      const totalPages = perPage ? Math.ceil(totalItems / perPage) : 1;

      if (totalPages <= 1) {
        return;
      }

      setLoading(true);

      try {
        const remainingRequests: Promise<any>[] = [];

        for (let page = 2; page <= totalPages; page += 1) {
          remainingRequests.push(APIService.fetcher(`/orders/all?page=${page}&limit=${perPage}`));
        }

        const responses = await Promise.all(remainingRequests);

        if (!active) {
          return;
        }

        const aggregatedOrders = [
          ...orders.data,
          ...responses.flatMap((response) => response?.data ?? []),
        ];

        setAllOrders(aggregatedOrders);
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.error('Failed to preload all orders:', error);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    hydrateOrders();

    return () => {
      active = false;
    };
  }, [orders]);

  return (
    <Box>
      {/* Location Filter Dropdown */}
      <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
        <Typography variant="subtitle2">Filter by Location:</Typography>
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          <option value="">All Locations</option>
          <option value="lagos, mainland">Mainland, Lagos</option>
          <option value="lagos, island">Island, Lagos</option>
          <option value="calabar">Cross River, Calabar</option>
        </select>
      </Box>

      {/* DataGrid */}
      <div style={{ height: '75vh', width: '100%' }}>
        {filteredOrdersByLocation && (
          <DataGrid
            sx={{ padding: 1 }}
            rows={filteredOrdersByLocation}
            columns={columns}
            pageSizeOptions={[25, 50, 100]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 25 },
              },
            }}
            loading={loading}
            disableRowSelectionOnClick
            slots={{
              noRowsOverlay: CustomNoRowsOverlay,
              toolbar: GridToolbar,
            }}
          />
        )}
      </div>
    </Box>
  );
}
