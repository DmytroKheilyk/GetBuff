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

type UserContextValue = {
  authUser: User | null;
  profile: UserProfile | null;
  loading: boolean;
  saveProfile: (profile: SavedProfile) => void;
  reloadProfile: () => void;
};

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [savedProfile, setSavedProfile] = useState<SavedProfile | null>(null);
  const [loading, setLoading] = useState(true);

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
      loading,
      saveProfile,
      reloadProfile,
    }),
    [authUser, profile, loading, saveProfile, reloadProfile]
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
