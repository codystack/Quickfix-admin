import { configureStore } from "@reduxjs/toolkit"

import authReducer from "./reducers/auth"
import userReducer from "./reducers/users"
import loaderReducer from "./reducers/loader"
import bannerReducer from "./reducers/banners"
import productReducer from "./reducers/products"
import bookingReducer from "./reducers/bookings"

const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        loader: loaderReducer,
        banner: bannerReducer,
        booking: bookingReducer,
        product: productReducer,
    }
});
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>

export default store;