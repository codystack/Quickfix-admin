import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

interface TransactionI {
  transactions: any;
  revenue: any;
}

const initVal: TransactionI = {
  transactions: null,
  revenue: null,
};
const transactionSlice = createSlice({
  initialState: initVal,
  name: 'transaction',
  reducers: {
    setTransactions(state, action: PayloadAction<any>) {
      state.transactions = action.payload;
    },
    setRevenue(state, action: PayloadAction<any>) {
      state.revenue = action.payload;
    },
  },
});

export const { setTransactions, setRevenue } = transactionSlice.actions

export default transactionSlice.reducer;