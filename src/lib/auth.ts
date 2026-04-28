const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

interface LoginResponse {
  token: string;
  username: string;
  role: string;
}

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  username: string | null;
  role: string | null;
}

const AUTH_STORAGE_KEY = "trojans_auth";

export const getStoredAuth = (): AuthState => {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to parse auth from storage");
  }
  return { isAuthenticated: false, token: null, username: null, role: null };
};

export const setStoredAuth = (auth: AuthState): void => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
};

export const clearStoredAuth = (): void => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

export const login = async (username: string, password: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (data.success && data.data?.token) {
      const auth: AuthState = {
        isAuthenticated: true,
        token: data.data.token,
        username: data.data.username,
        role: data.data.role,
      };
      setStoredAuth(auth);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Login error:", error);
    return false;
  }
};

export const logout = (): void => {
  clearStoredAuth();
  window.location.href = "/";
};

export const isAuthenticated = (): boolean => {
  const auth = getStoredAuth();
  return auth.isAuthenticated && auth.token !== null;
};

export const getToken = (): string | null => {
  const auth = getStoredAuth();
  return auth.token;
};

export const getAuthHeaders = (): HeadersInit => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const isAdmin = (): boolean => {
  const auth = getStoredAuth();
  return auth.role === "ADMIN";
};