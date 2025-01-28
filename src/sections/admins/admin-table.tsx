/* eslint-disable react/no-unstable-nested-components */
import type { RootState } from 'src/redux/store';

/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { useSelector } from 'react-redux';

// import { Download } from "@mui/icons-material";
import { Box, Avatar, Typography } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import useAdmins from 'src/hooks/use-admins';

import CustomNoRowsOverlay from 'src/components/custom_no_row';

import ActionButton from './action';

export default function AllAdminsTable() {
  const { admins } = useSelector((state: RootState) => state.user);
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 25,
  });
  const [loading, setLoading] = React.useState(false);
  const [filteredAdmins, setFilteredAdmins] = React.useState(admins?.data ?? []);

  const { data: adminsData } = useAdmins(paginationModel.page + 1);

  const columns = [
    {
      field: 'user',
      headerName: 'Name',
      flex: 1,
      renderCell: (params: any) => (
        <Box display="flex" flexDirection="row" justifyContent="start" alignItems="center" alignSelf="center" >
          <Avatar src={params?.row?.photoUrl} variant="rounded">
            {params?.row?.first_name?.slice(0, 1)}
          </Avatar>
          <Typography px={0.75} sx={{ textTransform: 'capitalize', fontSize: 14 }}>{`${params?.row?.first_name} ${params?.row?.last_name}`}</Typography>
        </Box>
      ),
    },
    {
      field: 'email_address',
      headerName: 'Email Address',
      flex: 1,
      renderCell: (params: any) => (
        <p style={{ textTransform: 'capitalize', fontSize: 14 }}>{params?.row?.email_address}</p>
      ),
    },
    {
      field: 'phone_number',
      headerName: 'Phone Number',
      flex: 1,
      renderCell: (params: any) => (
        <p
          style={{ textTransform: 'capitalize', fontSize: 14 }}
        >{`${params?.row?.phone_number}`}</p>
      ),
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 100,
      renderCell: (params: any) => (
        <p
          style={{ textTransform: 'capitalize', fontSize: 14 }}
        >{`${params?.row?.type}`}</p>
      ),
    },
    {
      field: 'role',
      headerName: 'Role',
      width: 100,
      renderCell: (params: any) => (
        <p
          style={{ textTransform: 'capitalize', fontSize: 14 }}
        >{`${params?.row?.role}`}</p>
      ),
    },
    {
      field: 'access',
      headerName: 'Access',
      width: 100,
      renderCell: (params: any) => (
        <p
          style={{ textTransform: 'capitalize', fontSize: 14 }}
        >{`${params?.row?.access}`}</p>
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
      if (adminsData) {
        console.log('SECOND PAGE DATA', adminsData);
        setFilteredAdmins(adminsData?.data);
      }

      if (!active) {
        return;
      }

      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [paginationModel.page, adminsData]);

  return (
    <div style={{ height: '75vh', width: '100%' }}>
      {admins && admins?.data && filteredAdmins && (
        <DataGrid
          sx={{ padding: 1 }}
          rows={filteredAdmins}
          columns={columns}
          paginationMode="server"
          pageSizeOptions={[25]}
          rowCount={admins?.totalItems}
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
