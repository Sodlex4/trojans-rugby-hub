const JOIN_REQUESTS_KEY = "trojans_join_requests";
const SETTINGS_KEY = "trojans_settings";

interface JoinRequest {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED";
  createdAt: string;
}

interface Settings {
  siteTitle: string;
  siteTagline: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  socialFacebook: string;
  socialTwitter: string;
  socialInstagram: string;
  socialYouTube: string;
  clubFounded: string;
  clubStadium: string;
  joinAutoAccept: boolean;
  notifyEmail: string;
}

const defaultSettings: Settings = {
  siteTitle: "Trojans Murang'a RFC",
  siteTagline: "Champions of Central Kenya Rugby",
  siteDescription: "Trojans Murang'a Rugby Football Club - The pride of Central Kenya. Join our championship-winning team.",
  contactEmail: "info@trojans.co.ke",
  contactPhone: "+254 700 000 000",
  contactAddress: "Murang'a, Kenya",
  socialFacebook: "https://facebook.com/trojansrugby",
  socialTwitter: "https://twitter.com/trojansrugby",
  socialInstagram: "https://instagram.com/trojansrugby",
  socialYouTube: "https://youtube.com/trojansrugby",
  clubFounded: "2015",
  clubStadium: "Murang'a Sports Complex",
  joinAutoAccept: false,
  notifyEmail: "",
};

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

export const getSettings = (): Settings => {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      return { ...defaultSettings, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.error("Failed to parse settings");
  }
  return defaultSettings;
};

export const saveSettings = (settings: Settings): void => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

export const updateSettings = (updates: Partial<Settings>): Settings => {
  const current = getSettings();
  const updated = { ...current, ...updates };
  saveSettings(updated);
  return updated;
};