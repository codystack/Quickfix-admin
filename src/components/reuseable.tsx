import { useState, useCallback } from 'react';

import { Box , Table, TableBody, TableContainer } from '@mui/material';

import { _users } from 'src/_mock';

import { emptyRows } from 'src/sections/order/utils';
import { TableNoData } from 'src/sections/order/table-no-data';
import { UserTableRow } from 'src/sections/order/user-table-row';
import { UserTableHead } from 'src/sections/order/user-table-head';
import { TableEmptyRows } from 'src/sections/order/table-empty-rows';

import { Scrollbar } from './scrollbar';

export const ReusableContentMini = ({
  table,
  filterName,
  setFilterName,
  dataFiltered,
  notFound,
}: any) => (
  <Box>
    <Scrollbar>
      <TableContainer sx={{ overflow: 'unset' }}>
        <Table sx={{ minWidth: 800 }}>
          <UserTableHead
            order={table?.order}
            orderBy={table?.orderBy}
            rowCount={_users?.length}
            numSelected={table.selected.length}
            onSort={table.onSort}
            onSelectAllRows={(checked) =>
              table.onSelectAllRows(
                checked,
                _users?.map((user) => user?.id)
              )
            }
            headLabel={[
              { id: 'name', label: 'User' },
              { id: 'service', label: 'Service' },
              { id: 'order_id', label: 'Order Num' },
              { id: 'amount', label: 'Amount' },
              { id: 'location', label: 'Location' },
              { id: 'items', label: 'Items' },
            ]}
          />
          <TableBody>
            {dataFiltered
              ?.slice(
                table.page * table.rowsPerPage,
                table.page * table.rowsPerPage + table.rowsPerPage
              )
              ?.map((row: any) => (
                <UserTableRow
                  key={row?.id}
                  row={row}
                  selected={table.selected.includes(row?.id)}
                  onSelectRow={() => table.onSelectRow(row?.id)}
                />
              ))}

            <TableEmptyRows
              height={68}
              emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered?.length)}
            />

            {notFound && <TableNoData searchQuery={filterName} />}
          </TableBody>
        </Table>
      </TableContainer>
    </Scrollbar>
  </Box>
);

export function useTableMini() {
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
      const newSelected = selected?.includes(inputValue)
        ? selected?.filter((value) => value !== inputValue)
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
