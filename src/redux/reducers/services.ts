import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

interface ServiceI {
  services: any;
}

const initVal: ServiceI = {
  services: null,
};

const serviceSlice = createSlice({
  initialState: initVal,
  name: 'service',
  reducers: {
    setServices(state, action: PayloadAction<any>) {
      state.services = action.payload;
    },
  },
});

export const { setServices } = serviceSlice.actions


export default serviceSlice.reducer;