import type { RootState } from 'src/redux/store';

import * as Yup from 'yup';
import { mutate } from 'swr';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { Button , useTheme, TextField } from '@mui/material';

import { _users } from 'src/_mock';
import APIService from 'src/service/api.service';
import { setLoading } from 'src/redux/reducers/loader';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import CustomizedDialog from 'src/components/dialog';

import { TableNoData } from '../table-no-data';
import { TableEmptyRows } from '../table-empty-rows';
import { LocationTableRow } from '../location-table-row';
import { LocationTableHead } from '../location-table-head';
import { emptyRows, applyFilter, getComparator } from '../utils';
import { LocationTableToolbar } from '../location-table-toolbar';

// ----------------------------------------------------------------------

export function LocationView() {
  const table = useTable();
  const [open, setOpen] = useState(false);
  const [filterName, setFilterName] = useState('');
  const { locations } = useSelector((state: RootState) => state.misc)

  const dataFiltered: any[] = applyFilter({
    inputData: locations,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <DashboardContent>
       <CustomizedDialog
        open={open}
        setOpen={setOpen}
        title="Add New Location"
        body={<AddLocation setOpen={setOpen} />}
      />
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Locations
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          onClick={() => setOpen(true)}
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          New Location
        </Button>
      </Box>

      <Card>
        <LocationTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <LocationTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={_users.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    _users.map((user) => user.id)
                  )
                }
                headLabel={[
                  { id: 'region', label: 'Region' },
                  { id: 'city', label: 'City' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <LocationTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, _users.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={locations?.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

export function useTable() {
  
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onSelectRow = useCallback(
    (inputValue: string) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}

const AddLocation = ({ setOpen }: any) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state: RootState) => state.loader);
  const validate = Yup.object().shape({
    region: Yup.string().required('Region is required'),
    city: Yup.string().required('City is required'),
  });


  const formik = useFormik({
    initialValues: {
      region: '',
      city: '',
    },
    validationSchema: validate,
    onSubmit: async (values) => {
      try {         
         dispatch(setLoading(true));

          const payload = {
            region: values.region,
            city: values.city,
          };

          const response = APIService.addLocation(payload);
          toast.promise(response, {
            pending: {
              render() {
                return 'Loading. Please wait...';
              },
              icon: false,
            },
            success: {
              render({ data }) {
                dispatch(setLoading(false));
                mutate('/admins/locations/all')
                const res = data?.data?.message || 'New location added successfully';
                setOpen(false);
                return `${res}`;
              },
            },
            error: {
              render({ data }: any) {
                dispatch(setLoading(false));
                console.log('ERRO ON TOAST HERE :: ', data?.response?.data?.message);
                const errorMsg = data?.response?.data?.message || data?.message || '';
                // When the promise reject, data will contains the error
                return `${errorMsg ?? 'An error occurred!'}`;
              },
            },
          });
        
      } catch (error) {
        dispatch(setLoading(false));
        console.log('LOCATION ERR :: ', error);
      }
    },
  });


  const { touched, errors, getFieldProps, handleSubmit } = formik;
  return (
    <Box p={3} minWidth={320} >
      <TextField
        variant="outlined"
        fullWidth
        placeholder="Region"
        label="Region"
        {...getFieldProps('region')}
        error={Boolean(touched.region && errors.region)}
        helperText={touched.region && errors.region}
      />
      <Box p={1} />
      <TextField
        variant="outlined"
        fullWidth
        placeholder="City"
        label="City"
        {...getFieldProps('city')}
        error={Boolean(touched.city && errors.city)}
        helperText={touched.city && errors.city}
      />
      <Box p={2} />

      <Button
        fullWidth
        disabled={isLoading}
        variant="contained"
        onClick={() => handleSubmit()}
        sx={{ bgcolor: theme.palette.secondary.main }}
      >
        Submit
      </Button>
    </Box>
  );
};
