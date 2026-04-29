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
  { position: 1, team: "Kenya Prisons", played: 12, won: 12, drawn: 0, lost: 0, pointsFor: 510, pointsAgainst: 29, pointsDifference: 481, bonusPoints: 11, totalPoints: 59 },
  { position: 2, team: "Embu RFC", played: 12, won: 9, drawn: 1, lost: 2, pointsFor: 327, pointsAgainst: 149, pointsDifference: 178, bonusPoints: 6, totalPoints: 44 },
  { position: 3, team: "Chuka Vikings", played: 11, won: 8, drawn: 1, lost: 2, pointsFor: 296, pointsAgainst: 89, pointsDifference: 207, bonusPoints: 7, totalPoints: 41 },
  { position: 4, team: "Meru University", played: 12, won: 9, drawn: 0, lost: 3, pointsFor: 268, pointsAgainst: 97, pointsDifference: 171, bonusPoints: 3, totalPoints: 39 },
  { position: 5, team: "MKU Thika", played: 12, won: 7, drawn: 0, lost: 5, pointsFor: 250, pointsAgainst: 147, pointsDifference: 103, bonusPoints: 7, totalPoints: 35 },
  { position: 6, team: "Meru RFC", played: 12, won: 8, drawn: 0, lost: 4, pointsFor: 203, pointsAgainst: 156, pointsDifference: 47, bonusPoints: 2, totalPoints: 34 },
  { position: 7, team: "Tharaka University", played: 11, won: 5, drawn: 0, lost: 6, pointsFor: 169, pointsAgainst: 168, pointsDifference: 1, bonusPoints: 2, totalPoints: 22 },
  { position: 8, team: "Olive Rugby", played: 12, won: 5, drawn: 0, lost: 7, pointsFor: 272, pointsAgainst: 259, pointsDifference: 13, bonusPoints: -4, totalPoints: 16 },
  { position: 9, team: "Kirinyaga RFC", played: 12, won: 3, drawn: 0, lost: 9, pointsFor: 104, pointsAgainst: 316, pointsDifference: -212, bonusPoints: 1, totalPoints: 13 },
  { position: 10, team: "Dedan Kimathi Uni.", played: 11, won: 0, lost: 11, pointsFor: 35, pointsAgainst: 598, pointsDifference: -563, bonusPoints: -11, totalPoints: -7 },
  { position: 11, team: "Karatina University", played: 12, won: 2, lost: 10, pointsFor: 133, pointsAgainst: 299, pointsDifference: -166, bonusPoints: -7, totalPoints: 1 },
  { position: 12, team: "Murang'a Trojans", played: 12, won: 2, lost: 10, pointsFor: 101, pointsAgainst: 225, pointsDifference: -124, bonusPoints: -4, totalPoints: 4 },
  { position: 13, team: "Kiambu Rugby", played: 12, won: 2, lost: 10, pointsFor: 90, pointsAgainst: 242, pointsDifference: -152, bonusPoints: -4, totalPoints: 4 },
];

export const getTopScorers = () => 
  [...playerStats].sort((a, b) => b.points - a.points).slice(0, 5);

export const getTopTackers = () => 
  [...playerStats].sort((a, b) => b.tackles - a.tackles).slice(0, 5);

export const getTopTryScorers = () => 
  [...playerStats].sort((a, b) => b.tries - a.tries).slice(0, 5);