import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

interface TransactionI {
  transactions: any;
}

const initVal: TransactionI = {
  transactions: null,
};
const transactionSlice = createSlice({
  initialState: initVal,
  name: 'transaction',
  reducers: {
    setTransactions(state, action: PayloadAction<any>) {
      state.transactions = action.payload;
    },
  },
});

export const { setTransactions } = transactionSlice.actions

export default transactionSlice.reducer;