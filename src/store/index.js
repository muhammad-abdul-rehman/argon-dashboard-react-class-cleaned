import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";
import rcpUrlReducer from "../features/rcp/rcpSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    rcp_url: rcpUrlReducer,
  },
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
});

export default store;
