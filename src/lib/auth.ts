const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

// Initialize default admin credentials if not present
if (!localStorage.getItem("trojans_admin_creds")) {
  localStorage.setItem("trojans_admin_creds", JSON.stringify({
    username: "admin",
    password: "trojans2026"
  }));
}

const JOIN_REQUESTS_KEY = "trojans_join_requests";
const SETTINGS_KEY = "trojans_settings";
const MATCHES_KEY = "trojans_matches";
const STATS_KEY = "trojans_stats";

export interface JoinRequest {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED";
  createdAt: string;
}

export interface Settings {
  siteTitle: string;
  siteTagline: string;
  siteDescription: string;
  siteLogo: string;
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
  siteDescription: "Building champions, fostering community, celebrating excellence in Kenyan rugby.",
  siteLogo: "",
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

// API helper
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }
  
  return response.json();
};

export const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    const auth: AuthState = {
      isAuthenticated: true,
      token: data.token,
      username: data.username || username,
      role: data.role || "ADMIN",
    };
    setStoredAuth(auth);
    return { success: true };
  } catch (error) {
    // Fallback: Check localStorage for admin credentials
    try {
      const storedCreds = localStorage.getItem("trojans_admin_creds");
      if (storedCreds) {
        const creds = JSON.parse(storedCreds);
        if (creds.username === username && creds.password === password) {
          const auth: AuthState = {
            isAuthenticated: true,
            token: null,
            username: username,
            role: "ADMIN",
          };
          setStoredAuth(auth);
          return { success: true };
        }
      }
    } catch (e) {}
    return { success: false, error: error instanceof Error ? error.message : "Login failed" };
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

// ===== SETTINGS =====
export const getSettings = async (): Promise<Settings> => {
  try {
    const settingsArray = await apiRequest("/settings");
    const settingsMap: Partial<Settings> = {};
    settingsArray.forEach((s: any) => {
      (settingsMap as any)[s.settingKey] = s.settingValue;
    });
    return { ...defaultSettings, ...settingsMap };
  } catch (e) {
    // Fallback to localStorage
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) return { ...defaultSettings, ...JSON.parse(stored) };
    } catch (e) { }
    return defaultSettings;
  }
};

export const saveSettings = async (settings: Settings): Promise<void> => {
  try {
    // Save each setting to backend
    for (const [key, value] of Object.entries(settings)) {
      await apiRequest("/settings", {
        method: "POST",
        body: JSON.stringify({ settingKey: key, settingValue: String(value) }),
      });
    }
  } catch (e) {
    // Fallback to localStorage
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }
};

export const updateSettings = async (updates: Partial<Settings>): Promise<Settings> => {
  const current = await getSettings();
  const updated = { ...current, ...updates };
  await saveSettings(updated);
  return updated;
};

export const getSiteLogo = async (): Promise<string> => {
  try {
    const settings = await getSettings();
    return settings.siteLogo || "/logo.jpg";
  } catch (e) {
    // Fallback to localStorage
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        const s = JSON.parse(stored);
        return s.siteLogo || "/logo.jpg";
      }
    } catch (e) {}
    return "/logo.jpg";
  }
};

// ===== PLAYERS (from backend) =====
export const getPlayers = async (): Promise<any[]> => {
  try {
    return await apiRequest("/players");
  } catch (e) {
    console.error("Failed to fetch players from API");
    return [];
  }
};

// ===== MATCHES (from backend) =====
export interface Match {
  id: number;
  date: string;
  time: string;
  opponent: string;
  opponentLogo: string;
  venue: string;
  competition: string;
  result?: string;
  trojansScore?: number;
  opponentScore?: number;
  isHome: boolean;
  status: "scheduled" | "completed" | "live";
  playerIds?: string;
}

