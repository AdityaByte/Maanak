import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Standard } from "@/types/standard";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") || "http://localhost:8080/api";

interface StandardsState {
  standards: Standard[];
  oldStandards: Standard[];
  categories: string[];
  selectedCategory: string;
  searchQuery: string;
  loadingCategories: boolean;
  loadingOldStandards: boolean;
  loadingStandards: boolean;
  errorCategories: string | null;
  errorOldStandards: string | null;
  errorStandards: string | null;
}

const initialState: StandardsState = {
  standards: [],
  oldStandards: [],
  categories: [],
  selectedCategory: "All",
  searchQuery: "",
  loadingCategories: false,
  loadingOldStandards: false,
  loadingStandards: false,
  errorCategories: null,
  errorOldStandards: null,
  errorStandards: null,
};

// 1. Fetch Categories: GET /api/query/categories
export const fetchCategories = createAsyncThunk<
  string[],
  void,
  { state: { standards: StandardsState } }
>(
  "standards/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/query/categories`);
      if (!response.ok) {
        throw new Error(`Categories fetch failed: ${response.status}`);
      }
      const data = await response.json();
      return Array.isArray(data) ? data : data.categories || [];
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to fetch categories");
    }
  },
  {
    condition: (_, { getState }) => {
      const { standards } = getState();
      if (standards.categories && standards.categories.length > 0) {
        return false;
      }
      return true;
    },
  }
);

// 2. Fetch Old Standards: GET /api/query/old-standards
export const fetchOldStandards = createAsyncThunk<
  Standard[],
  void,
  { state: { standards: StandardsState } }
>(
  "standards/fetchOldStandards",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/query/old-standards`);
      if (!response.ok) {
        throw new Error(`Old standards fetch failed: ${response.status}`);
      }
      return (await response.json()) as Standard[];
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to fetch old standards");
    }
  },
  {
    condition: (_, { getState }) => {
      const { standards } = getState();
      if (standards.oldStandards && standards.oldStandards.length > 0) {
        return false;
      }
      return true;
    },
  }
);

// 3. Fetch Standard Standards: GET /api/query/standards
export const fetchStandards = createAsyncThunk<
  Standard[],
  void,
  { state: { standards: StandardsState } }
>(
  "standards/fetchStandards",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/query/standards`);
      if (!response.ok) {
        throw new Error(`Standards fetch failed: ${response.status}`);
      }
      return (await response.json()) as Standard[];
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to fetch standards");
    }
  },
  {
    condition: (_, { getState }) => {
      const { standards } = getState();
      if (standards.standards && standards.standards.length > 0) {
        return false;
      }
      return true;
    },
  }
);

const standardsSlice = createSlice({
  name: "standards",
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Categories
      .addCase(fetchCategories.pending, (state) => {
        state.loadingCategories = true;
        state.errorCategories = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loadingCategories = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loadingCategories = false;
        state.errorCategories =
          (action.payload as string) || action.error.message || "Failed to load categories";
      })

      // Old Standards
      .addCase(fetchOldStandards.pending, (state) => {
        state.loadingOldStandards = true;
        state.errorOldStandards = null;
      })
      .addCase(fetchOldStandards.fulfilled, (state, action) => {
        state.loadingOldStandards = false;
        state.oldStandards = action.payload;
      })
      .addCase(fetchOldStandards.rejected, (state, action) => {
        state.loadingOldStandards = false;
        state.errorOldStandards =
          (action.payload as string) || action.error.message || "Failed to load old standards";
      })

      // Standards
      .addCase(fetchStandards.pending, (state) => {
        state.loadingStandards = true;
        state.errorStandards = null;
      })
      .addCase(fetchStandards.fulfilled, (state, action) => {
        state.loadingStandards = false;
        state.standards = action.payload;
      })
      .addCase(fetchStandards.rejected, (state, action) => {
        state.loadingStandards = false;
        state.errorStandards =
          (action.payload as string) || action.error.message || "Failed to load standards";
      });
  },
});

export const { setSelectedCategory, setSearchQuery } = standardsSlice.actions;
export default standardsSlice.reducer;