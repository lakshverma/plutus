import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  query: '',
  results: '',
};

/*
1. set current value of the input field to current state
2. On change, dispatch the input field value to the state
3. On change, also make an api request to the backend with the current value of input field
4. If the API response is empty or with an error, increase the size of dialog and say
that no results were found
5. If API response has the search results, display them
*/

const searchSlice = createSlice({
  name: 'search',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setQuery: (state, action) => {
      (state.query = action.payload);
    },
    setResults: (state, action) => {
      (state.results = action.payload);
    },
    clearResults: (state) => {
      (state.results = initialState.results);
    },
    // Revisit this once the scope of search expands, to see if this reducer/action is still needed.
    // eslint-disable-next-line no-unused-vars
    resetSearch: (state) => initialState,
  },
});

export const {
  setQuery, setResults, clearResults, resetSearch,
} = searchSlice.actions;

export default searchSlice.reducer;
