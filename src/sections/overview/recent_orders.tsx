import type { RootState } from 'src/redux/store';
import type { CardProps } from '@mui/material/Card';
import type { ChartOptions } from 'src/components/chart';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';
import { Box, Button, Typography } from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { useTableMini, ReusableContentMini } from 'src/components/reuseable';

import { applyFilter, getComparator } from '../user/utils';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  chart: {
    colors?: string[];
    categories?: string[];
    series: {
      name: string;
      data: number[];
    }[];
    options?: ChartOptions;
  };
};

export function RecentOrders({ title, subheader, chart, ...other }: Props) {
  const { orders } = useSelector((state: RootState) => state.order);
  const theme = useTheme();
  const navigate = useNavigate();
  const table = useTableMini();


  const [filterName, setFilterName] = useState('');

  const dataFiltered: any[] = applyFilter({
    inputData: orders?.data?.slice(0, 5),
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered?.length && !!filterName;


  return (
    <Card {...other}>
      <Box
        p={4}
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box display="flex" flexDirection="column" justifyContent="start" alignItems="start">
          <Typography variant="h5">{title}</Typography>
          <Typography variant="body2">{subheader}</Typography>
        </Box>
        <Button
          variant="text"
          endIcon={<Iconify icon="system-uicons:arrow-right" />}
          onClick={() => navigate('/dashboard/orders')}
        >
          View all
        </Button>
      </Box>
      <Box p={1} />
      <ReusableContentMini
        table={table}
        filterName={filterName}
        setFilterName={setFilterName}
        dataFiltered={dataFiltered}
        notFound={notFound}
      />
      <Box p={2} />
    </Card>
  );
}
