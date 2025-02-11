import type { RootState } from 'src/redux/store';

import { useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import { _users } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import AllTransactionsTable from './transaction-table';

// ----------------------------------------------------------------------

export function TransactionView() {
  const { transactions } = useSelector((state: RootState) => state.transaction);

  console.log('TRANSACTIONS ::: ', transactions);

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Transactions
        </Typography>
      </Box>

      <Card>
        <AllTransactionsTable />
      </Card>
    </DashboardContent>
  );
}
