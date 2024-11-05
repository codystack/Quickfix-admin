import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

interface BannerI {
  banners: any;
}

const initVal: BannerI = {
  banners: null,
};

const bannerSlice = createSlice({
  initialState: initVal,
  name: 'banner',
  reducers: {
    setBanners(state, action: PayloadAction<any>) {
      state.banners = action.payload;
    },
  },
});

export const { setBanners } = bannerSlice.actions


export default bannerSlice.reducer;