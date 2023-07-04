import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { Role } from "../../constants/enum";
import AuthApis from "../../modules/authentication/apis/AuthApis";
import { User } from "../../modules/authentication/models";
import { logout } from "./authSlice";

// First, create the thunk
export const fetchUserProfile = createAsyncThunk("profiles/fetchUserProfile", async (_, thunkApi) => {
  try {
    return await AuthApis.getProfile();
  } catch (error) {
    thunkApi.dispatch(removeProfile());
    thunkApi.dispatch(logout());
    return Promise.reject(error);
  }
});

export interface ProfileState {
  loading: boolean;
  user: User;
}

const initialState: ProfileState = {
  loading: true,
  user: {
    id: 0,
    employeeName: "",
    employeeCode: "",
    email: "",
    role: Role.Employee,
    isFirstLogin: true,
  },
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfileLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    fetchProfile: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    updateFirstLogin: (state) => {
      state.user.isFirstLogin = false;
    },
    removeProfile: (state) => {
      state.user = {
        ...initialState.user,
      };
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder
      .addCase(fetchUserProfile.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state) => {
        state.loading = true;
        state.user = {
          ...initialState.user,
        };
      });
  },
});

// Action creators are generated for each case reducer function
export const { setProfileLoading, fetchProfile, removeProfile, updateFirstLogin } = profileSlice.actions;

export default profileSlice.reducer;
