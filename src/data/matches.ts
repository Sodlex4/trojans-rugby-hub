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
}

export const matches: Match[] = [
  {
    id: 1,
    date: "May 10, 2026",
    time: "3:00 PM",
    opponent: "Kisumu RFC",
    opponentLogo: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=100&q=80",
    venue: "Murang'a Sports Complex",
    competition: "Kenya Cup",
    status: "scheduled",
    isHome: true,
  },
  {
    id: 2,
    date: "May 17, 2026",
    time: "4:00 PM",
    opponent: "Nairobi Harlequins",
    opponentLogo: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=100&q=80",
    venue: "Nairobi Safari Park",
    competition: "Kenya Cup",
    status: "scheduled",
    isHome: false,
  },
  {
    id: 3,
    date: "May 24, 2026",
    time: "3:00 PM",
    opponent: "Mombasa RFC",
    opponentLogo: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=100&q=80",
    venue: "Murang'a Sports Complex",
    competition: "Kenya Cup",
    status: "scheduled",
    isHome: true,
  },
  {
    id: 4,
    date: "May 31, 2026",
    time: "2:30 PM",
    opponent: "Nakuru RFC",
    opponentLogo: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=100&q=80",
    venue: "Nakuru Athletics Club",
    competition: "Kenya Cup",
    status: "scheduled",
    isHome: false,
  },
  {
    id: 5,
    date: "April 12, 2026",
    time: "3:00 PM",
    opponent: "Kenyatta University",
    opponentLogo: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=100&q=80",
    venue: "Murang'a Sports Complex",
    competition: "Fifteen Cup",
    result: "W",
    trojansScore: 24,
    opponentScore: 12,
    status: "completed",
    isHome: true,
  },
  {
    id: 6,
    date: "April 5, 2026",
    time: "4:00 PM",
    opponent: "Strathmore",
    opponentLogo: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=100&q=80",
    venue: "Strathmore Ground",
    competition: "Fifteen Cup",
    result: "W",
    trojansScore: 18,
    opponentScore: 15,
    status: "completed",
    isHome: false,
  },
  {
    id: 7,
    date: "March 29, 2026",
    time: "3:00 PM",
    opponent: "Western Suburbs",
    opponentLogo: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=100&q=80",
    venue: "Murang'a Sports Complex",
    competition: "Fifteen Cup",
    result: "W",
    trojansScore: 32,
    opponentScore: 8,
    status: "completed",
    isHome: true,
  },
];

export const getUpcomingMatches = () => 
  matches.filter(m => m.status === "scheduled").sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

export const getPastResults = () => 
  matches.filter(m => m.status === "completed").sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());