import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PERMISSIONS, USERINFO, RESET_TOKEN, TOKEN } from "@/utils/constants";
import { AuthState, UserInfo } from "@/types/auth";

const initialState: AuthState = {
  token: (() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem(TOKEN) ?? "";
      if (token) {
        return token;
      }
    }
    return "";
  })(),

  resetToken: (() => {
    if (typeof window !== "undefined") {
      const resetToken = localStorage.getItem(RESET_TOKEN) ?? "";
      if (resetToken) {
        return resetToken;
      }
    }
    return "";
  })(),

  permissions: (() => {
    if (typeof window !== "undefined") {
      const storedPermissions = localStorage.getItem(PERMISSIONS);
      const permissions = storedPermissions ? JSON.parse(storedPermissions) : [];
      if (permissions) {
        return permissions;
      }
    }
    return [];
  })(),

  userInfo: (() => {
    if (typeof window !== "undefined") {
      const storedUserInfo = localStorage.getItem(USERINFO);
      if (storedUserInfo) {
        return JSON.parse(storedUserInfo);
      }
    }
    return null;
  })(),
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setResetToken: (state, action: PayloadAction<string>) => {
      state.resetToken = action.payload;
      localStorage.setItem(RESET_TOKEN, action.payload);
    },
    
    setPermissions: (state, action: PayloadAction<{ permissions: string[] }>) => {
      state.permissions = action.payload.permissions;
      localStorage.setItem(PERMISSIONS, JSON.stringify(action.payload.permissions));
    },
    
    setSession: (state, action: PayloadAction<{
      token: string;
      userInfo: UserInfo;
      permissions?: string[];
    }>) => {
      state.token = action.payload.token;
      state.userInfo = action.payload.userInfo;
      state.permissions = action.payload.permissions || [];

      localStorage.setItem(TOKEN, action.payload.token);
      localStorage.setItem(USERINFO, JSON.stringify(action.payload.userInfo));
      localStorage.setItem(PERMISSIONS, JSON.stringify(action.payload.permissions || []));
    },
    
    removeSession: (state) => {
      localStorage.removeItem(USERINFO);
      localStorage.removeItem(PERMISSIONS);
      localStorage.removeItem(RESET_TOKEN);
      localStorage.removeItem(TOKEN);
      localStorage.removeItem("theme");
      
      state.userInfo = null;
      state.token = "";
      state.permissions = [];
      state.resetToken = "";
    },
  },
});

export const {
  setResetToken,
  setSession,
  removeSession,
  setPermissions,
} = authSlice.actions;

export default authSlice.reducer;
