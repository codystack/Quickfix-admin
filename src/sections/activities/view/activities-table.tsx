/* eslint-disable react/no-unstable-nested-components */
import type { RootState } from 'src/redux/store';

/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { useSelector } from 'react-redux';

// import { Download } from "@mui/icons-material";
import { Avatar } from '@mui/material';
import {
  DataGrid,
  GridToolbar,
} from '@mui/x-data-grid';

import useActivities from 'src/hooks/use-activities';

import CustomNoRowsOverlay from 'src/components/custom_no_row';

import ActionButton from './action';

export default function ActivitiesTable() {
  const { activities } = useSelector((state: RootState) => state.user);
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 25,
  });
  const [loading, setLoading] = React.useState(false);
  const [filteredActivities, setFilteredActivities] = React.useState(activities?.data ?? []);

  const { data: activitiesData } = useActivities(paginationModel.page + 1);
  console.log("ACTIVITIES HERE :::: ", activities);
  

  const columns = [
    {
      field: 'user',
      headerName: 'Photo',
      width: 70,
      renderCell: (params: any) => (
        <Avatar src={params?.row?.photoUrl} variant="circular">
          {params?.row?.first_name}
        </Avatar>
      ),
    },
    {
      field: 'first_name',
      headerName: 'Full Name',
      flex: 1,
      renderCell: (params: any) => (
        <p style={{ textTransform: 'capitalize', fontSize: 14 }}>{`${params?.row?.admin?.first_name ?? ""} ${params?.row?.admin?.last_name ?? ""}`}</p>
      ),
    },
    {
      field: 'email_address',
      headerName: 'Email Address',
      flex: 1,
      renderCell: (params: any) => (
        <p style={{ textTransform: 'capitalize', fontSize: 14 }}>{params?.row?.admin?.email_address ?? ""}</p>
      ),
    },
    {
      field: 'role',
      headerName: 'Role',
      flex: 1,
      renderCell: (params: any) => (
        <p
          style={{ textTransform: 'capitalize', fontSize: 14 }}
        >{`${params?.row?.admin?.role ?? ""}`}</p>
      ),
    },
    {
      field: 'title',
      headerName: 'Title',
      flex: 1,
      renderCell: (params: any) => (
        <p
          style={{ textTransform: 'capitalize', fontSize: 14 }}
        >{`${params?.row?.title}`}</p>
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
      if (activitiesData) {
        console.log('SECOND PAGE DATA', activitiesData);
        setFilteredActivities(activitiesData?.data);
      }

      if (!active) {
        return;
      }

      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [paginationModel.page, activitiesData]);

  return (
    <div style={{ height: '75vh', width: '100%' }}>
      {activities && activities?.data && filteredActivities && (
        <DataGrid
          sx={{ padding: 1, }}
          rows={filteredActivities}
          columns={columns}
          paginationMode="server"
          pageSizeOptions={[25]}
          rowCount={activities?.totalItems}
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
