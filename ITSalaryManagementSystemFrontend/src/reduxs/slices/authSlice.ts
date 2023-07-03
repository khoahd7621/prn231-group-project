import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export interface AuthState {
  isAuthenticated: boolean;
  accessToken: string;
}

const initialState: AuthState = {
  isAuthenticated: false,
  accessToken: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = true;
      state.accessToken = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.accessToken = "";
    },
  },
});

// Action creators are generated for each case reducer function
export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
