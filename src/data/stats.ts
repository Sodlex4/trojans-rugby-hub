export interface PlayerStats {
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

export const playerStats: PlayerStats[] = [
  {
    id: 1,
    name: "Andre Obure",
    position: "Prop",
    appearances: 12,
    tries: 3,
    conversions: 0,
    penalties: 0,
    dropGoals: 0,
    points: 15,
    tackles: 145,
    turnovers: 12,
    manOfMatch: 2,
    yellowCards: 1,
    redCards: 0,
  },
  {
    id: 2,
    name: "Steve Odongo",
    position: "Hooker",
    appearances: 12,
    tries: 4,
    conversions: 0,
    penalties: 0,
    dropGoals: 0,
    points: 20,
    tackles: 132,
    turnovers: 18,
    manOfMatch: 3,
    yellowCards: 0,
    redCards: 0,
  },
  {
    id: 7,
    name: "Simon Koigi",
    position: "Flanker",
    appearances: 11,
    tries: 5,
    conversions: 0,
    penalties: 0,
    dropGoals: 0,
    points: 25,
    tackles: 156,
    turnovers: 22,
    manOfMatch: 4,
    yellowCards: 1,
    redCards: 0,
  },
  {
    id: 9,
    name: "James Waithaka",
    position: "Scrum-Half",
    appearances: 12,
    tries: 6,
    conversions: 0,
    penalties: 0,
    dropGoals: 0,
    points: 30,
    tackles: 89,
    turnovers: 45,
    manOfMatch: 5,
    yellowCards: 0,
    redCards: 0,
  },
  {
    id: 10,
    name: "Sam Nyanga",
    position: "Fly-Half",
    appearances: 12,
    tries: 4,
    conversions: 28,
    penalties: 15,
    dropGoals: 3,
    points: 127,
    tackles: 76,
    turnovers: 12,
    manOfMatch: 6,
    yellowCards: 0,
    redCards: 0,
  },
  {
    id: 12,
    name: "Cornelius Kiptum",
    position: "Centre",
    appearances: 11,
    tries: 7,
    conversions: 0,
    penalties: 0,
    dropGoals: 0,
    points: 35,
    tackles: 95,
    turnovers: 8,
    manOfMatch: 3,
    yellowCards: 0,
    redCards: 0,
  },
  {
    id: 14,
    name: "Brian Ireri",
    position: "Wing",
    appearances: 10,
    tries: 8,
    conversions: 0,
    penalties: 0,
    dropGoals: 0,
    points: 40,
    tackles: 45,
    turnovers: 6,
    manOfMatch: 4,
    yellowCards: 0,
    redCards: 0,
  },
  {
    id: 15,
    name: "Brian Selete",
    position: "Full-Back",
    appearances: 12,
    tries: 5,
    conversions: 0,
    penalties: 0,
    dropGoals: 0,
    points: 25,
    tackles: 68,
    turnovers: 15,
    manOfMatch: 3,
    yellowCards: 1,
    redCards: 0,
  },
];

export const leagueTable = [
  { position: 1, team: "Kisumu RFC", played: 10, won: 9, drawn: 0, lost: 1, points: 45 },
  { position: 2, team: "Trojans RFC", played: 10, won: 8, drawn: 1, lost: 1, points: 41 },
  { position: 3, team: "Nairobi Harlequins", played: 10, won: 7, drawn: 1, lost: 2, points: 36 },
  { position: 4, team: "Mombasa RFC", played: 10, won: 6, drawn: 0, lost: 4, points: 28 },
  { position: 5, team: "Nakuru RFC", played: 10, won: 5, drawn: 1, lost: 4, points: 26 },
  { position: 6, team: "Western Suburbs", played: 10, won: 4, drawn: 0, lost: 6, points: 18 },
  { position: 7, team: "Kenyatta University", played: 10, won: 2, drawn: 1, lost: 7, points: 11 },
  { position: 8, team: "Strathmore", played: 10, won: 0, drawn: 0, lost: 10, points: 2 },
];

export const getTopScorers = () => 
  [...playerStats].sort((a, b) => b.points - a.points).slice(0, 5);

export const getTopTackers = () => 
  [...playerStats].sort((a, b) => b.tackles - a.tackles).slice(0, 5);

export const getTopTryScorers = () => 
  [...playerStats].sort((a, b) => b.tries - a.tries).slice(0, 5);