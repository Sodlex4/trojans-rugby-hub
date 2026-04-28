const JOIN_REQUESTS_KEY = "trojans_join_requests";
const SETTINGS_KEY = "trojans_settings";
const MATCHES_KEY = "trojans_matches";
const STATS_KEY = "trojans_stats";

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

export const getSiteLogo = (): string => {
  const settings = getSettings();
  return settings.siteLogo || "/logo.jpg";
};

// ===== MATCHES FUNCTIONS =====
interface Match {
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
}

const defaultMatches: Match[] = [
  { id: 1, date: "May 10, 2026", time: "3:00 PM", opponent: "Kenya Prisons", opponentLogo: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=100&q=80", venue: "Murang'a Sports Complex", competition: "Central Kenya Rugby", status: "scheduled", isHome: true },
  { id: 2, date: "May 17, 2026", time: "4:00 PM", opponent: "Embu RFC", opponentLogo: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=100&q=80", venue: "Embu Stadium", competition: "Central Kenya Rugby", status: "scheduled", isHome: false },
  { id: 3, date: "May 24, 2026", time: "3:00 PM", opponent: "Chuka Vikings", opponentLogo: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=100&q=80", venue: "Murang'a Sports Complex", competition: "Central Kenya Rugby", status: "scheduled", isHome: true },
  { id: 4, date: "May 31, 2026", time: "2:30 PM", opponent: "Meru University", opponentLogo: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=100&q=80", venue: "Meru University Ground", competition: "Central Kenya Rugby", status: "scheduled", isHome: false },
  { id: 5, date: "April 12, 2026", time: "3:00 PM", opponent: "MKU Thika", opponentLogo: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=100&q=80", venue: "Murang'a Sports Complex", competition: "Central Kenya Rugby", result: "W", trojansScore: 24, opponentScore: 12, status: "completed", isHome: true },
  { id: 6, date: "April 5, 2026", time: "4:00 PM", opponent: "Meru RFC", opponentLogo: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=100&q=80", venue: "Meru Stadium", competition: "Central Kenya Rugby", result: "W", trojansScore: 18, opponentScore: 15, status: "completed", isHome: false },
  { id: 7, date: "March 29, 2026", time: "3:00 PM", opponent: "Tharaka University", opponentLogo: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=100&q=80", venue: "Murang'a Sports Complex", competition: "Central Kenya Rugby", result: "W", trojansScore: 32, opponentScore: 8, status: "completed", isHome: true },
];

export const getMatches = (): Match[] => {
  try {
    const stored = localStorage.getItem(MATCHES_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) { console.error("Failed to parse matches"); }
  return defaultMatches;
};

export const saveMatches = (matches: Match[]): void => {
  localStorage.setItem(MATCHES_KEY, JSON.stringify(matches));
};

export const addMatch = (match: Omit<Match, "id">): void => {
  const matches = getMatches();
  const newMatch = { ...match, id: Date.now() };
  matches.push(newMatch);
  saveMatches(matches);
};

export const updateMatch = (id: number, updates: Partial<Match>): void => {
  const matches = getMatches();
  const idx = matches.findIndex(m => m.id === id);
  if (idx !== -1) {
    matches[idx] = { ...matches[idx], ...updates };
    saveMatches(matches);
  }
};

export const deleteMatch = (id: number): void => {
  const matches = getMatches().filter(m => m.id !== id);
  saveMatches(matches);
};

// ===== PLAYER STATS FUNCTIONS =====
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

const defaultStats: PlayerStat[] = [
  { id: 1, name: "Andre Obure", position: "Prop", appearances: 12, tries: 3, conversions: 0, penalties: 0, dropGoals: 0, points: 15, tackles: 145, turnovers: 12, manOfMatch: 2, yellowCards: 1, redCards: 0 },
  { id: 2, name: "Steve Odongo", position: "Hooker", appearances: 12, tries: 4, conversions: 0, penalties: 0, dropGoals: 0, points: 20, tackles: 132, turnovers: 18, manOfMatch: 3, yellowCards: 0, redCards: 0 },
  { id: 7, name: "Simon Koigi", position: "Flanker", appearances: 11, tries: 5, conversions: 0, penalties: 0, dropGoals: 0, points: 25, tackles: 156, turnovers: 22, manOfMatch: 4, yellowCards: 1, redCards: 0 },
  { id: 9, name: "James Waithaka", position: "Scrum-Half", appearances: 12, tries: 6, conversions: 0, penalties: 0, dropGoals: 0, points: 30, tackles: 89, turnovers: 45, manOfMatch: 5, yellowCards: 0, redCards: 0 },
  { id: 10, name: "Sam Nyanga", position: "Fly-Half", appearances: 12, tries: 4, conversions: 28, penalties: 15, dropGoals: 3, points: 127, tackles: 76, turnovers: 12, manOfMatch: 6, yellowCards: 0, redCards: 0 },
  { id: 12, name: "Cornelius Kiptum", position: "Centre", appearances: 11, tries: 7, conversions: 0, penalties: 0, dropGoals: 0, points: 35, tackles: 95, turnovers: 8, manOfMatch: 3, yellowCards: 0, redCards: 0 },
  { id: 14, name: "Brian Ireri", position: "Wing", appearances: 10, tries: 8, conversions: 0, penalties: 0, dropGoals: 0, points: 40, tackles: 45, turnovers: 6, manOfMatch: 4, yellowCards: 0, redCards: 0 },
  { id: 15, name: "Brian Selete", position: "Full-Back", appearances: 12, tries: 5, conversions: 0, penalties: 0, dropGoals: 0, points: 25, tackles: 68, turnovers: 15, manOfMatch: 3, yellowCards: 1, redCards: 0 },
];

export const getPlayerStats = (): PlayerStat[] => {
  try {
    const stored = localStorage.getItem(STATS_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) { console.error("Failed to parse stats"); }
  return defaultStats;
};

export const savePlayerStats = (stats: PlayerStat[]): void => {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
};

export const updatePlayerStat = (id: number, updates: Partial<PlayerStat>): void => {
  const stats = getPlayerStats();
  const idx = stats.findIndex(s => s.id === id);
  if (idx !== -1) {
    stats[idx] = { ...stats[idx], ...updates };
    savePlayerStats(stats);
  }
};

export const addPlayerStat = (stat: Omit<PlayerStat, "id">): void => {
  const stats = getPlayerStats();
  const newStat = { ...stat, id: Date.now() };
  stats.push(newStat);
  savePlayerStats(stats);
};

export const deletePlayerStat = (id: number): void => {
  const stats = getPlayerStats().filter(s => s.id !== id);
  savePlayerStats(stats);
};