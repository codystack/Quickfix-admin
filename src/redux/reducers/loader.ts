import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

interface LoaderI {
  isLoading: boolean;
}

const initVal: LoaderI = {
  isLoading: false,
};

const loaderSlice = createSlice({
  initialState: initVal,
  name: 'loader',
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const { setLoading } = loaderSlice.actions


export default loaderSlice.reducer;