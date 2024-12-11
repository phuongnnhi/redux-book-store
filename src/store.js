import { configureStore } from "@reduxjs/toolkit";
import booksReducer from "../src/booksSlice"


const store = configureStore({
    reducer: {
        books: booksReducer,
    }
})

export default store;