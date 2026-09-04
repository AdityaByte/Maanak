import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Standard } from "@/types/standard";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface StandardsState {
  standards: Standard[];
  categories: string[];
  selectedCategory: string;
  searchQuery: string;
  loading: boolean;
  error: string | null;
}

const initialState: StandardsState = {
  standards: [],
  categories: [],
  selectedCategory: "All",
  searchQuery: "",
  loading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk(
  "standards/fetchCategories",
  async () => {
    const response = await fetch(`${API_URL}/query/categories`);

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    return (await response.json()) as string[];
  }
);

export const fetchStandards = createAsyncThunk(
  "standards/fetchStandards",
  async () => {
    const response = await fetch(`${API_URL}/query/standards`);

    if (!response.ok) {
      throw new Error("Failed to fetch standards");
    }

    return (await response.json()) as Standard[];
  }
);

const standardsSlice = createSlice({
  name: "standards",

  initialState,

  reducers: {
    setSelectedCategory: (
      state,
      action: PayloadAction<string>
    ) => {
      state.selectedCategory = action.payload;
    },
    setSearchQuery: (
      state,
      action: PayloadAction<string>
    ) => {
      state.searchQuery = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder

      // Categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })

      // Standards - loading
      .addCase(fetchStandards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // Standards - success
      .addCase(fetchStandards.fulfilled, (state, action) => {
        state.loading = false;
        state.standards = action.payload;
      })

      // Standards - error
      .addCase(fetchStandards.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch standards";
      });
  },
});
export const { setSelectedCategory , setSearchQuery } =
  standardsSlice.actions;

export default standardsSlice.reducer;