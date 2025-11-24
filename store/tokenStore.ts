// store/tokenStore.ts
import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

interface TokenState {
  accessToken: string | null;
  refreshToken: string | null;
  setToken: (token: string) => void;
  setRefreshToken: (token: string) => void;
  clear: () => void;
}

// SecureStore wrapper
const save = (k: string, v: string) => SecureStore.setItemAsync(k, v);
const remove = (k: string) => SecureStore.deleteItemAsync(k);

export const useTokenStore = create<TokenState>((set) => ({
  accessToken: null,
  refreshToken: null,

  setToken: (token) => {
    save('ACCESS_TOKEN', token);
    set({ accessToken: token });
  },

  setRefreshToken: (token) => {
    save('REFRESH_TOKEN', token);
    set({ refreshToken: token });
  },

  clear: () => {
    remove('ACCESS_TOKEN');
    remove('REFRESH_TOKEN');
    set({ accessToken: null, refreshToken: null });
  },
}));
