import type { RootState } from 'src/redux/store';

import { useSelector } from 'react-redux';
import React, { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import { TabPanel, TabContext } from '@mui/lab';
import TableBody from '@mui/material/TableBody';
import { Tab, Tabs, styled } from '@mui/material';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { _users } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from '../table-no-data';
import { UserTableRow } from '../booking-table-row';
import { TableEmptyRows } from '../table-empty-rows';
import { UserTableHead } from '../booking-table-head';
import { BookingTableToolbar } from '../booking-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

import type { UserProps } from '../booking-table-row';
import { Session } from './session';
import { FastTrack } from './fasttrack';
import { WorkingClass } from './working-class';

// ----------------------------------------------------------------------

const AntTabs = styled(Tabs)({
  borderBottom: '1px solid #e8e8e8',
  '& .MuiTabs-indicator': {
    backgroundColor: '#1890ff',
  },
});

const AntTab = styled((props: StyledTabProps) => <Tab disableRipple {...props} />)(({ theme }) => ({
  textTransform: 'none',
  minWidth: 0,
  [theme.breakpoints.up('sm')]: {
    minWidth: 0,
  },
  fontWeight: theme.typography.fontWeightRegular,
  marginRight: theme.spacing(1),
  color: 'rgba(0, 0, 0, 0.85)',
  fontFamily: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(','),
  '&:hover': {
    color: '#40a9ff',
    opacity: 1,
  },
  '&.Mui-selected': {
    color: '#1890ff',
    fontWeight: theme.typography.fontWeightMedium,
  },
  '&.Mui-focusVisible': {
    backgroundColor: '#d1eaff',
  },
}));

interface StyledTabsProps {
  children?: React.ReactNode;
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const StyledTabs = styled((props: StyledTabsProps) => (
  <Tabs {...props} TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }} />
))({
  '& .MuiTabs-indicator': {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  '& .MuiTabs-indicatorSpan': {
    maxWidth: 40,
    width: '100%',
    backgroundColor: '#635ee7',
  },
});

interface StyledTabProps {
  label: string;
}

const StyledTab = styled((props: StyledTabProps) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    textTransform: 'none',
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(1),
    color: 'rgba(255, 255, 255, 0.7)',
    '&.Mui-selected': {
      color: '#fff',
    },
    '&.Mui-focusVisible': {
      backgroundColor: 'rgba(100, 95, 228, 0.32)',
    },
  })
);

export function BookingView() {
  const table = useTable();

  const [value, setValue] = React.useState('0');

  const [filterName, setFilterName] = useState('');
  const { bookings, fastTrackBookings, sessionBookings } = useSelector(
    (state: RootState) => state.booking
  );
  console.log('STATE BOOKINGS HERE ::: ', bookings);

  let dataFiltered: UserProps[] = applyFilter({
    inputData: bookings?.data,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(`${newValue}`);

    if (value === '1') {
      setTimeout(() => {
        dataFiltered = applyFilter({
          inputData: sessionBookings?.data,
          comparator: getComparator(table.order, table.orderBy),
          filterName,
        });
      }, 2000);
    } else if (value === '2') {
      setTimeout(() => {
        dataFiltered = applyFilter({
          inputData: fastTrackBookings?.data ?? [],
          comparator: getComparator(table.order, table.orderBy),
          filterName,
        });
      }, 3000);
    }
  };

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Appointments
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          Schedule
        </Button>
      </Box>

      <Card>
        <TabContext value={value}>
          <Box sx={{ width: '100%' }}>
            <Box sx={{ bgcolor: '#2e1534' }}>
              <StyledTabs
                value={parseInt(value, 10)}
                onChange={handleChange}
                aria-label="styled tabs example"
              >
                <StyledTab label="All" />
                <StyledTab label="Book Session" />
                <StyledTab label="Fast Track" />
                <StyledTab label="Working Class" />
              </StyledTabs>
              <Box sx={{ p: 0.5 }} />
            </Box>
          </Box>
          <Box width="100%">
            <TabPanel value="0">
              <ReusableContent
                table={table}
                filterName={filterName}
                setFilterName={setFilterName}
                dataFiltered={dataFiltered}
                notFound={notFound}
              />
            </TabPanel>
            <TabPanel value="1">
             <Session />
            </TabPanel>
            <TabPanel value="2">
              <FastTrack />
            </TabPanel>
            <TabPanel value="3">
              <WorkingClass />
            </TabPanel>
          </Box>
        </TabContext>
      </Card>
    </DashboardContent>
  );
}

const ReusableContent = ({ table, filterName, setFilterName, dataFiltered, notFound }: any) => (
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
