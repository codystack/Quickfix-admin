import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

interface ProductI {
  products: any;
  interests: any;
}

const initVal: ProductI = {
  products: null,
  interests: null,
};

const productSlice = createSlice({
  initialState: initVal,
  name: 'product',
  reducers: {
    setProducts(state, action: PayloadAction<any>) {
      state.products = action.payload;
    },
    setInterests(state, action: PayloadAction<any>) {
      state.interests = action.payload;
    },
  },
});

export const { setProducts, setInterests } = productSlice.actions


export default productSlice.reducer;