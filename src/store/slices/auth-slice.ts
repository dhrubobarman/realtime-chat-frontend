import { StateCreator } from 'zustand';

type UserInfo =
  | {
      id: string;
      email: string;
      firstName?: string;
      lastName?: string;
      profileSetup: string;
      image?: string;
      color?: string;
    }
  | undefined;

export type AuthSlice = {
  userInfo: UserInfo;
  setUserInfo: (data: UserInfo) => void;
};

export const createAuthSlice: StateCreator<AuthSlice, [], [], AuthSlice> = (set) => ({
  userInfo: undefined,
  setUserInfo: (userInfo) => set({ userInfo })
});
