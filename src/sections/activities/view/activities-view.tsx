import type { RootState } from 'src/redux/store';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import APIService from 'src/service/api.service';
import { DashboardContent } from 'src/layouts/dashboard';
import { setActivities } from 'src/redux/reducers/users';

import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from '../table-no-data';
import { TableEmptyRows } from '../table-empty-rows';
import { ActivitiesTableRow } from '../activities-table-row';
import { ActivitiesTableHead } from '../activities-table-head';
import { emptyRows, applyFilter, getComparator } from '../utils';
import { ActivitiesTableToolbar } from '../activities-table-toolbar';

// ----------------------------------------------------------------------

export function ActivitiesView() {
  const { activities } = useSelector((state: RootState) => state.user);
  const [filterName, setFilterName] = useState('');
  const [da, setDa] = useState(activities?.data ?? []);
  // let dataFiltered: any[] = applyFilter({
  //   inputData: da,
  //   comparator: getComparator(table.order, table.orderBy),
  //   filterName,
  // });

  const table = useTable(activities, setDa, filterName);


  const notFound = !table.dataFiltered.current?.length && !!filterName;

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Activities
        </Typography>
      </Box>

      <Card>
        <ActivitiesTableToolbar
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
              <ActivitiesTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={activities?.totalItems}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    activities?.data?.map((item: any) => item.id)
                  )
                }
                headLabel={[
                  { id: 'name', label: 'User' },
                  { id: 'email_address', label: 'Email Address' },
                  { id: 'phone_number', label: 'Phone' },
                  { id: 'role', label: 'Role' },
                  { id: 'title', label: 'Title' },
                ]}
              />
              <TableBody>
                {table.dataFiltered.current
                  .map((row: any) => (
                    <ActivitiesTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table?.page, table?.rowsPerPage, activities?.totalItems)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={activities?.totalItems}
          rowsPerPage={activities?.perPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[25]}
          
        />
      </Card>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

export function useTable(activities: any, setData: any, filterName: string) {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(activities?.perPage);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const dispatch = useDispatch();
  const dataFiltered = useRef<any[]>([]);

  // const dataFiltered: any[] = useRef(applyFilter({
  //   inputData: activities.data ?? [],
  //   comparator: getComparator(order, orderBy),
  //   filterName,
  // }));

  useEffect(() => {
    // Update the ref with the filtered data
    dataFiltered.current = applyFilter({
      inputData: activities.data ?? [],
      comparator: getComparator(order, orderBy),
      filterName,
    });
  }, [activities, order, orderBy, filterName]);


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

  const onChangePage = useCallback(async (event: unknown, newPage: number) => {
    setPage(newPage);
    // now fetch new page here
    console.log('NPAGE ', newPage);

    try {
      const pg = newPage + 1;
      const resp = await APIService.getActivities(pg);
      console.log('SDSD :: ', resp.data);
      // setData(resp.data?.data);
      dispatch(setActivities(resp.data))

      dataFiltered.current = applyFilter({
        inputData: resp.data.data ?? [],
        comparator: getComparator(order, orderBy),
        filterName,
      });
      
    } catch (error) {
      console.log(error);
    }
  }, [dispatch, filterName, order, orderBy]);

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
    dataFiltered,
  };
}
