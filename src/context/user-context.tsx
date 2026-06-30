"use client";

import type { User } from "@supabase/supabase-js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { createClient } from "@/lib/supabase/client";
import { fetchWalletBalance } from "@/lib/actions/wallet";
import { USE_MOCK_DATA } from "@/lib/mock-data";
import {
  getMockWalletBalance,
  setMockWalletBalance,
} from "@/lib/mock-wallet-storage";
import {
  buildUserProfile,
  createDefaultProfile,
  loadSavedProfile,
  notifyProfileChanged,
  persistSavedProfile,
  PROFILE_CHANGED_EVENT,
  type SavedProfile,
  type UserProfile,
} from "@/lib/profile-storage";
import { notifyWalletChanged, WALLET_CHANGED_EVENT } from "@/lib/types/wallet";
import { getWalletUserEmail } from "@/lib/user";

type UserContextValue = {
  authUser: User | null;
  profile: UserProfile | null;
  balance: number | null;
  loading: boolean;
  saveProfile: (profile: SavedProfile) => void;
  reloadProfile: () => void;
  updateBalance: (balance: number) => void;
  reloadBalance: () => Promise<void>;
};

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [savedProfile, setSavedProfile] = useState<SavedProfile | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const reloadBalance = useCallback(async () => {
    if (!authUser) {
      setBalance(null);
      return;
    }

    const userEmail = getWalletUserEmail(authUser);
    if (!userEmail) {
      setBalance(null);
      return;
    }

    if (USE_MOCK_DATA) {
      const storedBalance = getMockWalletBalance(userEmail);
      if (storedBalance !== null) {
        setBalance(storedBalance);
        return;
      }
    }

    const result = await fetchWalletBalance();
    if (result.balance !== undefined) {
      setBalance(result.balance);
      if (USE_MOCK_DATA) {
        setMockWalletBalance(userEmail, result.balance);
      }
    }
  }, [authUser]);

  const updateBalance = useCallback(
    (nextBalance: number) => {
      if (!authUser) return;

      const userEmail = getWalletUserEmail(authUser);
      setBalance(nextBalance);

      if (USE_MOCK_DATA && userEmail) {
        setMockWalletBalance(userEmail, nextBalance);
      } else {
        notifyWalletChanged();
      }
    },
    [authUser]
  );

  const applyProfileForUser = useCallback((user: User | null) => {
    if (!user) {
      setSavedProfile(null);
      return;
    }

    const stored = loadSavedProfile(user.id);
    setSavedProfile(stored ?? createDefaultProfile(user));
  }, []);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(({ data: { session } }) => {
      const nextUser = session?.user ?? null;
      setAuthUser(nextUser);
      applyProfileForUser(nextUser);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user ?? null;
      setAuthUser(nextUser);
      applyProfileForUser(nextUser);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [applyProfileForUser]);

  useEffect(() => {
    function handleWalletChanged() {
      void reloadBalance();
    }

    window.addEventListener(WALLET_CHANGED_EVENT, handleWalletChanged);
    return () =>
      window.removeEventListener(WALLET_CHANGED_EVENT, handleWalletChanged);
  }, [reloadBalance]);

  useEffect(() => {
    void reloadBalance();
  }, [reloadBalance]);

  useEffect(() => {
    function handleProfileChanged() {
      if (authUser) {
        applyProfileForUser(authUser);
      }
    }

    function handleStorage(event: StorageEvent) {
      if (!authUser) return;
      if (event.key?.startsWith("getbuff-profile-")) {
        applyProfileForUser(authUser);
      }
    }

    window.addEventListener(PROFILE_CHANGED_EVENT, handleProfileChanged);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(PROFILE_CHANGED_EVENT, handleProfileChanged);
      window.removeEventListener("storage", handleStorage);
    };
  }, [authUser, applyProfileForUser]);

  const saveProfile = useCallback(
    (profile: SavedProfile) => {
      if (!authUser) return;

      persistSavedProfile(authUser.id, profile);
      setSavedProfile(profile);
      notifyProfileChanged();
    },
    [authUser]
  );

  const reloadProfile = useCallback(() => {
    applyProfileForUser(authUser);
  }, [applyProfileForUser, authUser]);

  const profile = useMemo(() => {
    if (!authUser || !savedProfile) return null;
    return buildUserProfile(authUser, savedProfile);
  }, [authUser, savedProfile]);

  const value = useMemo(
    () => ({
      authUser,
      profile,
      balance,
      loading,
      saveProfile,
      reloadProfile,
      updateBalance,
      reloadBalance,
    }),
    [
      authUser,
      profile,
      balance,
      loading,
      saveProfile,
      reloadProfile,
      updateBalance,
      reloadBalance,
    ]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
}
