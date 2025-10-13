/* eslint-disable react/no-unstable-nested-components */
import type { RootState } from 'src/redux/store';

/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { useSelector } from 'react-redux';

// import { Download } from "@mui/icons-material";
import { Chip, Avatar, Box, Typography } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import CustomNoRowsOverlay from 'src/components/custom_no_row';

import ActionButton from './action';
import useTransactions from 'src/hooks/use-transactions';
import { fNumber } from 'src/utils/format-number';
import { Iconify } from 'src/components/iconify';

export default function AllTransactionsTable() {
  const { transactions } = useSelector((state: RootState) => state.transaction);
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 25,
  });
  const [loading, setLoading] = React.useState(false);
  const [filteredTransactions, setFiltereTransactions] = React.useState(transactions?.data ?? []);

  const { data: transactionsData } = useTransactions(paginationModel.page + 1);

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
        setFiltereTransactions(transactionsData?.data);
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
    <div style={{ height: '75vh', width: '100%', padding: 10 }}>
      {transactions && transactions?.data && filteredTransactions && (
        <DataGrid
          sx={{ padding: 1 }}
          rows={filteredTransactions}
          columns={columns}
          paginationMode="server"
          pageSizeOptions={[25]}
          rowCount={transactions?.totalItems}
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
