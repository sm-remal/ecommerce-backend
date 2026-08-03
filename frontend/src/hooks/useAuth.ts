"use client";

import { useEffect, useState } from "react";
import {
  AUTH_CHANGE_EVENT,
  clearStoredAuthUser,
  getStoredAuthUser,
  type StoredAuthUser,
} from "@/lib/auth-storage";
import { getCurrentUser } from "@/services/auth.service";

export const useAuth = () => {
  const [user, setUser] = useState<StoredAuthUser | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);

    const syncAuthUser = async () => {
      const storedUser = getStoredAuthUser();

      if (storedUser) {
        setUser(storedUser);
      }

      try {
        const response = await getCurrentUser();
        if (response.data?.user) {
          setUser(response.data.user);
        } else if (!storedUser) {
          setUser(null);
        }
      } catch (error) {
        if (storedUser) {
          setUser(storedUser);
          return;
        }

        clearStoredAuthUser();
        setUser(null);
      }
    };

    const syncStoredAuthUser = () => {
      setUser(getStoredAuthUser());
    };

    syncAuthUser();

    window.addEventListener("storage", syncStoredAuthUser);
    window.addEventListener(AUTH_CHANGE_EVENT, syncStoredAuthUser);

    return () => {
      window.removeEventListener("storage", syncStoredAuthUser);
      window.removeEventListener(AUTH_CHANGE_EVENT, syncStoredAuthUser);
    };
  }, []);

  const logoutLocalUser = () => {
    clearStoredAuthUser();
    setUser(null);
  };

  return {
    user,
    isAuthenticated: Boolean(user),
    isLoading: !isHydrated,
    logoutLocalUser,
  };
};

export default useAuth;
