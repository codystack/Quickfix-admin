import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

interface MiscI {
  locations: any[];
  reasons: any[];
}

const initVal: MiscI = {
  locations: [],
  reasons: [],
};
const miscSlice = createSlice({
  initialState: initVal,
  name: 'misc',
  reducers: {
    setLocations(state, action: PayloadAction<any[]>) {
      state.locations = action.payload;
    },
    setReasons(state, action: PayloadAction<any[]>) {
      state.reasons = action.payload;
    },
  },
});

export const { setLocations, setReasons } = miscSlice.actions

export default miscSlice.reducer;