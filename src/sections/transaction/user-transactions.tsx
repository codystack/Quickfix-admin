/* eslint-disable react/no-unstable-nested-components */
import type { RootState } from 'src/redux/store';

/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { useSelector } from 'react-redux';

import { DataGrid, GridToolbar } from '@mui/x-data-grid';
// import { Download } from "@mui/icons-material";
import { Box, Chip, Avatar, Typography } from '@mui/material';


import { fNumber } from 'src/utils/format-number';

import CustomNoRowsOverlay from 'src/components/custom_no_row';

import ActionButton from './action';
import useTransactions from 'src/hooks/use-transactions';
import useUserTransactions from 'src/hooks/use-user-transactions';

export default function UserTransactionsTable({ userEmail }: any) {
  // const { carWashTransactions } = useSelector((state: RootState) => state.order);
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 25,
  });
  const [loading, setLoading] = React.useState(false);
  const [filteredTransactions, setFilteredTransactions] = React.useState([]);

  const { data: transactionsData } = useUserTransactions(paginationModel.page + 1, userEmail);

  const columns = [
    {
      field: 'user',
      headerName: 'Customer Name',
      flex: 1,
      renderCell: (params: any) => (
        <p
          style={{ textTransform: 'capitalize', fontSize: 14 }}
        >{`${params?.row?.user?.first_name} ${params?.row?.user?.last_name}`}</p>
      ),
    },
    {
      field: 'trans_ref',
      headerName: 'Trx Reference',
      flex: 1,
      renderCell: (params: any) => (
        <p style={{ textTransform: 'none', fontSize: 14 }}>{params?.row?.trans_ref}</p>
      ),
    },
    {
      field: 'amount',
      headerName: 'Amount',
      flex: 1,
      renderCell: (params: any) => (
        <p style={{ textTransform: 'none', fontSize: 14 }}>{`₦${fNumber(params?.row?.amount)}`}</p>
      ),
    },
    {
      field: 'type',
      headerName: 'Type',
      flex: 1,
      renderCell: (params: any) => (
        <p>{`${params?.row?.type}`}</p>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Initiated On',
      flex: 1,
      renderCell: (params: any) => (
        <p>{`${new Date(params?.row?.createdAt).toLocaleString('en-US')}`}</p>
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
      if (transactionsData) {
        setFilteredTransactions(transactionsData?.data);
      }

      if (!active) {
        return;
      }

      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [paginationModel.page, transactionsData]);

  return (
    <div style={{ height: '75vh', width: '100%' }}>
      {transactionsData && transactionsData?.data && filteredTransactions && (
        <DataGrid
          sx={{ padding: 1 }}
          rows={filteredTransactions}
          columns={columns}
          paginationMode="server"
          pageSizeOptions={[25]}
          rowCount={transactionsData?.totalItems}
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
