import type { RootState } from 'src/redux/store';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import Box from '@mui/material/Box';

import useOrderCategory from 'src/hooks/use-orders-category';

import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

export function Pending() {

  const [filterName, setFilterName] = useState('');
  const { cleaningOrders } = useSelector((state: RootState) => state.order);

  const { data: cleaningOrdersData } = useOrderCategory(1, 'cleaning');

  console.log('STATE PENDING ORDERS HERE ::: ', cleaningOrdersData);

  return (
    <Box>
      <Scrollbar>{/*  */}</Scrollbar>
    </Box>
  );
}

// ----------------------------------------------------------------------
