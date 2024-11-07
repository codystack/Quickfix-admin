import type { RootState } from 'src/redux/store';

import { useSelector } from 'react-redux';
import React, { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import useBookingsCategory from 'src/hooks/use-bookings-category';

import { _users } from 'src/_mock';

import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from '../table-no-data';
import { UserTableRow } from '../booking-table-row';
import { TableEmptyRows } from '../table-empty-rows';
import { UserTableHead } from '../booking-table-head';
import { BookingTableToolbar } from '../booking-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

import type { UserProps } from '../booking-table-row';

// ----------------------------------------------------------------------


export function Session() {
  const table = useTable();

  const [filterName, setFilterName] = useState('');
  const { sessionBookings,  } = useSelector((state: RootState) => state.booking);

  const {  data: sessionBookingsData, } = useBookingsCategory(1, 'book-session');

  console.log('STATE SESSION BOOKINGS HERE ::: ', sessionBookingsData);

  const dataFiltered: UserProps[] = applyFilter({
    inputData: sessionBookings?.data ?? [],
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Box>
    <BookingTableToolbar
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
          <UserTableHead
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
              { id: 'name', label: 'Name' },
              { id: 'amount', label: 'Amount' },
              { id: 'category', label: 'Category' },
              { id: 'reason', label: 'Reason' },
              { id: 'location', label: 'Location' },
              { id: 'status', label: 'Status' },
              { id: '' },
            ]}
          />
          <TableBody>
            {dataFiltered
              .slice(
                table.page * table.rowsPerPage,
                table.page * table.rowsPerPage + table.rowsPerPage
              )
              .map((row: any) => (
                <UserTableRow
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
      count={_users.length}
      rowsPerPage={table.rowsPerPage}
      onPageChange={table.onChangePage}
      rowsPerPageOptions={[5, 10, 25]}
      onRowsPerPageChange={table.onChangeRowsPerPage}
    />
  </Box>
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
