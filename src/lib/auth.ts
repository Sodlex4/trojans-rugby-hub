const JOIN_REQUESTS_KEY = "trojans_join_requests";

interface JoinRequest {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED";
  createdAt: string;
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

const generateId = (): number => {
  return Date.now();
};

const getStoredJoinRequests = (): JoinRequest[] => {
  try {
    const stored = localStorage.getItem(JOIN_REQUESTS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to parse join requests");
  }
  return [];
};

const saveJoinRequests = (requests: JoinRequest[]): void => {
  localStorage.setItem(JOIN_REQUESTS_KEY, JSON.stringify(requests));
};

interface SubmitRequestData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface Result {
  success: boolean;
  error?: string;
}

export const submitJoinRequestLocal = async (data: SubmitRequestData): Promise<Result> => {
  const requests = getStoredJoinRequests();
  
  const newRequest: JoinRequest = {
    id: generateId(),
    name: data.name,
    email: data.email,
    phone: data.phone,
    message: data.message,
    status: "PENDING",
    createdAt: new Date().toISOString(),
  };
  
  requests.push(newRequest);
  saveJoinRequests(requests);
  
  return { success: true };
};

export const getAllJoinRequests = (): JoinRequest[] => {
  return getStoredJoinRequests();
};

export const acceptJoinRequest = (id: number): void => {
  const requests = getStoredJoinRequests();
  const idx = requests.findIndex(r => r.id === id);
  if (idx !== -1) {
    requests[idx].status = "ACCEPTED";
    saveJoinRequests(requests);
  }
};

export const declineJoinRequest = (id: number): void => {
  const requests = getStoredJoinRequests();
  const idx = requests.findIndex(r => r.id === id);
  if (idx !== -1) {
    requests[idx].status = "DECLINED";
    saveJoinRequests(requests);
  }
};

export const login = async (username: string, password: string): Promise<Result> => {
  if (username === "admin" && password === "admin123") {
    const auth: AuthState = {
      isAuthenticated: true,
      token: "local-token-" + Date.now(),
      username: username,
      role: "ADMIN",
    };
    setStoredAuth(auth);
    return { success: true };
  }
  return { success: false, error: "Invalid credentials" };
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