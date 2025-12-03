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
      width: 125,
      renderCell: (params: any) => {
        const isWhatsAppCompleted = params.row.isWhatsAppCompleted;
        const status = params.row.status;

        return (
          <Chip
            label={
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {isWhatsAppCompleted && (
                  <svg
                    fill="#008000"
                    width="12px"
                    height="12px"
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                      <title>whatsapp</title>
                      <path d="M26.576 5.363c-2.69-2.69-6.406-4.354-10.511-4.354-8.209 0-14.865 6.655-14.865 14.865 0 2.732 0.737 5.291 2.022 7.491l-0.038-0.070-2.109 7.702 7.879-2.067c2.051 1.139 4.498 1.809 7.102 1.809h0.006c8.209-0.003 14.862-6.659 14.862-14.868 0-4.103-1.662-7.817-4.349-10.507l0 0zM16.062 28.228h-0.005c-0 0-0.001 0-0.001 0-2.319 0-4.489-0.64-6.342-1.753l0.056 0.031-0.451-0.267-4.675 1.227 1.247-4.559-0.294-0.467c-1.185-1.862-1.889-4.131-1.889-6.565 0-6.822 5.531-12.353 12.353-12.353s12.353 5.531 12.353 12.353c0 6.822-5.53 12.353-12.353 12.353h-0zM22.838 18.977c-0.371-0.186-2.197-1.083-2.537-1.208-0.341-0.124-0.589-0.185-0.837 0.187-0.246 0.371-0.958 1.207-1.175 1.455-0.216 0.249-0.434 0.279-0.805 0.094-1.15-0.466-2.138-1.087-2.997-1.852l0.010 0.009c-0.799-0.74-1.484-1.587-2.037-2.521l-0.028-0.052c-0.216-0.371-0.023-0.572 0.162-0.757 0.167-0.166 0.372-0.434 0.557-0.65 0.146-0.179 0.271-0.384 0.366-0.604l0.006-0.017c0.043-0.087 0.068-0.188 0.068-0.296 0-0.131-0.037-0.253-0.101-0.357l0.002 0.003c-0.094-0.186-0.836-2.014-1.145-2.758-0.302-0.724-0.609-0.625-0.836-0.637-0.216-0.010-0.464-0.012-0.712-0.012-0.395 0.010-0.746 0.188-0.988 0.463l-0.001 0.002c-0.802 0.761-1.3 1.834-1.3 3.023 0 0.026 0 0.053 0.001 0.079l-0-0.004c0.131 1.467 0.681 2.784 1.527 3.857l-0.012-0.015c1.604 2.379 3.742 4.282 6.251 5.564l0.094 0.043c0.548 0.248 1.25 0.513 1.968 0.74l0.149 0.041c0.442 0.14 0.951 0.221 1.479 0.221 0.303 0 0.601-0.027 0.889-0.078l-0.031 0.004c1.069-0.223 1.956-0.868 2.497-1.749l0.009-0.017c0.165-0.366 0.261-0.793 0.261-1.242 0-0.185-0.016-0.366-0.047-0.542l0.003 0.019c-0.092-0.155-0.34-0.247-0.712-0.434z"></path>
                    </g>
                  </svg>
                )}
                {status}
              </span>
            }
            sx={{
              color:
                status === 'delivered' || status === 'completed'
                  ? 'green'
                  : status === 'pending' || status === 'washed'
                    ? 'orange'
                    : status === 'ironed' || status === 'packaged'
                      ? 'blue'
                      : 'red',
              textTransform: 'capitalize',
            }}
          />
        );
      },
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
