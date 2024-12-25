import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

interface OrderI {
  orders: any;
  pendingOrders: any;
  washedOrders: any;
  declinedOrders: any;
  packagedOrders: any;
  ironedOrders: any;
  damagedOrders: any;
  deliveredOrders: any;
  laundryOrders: any;
  cleaningOrders: any;
  carWashOrders: any;
}

const initVal: OrderI = {
  orders: null,
  laundryOrders: null,
  cleaningOrders: null,
  carWashOrders: null,
  pendingOrders: null,
  ironedOrders: null,
  washedOrders: null,
  damagedOrders: null,
  declinedOrders: null,
  deliveredOrders: null,
  packagedOrders: null,
};

const orderSlice = createSlice({
  initialState: initVal,
  name: 'order',
  reducers: {
    setOrders(state, action: PayloadAction<any>) {
      state.orders = action.payload;
    },
    setLaundryOrders(state, action: PayloadAction<any>) {
      state.laundryOrders = action.payload;
    },
    setCleaningOrders(state, action: PayloadAction<any>) {
      state.cleaningOrders = action.payload;
    },
    setCarWashOrders(state, action: PayloadAction<any>) {
      state.carWashOrders = action.payload;
    },
    setPendingOrders(state, action: PayloadAction<any>) {
      state.pendingOrders = action.payload;
    },
    setWashedOrders(state, action: PayloadAction<any>) {
      state.washedOrders = action.payload;
    },
    setIronedOrders(state, action: PayloadAction<any>) {
      state.ironedOrders = action.payload;
    },
    setDeclinedOrders(state, action: PayloadAction<any>) {
      state.declinedOrders = action.payload;
    },
    setDamagedOrders(state, action: PayloadAction<any>) {
      state.damagedOrders = action.payload;
    },
    setDeliveredOrders(state, action: PayloadAction<any>) {
      state.deliveredOrders = action.payload;
    },
    setPackagedOrders(state, action: PayloadAction<any>) {
      state.packagedOrders = action.payload;
    },
  },
});

export const {
  setOrders,
  setCarWashOrders,
  setCleaningOrders,
  setLaundryOrders,
  setPendingOrders,
  setDamagedOrders,
  setDeclinedOrders,
  setDeliveredOrders,
  setIronedOrders,
  setPackagedOrders,
  setWashedOrders,
} = orderSlice.actions;

export default orderSlice.reducer;
