import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

interface ExpressI {
  expressList: any;
}

const initVal: ExpressI = {
  expressList: null,
};

const expressSlice = createSlice({
  initialState: initVal,
  name: 'express',
  reducers: {
    setExpressList(state, action: PayloadAction<any>) {
      state.expressList = action.payload;
    },
  },
});

export const { setExpressList } = expressSlice.actions;

export default expressSlice.reducer;
