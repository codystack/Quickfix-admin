import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

interface LoaderI {
  isLoading: boolean;
  settings: any;
}

const initVal: LoaderI = {
  isLoading: false,
  settings: null
};

const loaderSlice = createSlice({
  initialState: initVal,
  name: 'loader',
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setSettings(state, action: PayloadAction<any>) {
      state.settings = action.payload;
    },
  },
});

export const { setLoading, setSettings } = loaderSlice.actions


export default loaderSlice.reducer;