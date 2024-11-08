import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

interface BannerI {
  banners: any;
  socials: any;
}

const initVal: BannerI = {
  banners: null,
  socials: null,
};

const bannerSlice = createSlice({
  initialState: initVal,
  name: 'banner',
  reducers: {
    setBanners(state, action: PayloadAction<any>) {
      state.banners = action.payload;
    },
    setSocials(state, action: PayloadAction<any>) {
      state.socials = action.payload;
    },
  },
});

export const { setBanners, setSocials } = bannerSlice.actions


export default bannerSlice.reducer;