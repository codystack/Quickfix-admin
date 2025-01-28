import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

interface LocationI {
  locations: any;
  locationList: any;
}

const initVal: LocationI = {
  locations: null,
  locationList: null,
};

const locationSlice = createSlice({
  initialState: initVal,
  name: 'location',
  reducers: {
    setLocations(state, action: PayloadAction<any>) {
      state.locations = action.payload;
    },
    setLocationList(state, action: PayloadAction<any>) {
      state.locationList = action.payload;
    },
  },
});

export const { setLocations, setLocationList } = locationSlice.actions


export default locationSlice.reducer;