/* eslint-disable react/no-unstable-nested-components */
import type { RootState } from 'src/redux/store';

/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { useSelector } from 'react-redux';

// import { Download } from "@mui/icons-material";
import { Chip, Avatar } from '@mui/material';
import {
  DataGrid,
  GridToolbar,
} from '@mui/x-data-grid';

import useUsers from 'src/hooks/use-users';

import CustomNoRowsOverlay from 'src/components/custom_no_row';

import ActionButton from './action';

export default function AllUsersTable() {
  const { users } = useSelector((state: RootState) => state.user);
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 25,
  });
  const [loading, setLoading] = React.useState(false);
  const [filteredUsers, setFilteredUsers] = React.useState(users?.data ?? []);

  const { data: usersData } = useUsers(paginationModel.page + 1);

  const columns = [
    {
      field: 'user',
      headerName: 'Photo',
      width: 70,
      renderCell: (params: any) => (
        <Avatar src={params?.row?.photoUrl} variant="rounded">
          {params?.row?.first_name?.slice(0,1)}
        </Avatar>
      ),
    },
    {
      field: 'first_name',
      headerName: 'First Name',
      flex: 1,
      renderCell: (params: any) => (
        <p style={{ textTransform: 'capitalize', fontSize: 14 }}>{params?.row?.first_name}</p>
      ),
    },
    {
      field: 'last_name',
      headerName: 'Last Name',
      flex: 1,
      renderCell: (params: { row: any }) => (
        <p style={{ textTransform: 'capitalize', fontSize: 14 }}>{params?.row?.last_name}</p>
      ),
    },
    {
      field: 'email_address',
      headerName: 'Email Address',
      flex: 1,
      renderCell: (params: any) => (
        <p style={{ textTransform: 'none', fontSize: 14 }}>{params?.row?.email_address}</p>
      ),
    },
    {
      field: 'international_phone_format',
      headerName: 'Phone Number',
      flex: 1,
      renderCell: (params: any) => (
        <p
          style={{ textTransform: 'capitalize', fontSize: 14 }}
        >{`${params?.row?.international_phone_format}`}</p>
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
      if (usersData) {
        setFilteredUsers(usersData?.data);
      }

      if (!active) {
        return;
      }

      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [paginationModel.page, usersData]);

  return (
    <div style={{ height: '75vh', width: '100%', padding: 10 }}>
      {users && users?.data && filteredUsers && (
        <DataGrid
          sx={{ padding: 1, }}
          rows={filteredUsers}
          columns={columns}
          paginationMode="server"
          pageSizeOptions={[25]}
          rowCount={users?.totalItems}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          loading={loading}
          slots={{
            noRowsOverlay: CustomNoRowsOverlay,
            toolbar: GridToolbar
          }}
        />
      )}
    </div>
  );
}
