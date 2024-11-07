import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

interface BookingI {
  bookings: any;
  sessionBookings: any;
  fastTrackBookings: any;
  workingClassBookings: any;
}

const initVal: BookingI = {
  bookings: null,
  sessionBookings: null,
  fastTrackBookings: null,
  workingClassBookings: null,
};

const bookingSlice = createSlice({
  initialState: initVal,
  name: 'booking',
  reducers: {
    setBookings(state, action: PayloadAction<any>) {
      state.bookings = action.payload;
    },
    setFastTrackBookings(state, action: PayloadAction<any>) {
      state.fastTrackBookings = action.payload;
    },
    setWorkingClassBooking(state, action: PayloadAction<any>) {
      state.workingClassBookings = action.payload;
    },
    setSessionBooking(state, action: PayloadAction<any>) {
      state.sessionBookings = action.payload;
    },
  },
});

export const { setBookings, setFastTrackBookings, setWorkingClassBooking, setSessionBooking } = bookingSlice.actions


export default bookingSlice.reducer;