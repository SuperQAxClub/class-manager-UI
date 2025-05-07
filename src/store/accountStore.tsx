import {create} from "zustand";
import { ProfileType } from "../api/auth";

type AccountStore = {
  profile: ProfileType | null;
  setProfile: (value: ProfileType | null) => void;
};

export const useAccountStore = create<AccountStore>((set) => ({
  profile: null,
  setProfile: (value: ProfileType | null) =>
    set(() => {
      return {
        profile: value,
      };
    }),
}));