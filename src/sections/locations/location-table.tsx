/* eslint-disable react/no-unstable-nested-components */
import type { RootState } from 'src/redux/store';

/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { useSelector } from 'react-redux';

// import { Download } from "@mui/icons-material";
import { Box, Avatar, Typography } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import useLocations from 'src/hooks/use-locations';

import CustomNoRowsOverlay from 'src/components/custom_no_row';

import ActionButton from './action';

export default function AlLocationsTable() {
  const { locations } = useSelector((state: RootState) => state.location);
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 25,
  });
  const [loading, setLoading] = React.useState(false);
  const [filteredLocations, setFilteredLocations] = React.useState(locations?.data ?? []);

  const { data: locationsData } = useLocations(paginationModel.page + 1);

  const columns = [
    {
      field: 'region',
      headerName: 'Region',
      flex: 1,
      renderCell: (params: any) => (
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="start"
          alignItems="center"
          alignSelf="center"
          sx={{ display: 'flex', alignItems: 'center', height: '100%', fontSize: 13 }}
        >
          <Typography
            px={0.75}
            sx={{ textTransform: 'capitalize', fontSize: 14 }}
          >{`${params?.row?.region}`}</Typography>
        </Box>
      ),
    },
    {
      field: 'city',
      headerName: 'City',
      flex: 1,
      renderCell: (params: any) => (
        <Typography
          sx={{
            textTransform: 'capitalize',
            fontSize: 14,
            display: 'flex',
            alignItems: 'center',
            height: '100%',
          }}
        >{`${params?.row?.city}`}</Typography>
      ),
    },

    {
      field: 'createdAt',
      headerName: 'Added On',
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
        >{`${new Date(params?.row?.createdAt).toLocaleString('en-US')}`}</Typography>
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
      if (locationsData) {
        console.log('SECOND PAGE DATA', locationsData);
        setFilteredLocations(locationsData?.data);
      }

      if (!active) {
        return;
      }

      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [paginationModel.page, locationsData]);

  return (
    <div style={{ height: '75vh', width: '100%' }}>
      {locations && locations?.data && filteredLocations && (
        <DataGrid
          sx={{ padding: 1 }}
          rows={filteredLocations}
          columns={columns}
          paginationMode="server"
          pageSizeOptions={[25]}
          rowCount={locations?.totalItems}
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