export const getMatches = async (): Promise<Match[]> => {
  try {
    const data = await apiRequest("/matches");
    // Save to localStorage as cache
    localStorage.setItem(MATCHES_KEY, JSON.stringify(data));
    return data;
  } catch (e) {
    console.error("Failed to fetch matches from API, using fallback");
    // Fallback to localStorage
    try {
      const stored = localStorage.getItem(MATCHES_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) { }
    // Fallback to static data
    try {
      const { matches } = await import("@/data/matches");
      return matches || [];
    } catch (e) { }
    return [];
  }
};

export const saveMatch = async (match: Omit<Match, "id">): Promise<Match> => {
  const result = await apiRequest("/matches", {
    method: "POST",
    body: JSON.stringify(match),
  });
  // Update localStorage cache
  const cached = localStorage.getItem(MATCHES_KEY);
  const matches = cached ? JSON.parse(cached) : [];
  matches.push(result);
  localStorage.setItem(MATCHES_KEY, JSON.stringify(matches));
  return result;
};

export const updateMatch = async (id: number, updates: Partial<Match>): Promise<Match> => {
  const result = await apiRequest(`/matches/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
  // Update localStorage cache
  const cached = localStorage.getItem(MATCHES_KEY);
  if (cached) {
    const matches = JSON.parse(cached);
    const index = matches.findIndex((m: any) => m.id === id);
    if (index !== -1) {
      matches[index] = { ...matches[index], ...result };
      localStorage.setItem(MATCHES_KEY, JSON.stringify(matches));
    }
  }
  return result;
};

export const deleteMatch = async (id: number): Promise<void> => {
  await apiRequest(`/matches/${id}`, { method: "DELETE" });
  // Update localStorage cache
  const cached = localStorage.getItem(MATCHES_KEY);
  if (cached) {
    const matches = JSON.parse(cached).filter((m: any) => m.id !== id);
    localStorage.setItem(MATCHES_KEY, JSON.stringify(matches));
  }
};

// ===== LEAGUE TABLE (from backend) =====
export interface LeagueTeam {
  position: number;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  pointsFor: number;
  pointsAgainst: number;
  pointsDifference: number;
  bonusPoints: number;
  totalPoints: number;
}

export const getLeagueTable = async (): Promise<LeagueTeam[]> => {
  try {
    return await apiRequest("/league-table");
  } catch (e) {
    // Fallback to localStorage
    try {
      const stored = localStorage.getItem("trojans_league_table");
      if (stored) return JSON.parse(stored);
    } catch (e) { }
    return [];
  }
};

export const saveLeagueTable = async (table: LeagueTeam[]): Promise<void> => {
  localStorage.setItem("trojans_league_table", JSON.stringify(table));
  try {
    await apiRequest("/league-table", {
      method: "POST",
      body: JSON.stringify(table),
    });
  } catch (e) { }
};

// ===== JOIN REQUESTS =====
export const submitJoinRequest = async (data: {
  name: string;
  email: string;
  phone: string;
  message: string;
}): Promise<{ success: boolean; error?: string }> => {
  try {
    await apiRequest("/join-requests", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return { success: true };
  } catch (error) {
    // Fallback to localStorage
    const requests = getStoredJoinRequests();
    const newRequest = {
      id: Date.now(),
      ...data,
      status: "PENDING" as const,
      createdAt: new Date().toISOString(),
    };
    requests.push(newRequest);
    localStorage.setItem(JOIN_REQUESTS_KEY, JSON.stringify(requests));
    return { success: true };
  }
};

const getStoredJoinRequests = (): JoinRequest[] => {
  try {
    const stored = localStorage.getItem(JOIN_REQUESTS_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) { }
  return [];
};

export const getAllJoinRequests = async (): Promise<JoinRequest[]> => {
  try {
    return await apiRequest("/join-requests");
  } catch (e) {
    return getStoredJoinRequests();
  }
};

export const acceptJoinRequest = async (id: number): Promise<void> => {
  try {
    await apiRequest(`/join-requests/${id}/accept`, { method: "PUT" });
  } catch (e) {
    // Fallback
    const requests = getStoredJoinRequests();
    const idx = requests.findIndex(r => r.id === id);
    if (idx !== -1) {
      requests[idx].status = "ACCEPTED";
      localStorage.setItem(JOIN_REQUESTS_KEY, JSON.stringify(requests));
    }
  }
};

export const declineJoinRequest = async (id: number): Promise<void> => {
  try {
    await apiRequest(`/join-requests/${id}/decline`, { method: "PUT" });
  } catch (e) {
    // Fallback
    const requests = getStoredJoinRequests();
    const idx = requests.findIndex(r => r.id === id);
    if (idx !== -1) {
      requests[idx].status = "DECLINED";
      localStorage.setItem(JOIN_REQUESTS_KEY, JSON.stringify(requests));
    }
  }
};

// ===== PLAYER STATS =====
export interface PlayerStat {
  id: number;
  name: string;
  position: string;
  appearances: number;
  tries: number;
  conversions: number;
  penalties: number;
  dropGoals: number;
  points: number;
  tackles: number;
  turnovers: number;
  manOfMatch: number;
  yellowCards: number;
  redCards: number;
}

export const getPlayerStats = async (): Promise<PlayerStat[]> => {
  try {
    // This would need a backend endpoint - for now use localStorage
    const stored = localStorage.getItem(STATS_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) { }
  return [];
};

export const savePlayerStats = async (stats: PlayerStat[]): Promise<void> => {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
};

export const updatePlayerStat = async (id: number, updates: Partial<PlayerStat>): Promise<void> => {
  const stats = await getPlayerStats();
  const idx = stats.findIndex(s => s.id === id);
  if (idx !== -1) {
    stats[idx] = { ...stats[idx], ...updates };
    await savePlayerStats(stats);
  }
};

export const addPlayerStat = async (stat: Omit<PlayerStat, "id">): Promise<void> => {
  const stats = await getPlayerStats();
  const newStat = { ...stat, id: Date.now() };
  stats.push(newStat);
  await savePlayerStats(stats);
};

export const deletePlayerStat = async (id: number): Promise<void> => {
  const stats = await getPlayerStats();
  const filtered = stats.filter(s => s.id !== id);
  await savePlayerStats(filtered);
};