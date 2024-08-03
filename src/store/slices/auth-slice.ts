import { StateCreator } from 'zustand';

type UserInfo = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileSetup: string;
  image?: string;
  color?: number;
} | null;

export type AuthSlice = {
  userInfo: UserInfo;
  setUserInfo: (data: UserInfo | null) => void;
};

export const createAuthSlice: StateCreator<AuthSlice, [], [], AuthSlice> = (set) => ({
  userInfo: null,
  setUserInfo: (userInfo) => set({ userInfo })
});
