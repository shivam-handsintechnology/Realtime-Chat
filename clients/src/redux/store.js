import { configureStore } from "@reduxjs/toolkit";
import changeStateReducer from "./reducers/changeStateReducer";


export const store = configureStore({
    reducer: {
        changeState: changeStateReducer,
    },
});
