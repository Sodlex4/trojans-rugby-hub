const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

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
    if (stored) return JSON.parse(stored);
  } catch { }
  return { isAuthenticated: false, token: null, username: null, role: null };
};

export const setStoredAuth = (auth: AuthState): void => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
};

export const clearStoredAuth = (): void => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  const json = await response.json();

  if (json && typeof json === "object" && "success" in json && "data" in json) {
    return json.data;
  }
  return json;
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
  } catch {
    try {
      const storedCreds = localStorage.getItem("trojans_admin_creds");
      if (storedCreds) {
        const creds = JSON.parse(storedCreds);
        if (creds.username === username && creds.password === password) {
          const auth: AuthState = { isAuthenticated: true, token: null, username, role: "ADMIN" };
          setStoredAuth(auth);
          return { success: true };
        }
      }
    } catch { }
    return { success: false, error: "Invalid credentials" };
  }
};

export const logout = (): void => {
  clearStoredAuth();
  window.location.href = "/";
};

export const isAuthenticated = (): boolean => {
  const auth = getStoredAuth();
  return auth.isAuthenticated;
};

export const getToken = (): string | null => {
  return getStoredAuth().token;
};

export const isAdmin = (): boolean => {
  return getStoredAuth().role === "ADMIN";
};

const withFallback = async <T>(fn: () => Promise<T>, fallback: T): Promise<T> => {
  try {
    return await fn();
  } catch {
    return fallback;
  }
};

// ===== SETTINGS =====
export const getSettings = async (): Promise<Settings> => {
  try {
    const settingsArray: { settingKey: string; settingValue: string }[] = await apiRequest("/settings");
    const settingsMap: Partial<Settings> = {};
    settingsArray.forEach((s) => {
      (settingsMap as any)[s.settingKey] = s.settingValue;
    });
    return { ...defaultSettings, ...settingsMap };
  } catch {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) return { ...defaultSettings, ...JSON.parse(stored) };
    } catch { }
    return defaultSettings;
  }
};

export const saveSettings = async (settings: Settings): Promise<void> => {
  try {
    const entries: Record<string, string> = {};
    for (const [key, value] of Object.entries(settings)) {
      entries[key] = String(value);
    }
    await apiRequest("/settings/batch", {
      method: "POST",
      body: JSON.stringify(entries),
    });
  } catch {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }
};

export const getSiteLogo = async (): Promise<string> => {
  try {
    const settings = await getSettings();
    return settings.siteLogo || "/logo.jpg";
  } catch {
    return "/logo.jpg";
  }
};

// ===== PLAYERS =====
export const getPlayers = async (): Promise<any[]> => {
  return withFallback(() => apiRequest("/players"), []);
};

// ===== MATCHES =====
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
    localStorage.setItem(MATCHES_KEY, JSON.stringify(data));
    return data;
  } catch {
    try {
      const stored = localStorage.getItem(MATCHES_KEY);
      if (stored) return JSON.parse(stored);
    } catch { }
    try {
      const { matches } = await import("@/data/matches");
      return matches || [];
    } catch { }
    return [];
  }
};

export const saveMatch = async (match: Omit<Match, "id">): Promise<Match> => {
  const result = await apiRequest("/matches", {
    method: "POST",
    body: JSON.stringify(match),
  });
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
  const cached = localStorage.getItem(MATCHES_KEY);
  if (cached) {
    const matches = JSON.parse(cached).filter((m: any) => m.id !== id);
    localStorage.setItem(MATCHES_KEY, JSON.stringify(matches));
  }
};

// ===== LEAGUE TABLE =====
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
  } catch {
    try {
      const stored = localStorage.getItem("trojans_league_table");
      if (stored) return JSON.parse(stored);
    } catch { }
    return [];
  }
};

// ===== JOIN REQUESTS =====
export const submitJoinRequest = async (data: {
  name: string; email: string; phone: string; message: string;
}): Promise<{ success: boolean; error?: string }> => {
  try {
    await apiRequest("/join-requests", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return { success: true };
  } catch {
    const requests = getStoredJoinRequests();
    requests.push({
      id: Date.now(),
      ...data,
      status: "PENDING" as const,
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem(JOIN_REQUESTS_KEY, JSON.stringify(requests));
    return { success: true };
  }
};

const getStoredJoinRequests = (): JoinRequest[] => {
  try {
    const stored = localStorage.getItem(JOIN_REQUESTS_KEY);
    if (stored) return JSON.parse(stored);
  } catch { }
  return [];
};

export const getAllJoinRequests = async (): Promise<JoinRequest[]> => {
  try {
    return await apiRequest("/join-requests");
  } catch {
    return getStoredJoinRequests();
  }
};

export const acceptJoinRequest = async (id: number): Promise<void> => {
  try {
    await apiRequest(`/join-requests/${id}/accept`, { method: "PUT" });
  } catch {
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
  } catch {
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
    return await apiRequest("/player-stats");
  } catch {
    try {
      const stored = localStorage.getItem(STATS_KEY);
      if (stored) return JSON.parse(stored);
    } catch { }
    try {
      const { playerStats } = await import("@/data/stats");
      return playerStats || [];
    } catch { }
    return [];
  }
};

export const savePlayerStat = async (stat: Omit<PlayerStat, "id">): Promise<PlayerStat> => {
  const result = await apiRequest("/player-stats", {
    method: "POST",
    body: JSON.stringify(stat),
  });
  const cached = localStorage.getItem(STATS_KEY);
  const stats = cached ? JSON.parse(cached) : [];
  stats.push(result);
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  return result;
};

export const updatePlayerStat = async (id: number, updates: Partial<PlayerStat>): Promise<PlayerStat> => {
  const result = await apiRequest(`/player-stats/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
  const cached = localStorage.getItem(STATS_KEY);
  if (cached) {
    const stats = JSON.parse(cached);
    const idx = stats.findIndex((s: any) => s.id === id);
    if (idx !== -1) {
      stats[idx] = { ...stats[idx], ...result };
      localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    }
  }
  return result;
};

export const deletePlayerStat = async (id: number): Promise<void> => {
  await apiRequest(`/player-stats/${id}`, { method: "DELETE" });
  const cached = localStorage.getItem(STATS_KEY);
  if (cached) {
    const stats = JSON.parse(cached).filter((s: any) => s.id !== id);
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  }
};
