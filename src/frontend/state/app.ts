import { Only, User } from "@/backend/model";
import { omit } from "radash";
import { create } from "zustand";
import storage from "../storage";

const store = storage.item<AppState>("app_state", {
  user: null,
  wallet: null,
  idToken: null,
  allWallets: [],
  hydrated: false,
  expiresAt: null,
});

export type AppState = {
  user: Only<User> | null;
  wallet: string | null;
  idToken: string | null;
  allWallets: string[];
  expiresAt: number | null;
  hydrated: boolean;
};

export type AppActions = {
  login: (user: Only<User>, idToken: string, wallets: string[]) => void;
  logout: () => void;
  hydrate: () => void;
};

export const useAppState = create<AppState & AppActions>((set, get) => ({
  user: null,
  wallet: null,
  idToken: null,
  allWallets: [],
  expiresAt: null,
  hydrated: false,
  login: (user, idToken, wallets) => {
    set({ user, idToken, allWallets: wallets, wallet: wallets[0] });
  },
  logout: () => {
    localStorage.clear();
    sessionStorage.clear();
    set({
      user: null,
      expiresAt: null,
    });
  },
  hydrate: () => set({ ...store.get(), hydrated: true }),
}));

useAppState.subscribe((state) => {
  store.set(omit(state, ["login", "logout", "hydrate"]));
});
