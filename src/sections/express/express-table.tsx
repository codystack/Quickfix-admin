/* eslint-disable react/no-unstable-nested-components */
import type { RootState } from 'src/redux/store';

/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { useSelector } from 'react-redux';

// import { Download } from "@mui/icons-material";
import { Box, Typography } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import useExpress from 'src/hooks/use-express';

import CustomNoRowsOverlay from 'src/components/custom_no_row';

import ActionButton from './action';

export default function ExpressTable() {
  const { expressList } = useSelector((state: RootState) => state.express);
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 25,
  });
  const [loading, setLoading] = React.useState(false);
  const [filteredExpress, setFilteredExpress] = React.useState([]);
  
  const columns = [
    {
      field: 'name',
      headerName: 'Name',
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
          >{`${params?.row?.name}`}</Typography>
        </Box>
      ),
    },
    {
      field: 'fee',
      headerName: 'Charge (%)',
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
        >{`${params?.row?.fee}%`}</Typography>
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
    if (expressList) {
      const fil = expressList?.map((item: any) => ({
        ...item,
        id: item?._id,
      }));

      setFilteredExpress(fil);
    }
  }, [expressList]);

  return (
    <div style={{ height: '75vh', width: '100%' }}>
      {expressList && filteredExpress && (
        <DataGrid
          sx={{ padding: 1 }}
          rows={filteredExpress}
          columns={columns}
          paginationMode="server"
          pageSizeOptions={[25]}
          rowCount={expressList?.length}
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
