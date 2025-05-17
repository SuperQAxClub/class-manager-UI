import {create} from "zustand";
import { ProfileType } from "../api/auth";

type AccountStore = {
  profile: ProfileType | null;
  setProfile: (value: ProfileType | null) => void;
  adminProfile: string | null;
  setAdminProfile: (value: string | null) => void;
};

export const useAccountStore = create<AccountStore>((set) => ({
  profile: null,
  setProfile: (value: ProfileType | null) =>
    set(() => {
      return {
        profile: value,
      };
    }
  ),
  adminProfile: null,
  setAdminProfile: (value: string | null) =>
    set(() => {
      return {
        adminProfile: value,
      };
    }
  ),
}));