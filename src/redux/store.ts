import { configureStore } from "@reduxjs/toolkit"

import authReducer from "./reducers/auth"
import userReducer from "./reducers/users"
import orderReducer from "./reducers/orders"
import loaderReducer from "./reducers/loader"
import bannerReducer from "./reducers/banners"
import serviceReducer from "./reducers/services"
import transactionReducer from "./reducers/transactions"

const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        loader: loaderReducer,
        banner: bannerReducer,
        order: orderReducer,
        service: serviceReducer,
        transaction: transactionReducer,
    }
});
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>

export default store;