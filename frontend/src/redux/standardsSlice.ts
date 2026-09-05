import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import type { Standard } from "@/types/standard";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface StandardsState {
  standards: Standard[];
  categories: string[];
  selectedCategory: string;
  searchQuery: string;

  loading: boolean;
  error: string | null;

  // Categories-specific loading/error state
  categoriesLoading: boolean;
  categoriesLoaded: boolean;
  categoriesError: string | null;

  // Old Standards-specific state
  oldStandards: Standard[];
  oldStandardsLoading: boolean;
  oldStandardsLoaded: boolean;
  oldStandardsError: string | null;
}

const initialState: StandardsState = {
  standards: [],
  categories: [],
  selectedCategory: "All",
  searchQuery: "",

  loading: false,
  error: null,

  categoriesLoading: false,
  categoriesLoaded: false,
  categoriesError: null,

  oldStandards: [],
  oldStandardsLoading: false,
  oldStandardsLoaded: false,
  oldStandardsError: null,
};

// ======================================================
// FETCH CATEGORIES
// ======================================================

export const fetchCategories = createAsyncThunk<
  string[],
  void,
  {
    state: {
      standards: StandardsState;
    };
  }
>(
  "standards/fetchCategories",
  async () => {
    const response = await fetch(
      `${API_URL}/query/categories`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    return (await response.json()) as string[];
  },
  {
    /*
     * Prevent duplicate category API calls.
     *
     * Don't make another request if:
     * 1. Categories are currently being fetched
     * 2. Categories have already been successfully loaded
     */
    condition: (_, { getState }) => {
      const state = getState();

      if (state.standards.categoriesLoading) {
        return false;
      }

      if (state.standards.categoriesLoaded) {
        return false;
      }

      return true;
    },
  }
);

// ======================================================
// FETCH STANDARDS
// ======================================================

export const fetchStandards = createAsyncThunk<
  Standard[],
  void
>(
  "standards/fetchStandards",
  async () => {
    const response = await fetch(
      `${API_URL}/query/standards`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch standards");
    }

    return (await response.json()) as Standard[];
  }
);

// ======================================================
// FETCH OLD STANDARDS
// ======================================================

export const fetchOldStandards = createAsyncThunk<
  Standard[],
  void,
  {
    state: {
      standards: StandardsState;
    };
  }
>(
  "standards/fetchOldStandards",
  async () => {
    const response = await fetch(
      `${API_URL}/query/old-standards`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch old standards");
    }

    return (await response.json()) as Standard[];
  },
  {
    /*
     * Prevent duplicate old-standards API calls.
     *
     * Don't make another request if:
     * 1. Old standards are currently being fetched
     * 2. Old standards have already been successfully loaded
     */
    condition: (_, { getState }) => {
      const state = getState();

      if (state.standards.oldStandardsLoading) {
        return false;
      }

      if (state.standards.oldStandardsLoaded) {
        return false;
      }

      return true;
    },
  }
);

// ======================================================
// SLICE
// ======================================================

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

      // ==========================================
      // CATEGORIES
      // ==========================================

      // Categories - Loading
      .addCase(fetchCategories.pending, (state) => {
        state.categoriesLoading = true;
        state.categoriesError = null;
      })

      // Categories - Success
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.categoriesLoaded = true;
        state.categoriesError = null;

        state.categories = action.payload;
      })

      // Categories - Error
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.categoriesLoaded = false;

        state.categoriesError =
          action.error.message ||
          "Failed to fetch categories";
      })

      // ==========================================
      // STANDARDS
      // ==========================================

      // Standards - Loading
      .addCase(fetchStandards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // Standards - Success
      .addCase(fetchStandards.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.standards = action.payload;
      })

      // Standards - Error
      .addCase(fetchStandards.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.error.message ||
          "Failed to fetch standards";
      })

      // ==========================================
      // OLD STANDARDS
      // ==========================================

      // Old Standards - Loading
      .addCase(fetchOldStandards.pending, (state) => {
        state.oldStandardsLoading = true;
        state.oldStandardsError = null;
      })

      // Old Standards - Success
      .addCase(fetchOldStandards.fulfilled, (state, action) => {
        state.oldStandardsLoading = false;
        state.oldStandardsLoaded = true;
        state.oldStandardsError = null;

        state.oldStandards = action.payload;
      })

      // Old Standards - Error
      .addCase(fetchOldStandards.rejected, (state, action) => {
        state.oldStandardsLoading = false;
        state.oldStandardsLoaded = false;

        state.oldStandardsError =
          action.error.message ||
          "Failed to fetch old standards";
      });
  },
});

export const {
  setSelectedCategory,
  setSearchQuery,
} = standardsSlice.actions;

export default standardsSlice.reducer;