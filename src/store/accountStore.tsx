import {create} from "zustand";

export type ProfileType = {
  name: string,
  gender: string,
  avatar: string
}

type AccountStore = {
  profile: ProfileType | null;
  setProfile: (value: ProfileType | null) => void;
};

const useGroupBookingStore = create<AccountStore>((set) => ({
  profile: null,
  setProfile: (value: ProfileType | null) =>
    set(() => {
      return {
        profile: value,
      };
    }),
}));

export default useGroupBookingStore;