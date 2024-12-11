import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "./apiService";


export const fetchBooks = createAsyncThunk("books/fetchBooks", async({pageNum, query}) => {
    let url = `/books?_page=${pageNum}&_limit=10`;
    if (query) url += `&q=${query}`;
    const response = await api.get(url);
    return response.data;
})

export const fetchBooksById = createAsyncThunk("books/fetchBooksById", async({id}) => {
    let url = `/books/${id}`;
    const response = await api.get(url);
    return response.data;
})

export const addToFavorites = createAsyncThunk("books/addToFavorites", async(book) => {
    let url = "/favorites";
    const response = await api.post(url, book);
    return response.data;
})

export const fetchFavorites = createAsyncThunk("books/fetchFavorites", async() => {
    let url = "/favorites";
    const response = await api.get(url);
    return response.data;
})

export const removeFavorite = createAsyncThunk("books/removeFavorite", async (bookId) => {
    await api.delete(`/favorites/${bookId}`);
    return bookId; // Return the ID of the removed book
});

//Slice
const booksSlice = createSlice({
    name: "books",
    initialState: {
        books: [], //all books
        bookDetail: null, //fetch book by ID
        favorites: [], //user's favorite books
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        //Fetch books
        .addCase(fetchBooks.pending, (state) => {
            state.loading = true;
            state.error=null;
        })
        .addCase(fetchBooks.fulfilled, (state, action) => {
            state.loading = false;
            state.books= action.payload;
        })
        .addCase(fetchBooks.rejected, (state, action) => {
            state.loading = true;
            state.error= action.error.message;
        })
        //Fetch book details
        .addCase(fetchBooksById.fulfilled, (state, action) => {
            state.bookDetail = action.payload;
          })
        //Add to favorites
        .addCase(addToFavorites.fulfilled, (state, action) => {
            state.favorites.push(action.payload);
          })
        //Fetch favorites
        .addCase(fetchFavorites.fulfilled, (state, action) => {
            state.loading=false;
            state.favorites=action.payload;
          })
        .addCase(fetchFavorites.pending, (state) => {
            state.loading=true;
            state.error = null;
          })
        .addCase(fetchFavorites.rejected, (state, action) => {
            state.loading=false;
            state.error = action.error.message;
          })
        //Remove favorite
        .addCase(removeFavorite.fulfilled, (state, action) => {
            state.favorites = state.favorites.filter((book) => book.id !== action.payload)
          })
    }
})

export default booksSlice.reducer;