import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

interface AuthI {
  isAuth: boolean;
  profile: any;
  wallet: any
}

const initVal: AuthI = {
  isAuth: false,
  profile: null,
  wallet: null,
};
const authSlice = createSlice({
  initialState: initVal,
  name: 'auth',
  reducers: {
    setAuth(state, action: PayloadAction<boolean>) {
      state.isAuth = action.payload;
    },
    setProfile(state, action: PayloadAction<any>) {
      state.profile = action.payload;
    },
    setWallet(state, action: PayloadAction<any>) {
      state.wallet = action.payload;
    },
    logout(state, action: PayloadAction<any>) {
      localStorage.removeItem('accessToken');
      state.profile = null;
      state.profile = action.payload;;
    },
  },
});

export const { setAuth, setProfile, logout, setWallet } = authSlice.actions

export default authSlice.reducer;