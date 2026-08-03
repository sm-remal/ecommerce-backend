export type StoredAuthUser = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  type: string;
  status: string;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
};

const AUTH_USER_KEY = "perfect-gifts-station-auth-user";
export const AUTH_CHANGE_EVENT = "perfect-gifts-station-auth-change";

const isBrowser = () => typeof window !== "undefined";

export const getStoredAuthUser = (): StoredAuthUser | null => {
  try {
    if (!isBrowser()) {
      return null;
    }

    const rawValue = window.localStorage.getItem(AUTH_USER_KEY);
    if (!rawValue) {
      return null;
    }

    return JSON.parse(rawValue) as StoredAuthUser;
  } catch (error) {
    return null;
  }
};

export const setStoredAuthUser = (user: StoredAuthUser) => {
  try {
    if (!isBrowser()) {
      return;
    }

    window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  } catch (error) {
    // Ignore storage failures so auth does not break if storage is unavailable.
  }
};

export const clearStoredAuthUser = () => {
  try {
    if (!isBrowser()) {
      return;
    }

    window.localStorage.removeItem(AUTH_USER_KEY);
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  } catch (error) {
    // Ignore storage failures so logout still completes.
  }
};
