import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

interface BookingI {
  bookings: any;
}

const initVal: BookingI = {
  bookings: null,
};

const bookingSlice = createSlice({
  initialState: initVal,
  name: 'booking',
  reducers: {
    setBookings(state, action: PayloadAction<any>) {
      state.bookings = action.payload;
    },
  },
});

export const { setBookings } = bookingSlice.actions


export default bookingSlice.reducer;