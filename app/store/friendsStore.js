import { create } from "zustand";

export const useFriendsStore = create((set) => ({
  isFriendsOpen: false,
  openFriends: () => set({ isFriendsOpen: true }),
  closeFriends: () => set({ isFriendsOpen: false }),
}));
