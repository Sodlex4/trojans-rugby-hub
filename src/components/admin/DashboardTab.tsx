import { motion } from "framer-motion";
import { Users, Newspaper, Activity, UserPlus, Trophy, CalendarDays, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { getMatches, getPlayerStats, getAllJoinRequests, type Match, type PlayerStat, type JoinRequest } from "@/lib/auth";
import type { TeamMember } from "@/data/team";
import type { NewsItem } from "@/data/news";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardTabProps {
  teamMembers: TeamMember[];
  newsItems: NewsItem[];
  joinRequests: JoinRequest[];
  setActiveTab: (tab: string) => void;
  setJoinRequests: (requests: JoinRequest[]) => void;
  setPendingCount: (count: number) => void;
}

const COLORS = ["#22c55e", "#ef4444", "#f59e0b", "#3b82f6", "#8b5cf6"];

const StatCard = ({ icon: Icon, label, value, color, bgColor }: any) => (
  <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
    <div className="flex items-center gap-3 mb-2">
      <div className={`p-2 ${bgColor} rounded-lg`}>
        <Icon className={color} size={20} />
      </div>
      <span className="text-muted-foreground text-sm">{label}</span>
    </div>
    <p className="text-3xl font-bold text-foreground">{value}</p>
  </div>
);

const DashboardTab = ({ teamMembers, newsItems, joinRequests, setActiveTab, setJoinRequests, setPendingCount }: DashboardTabProps) => {
  const navigate = useNavigate();

  const { data: matches = [], isLoading: matchesLoading } = useQuery({
    queryKey: ["matches"],
    queryFn: getMatches,
  });

  const { data: playerStats = [], isLoading: statsLoading } = useQuery({
    queryKey: ["playerStats"],
    queryFn: getPlayerStats,
  });

  const { data: fetchedRequests = [], isLoading: requestsLoading } = useQuery({
    queryKey: ["joinRequests"],
    queryFn: getAllJoinRequests,
  });

  const stats = {
    totalPlayers: teamMembers.length,
    totalNews: newsItems.length,
    forwards: teamMembers.filter(p => p.category === "Forwards").length,
    backs: teamMembers.filter(p => p.category === "Backs").length,
    staff: teamMembers.filter(p => p.category === "Staff").length,
    pendingRequests: (fetchedRequests.length ? fetchedRequests : joinRequests).filter((r: JoinRequest) => r.status === "PENDING").length,
  };

  const completedMatches = matches.filter((m: Match) => m.status === "completed");
  const upcomingMatches = matches.filter((m: Match) => m.status === "scheduled").slice(0, 3);
  const wins = completedMatches.filter((m: Match) => m.result === "W").length;
  const losses = completedMatches.filter((m: Match) => m.result === "L").length;
  const draws = completedMatches.filter((m: Match) => m.result === "D").length;

  const matchResults = [
    { name: "Wins", value: wins, color: "#22c55e" },
    { name: "Losses", value: losses, color: "#ef4444" },
    { name: "Draws", value: draws, color: "#f59e0b" },
  ].filter(d => d.value > 0);

  const topScorers = [...playerStats].sort((a: PlayerStat, b: PlayerStat) => b.points - a.points).slice(0, 5);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h2 className="text-2xl font-bold text-foreground mb-6">Overview</h2>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <StatCard icon={Users} label="Total Players" value={stats.totalPlayers} color="text-primary" bgColor="bg-primary/10" />
        <StatCard icon={Newspaper} label="News Items" value={stats.totalNews} color="text-accent" bgColor="bg-accent/10" />
        <StatCard icon={Activity} label="Forwards" value={stats.forwards} color="text-trojan-green-dark" bgColor="bg-trojan-green/10" />
        <StatCard icon={TrendingUp} label="Backs" value={stats.backs} color="text-trojan-gold-dark" bgColor="bg-trojan-gold/10" />
        <StatCard icon={UserPlus} label="Pending Requests" value={stats.pendingRequests} color="text-trojan-red" bgColor="bg-trojan-red/10" />
      </div>

      {(matchesLoading || statsLoading) && (
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      )}

      {!matchesLoading && !statsLoading && (
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Top Scorers Chart */}
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Trophy size={18} className="text-trojan-gold" />
              Top Scorers
            </h3>
            {topScorers.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={topScorers} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={90} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      color: "hsl(var(--foreground))",
                    }}
                  />
                  <Bar dataKey="points" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-center py-12">No stats data yet</p>
            )}
          </div>

          {/* Match Results Pie Chart */}
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <CalendarDays size={18} className="text-primary" />
              Match Results ({completedMatches.length} played)
            </h3>
            {matchResults.length > 0 ? (
              <div className="flex items-center justify-center h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={matchResults} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                      {matchResults.map((entry, index) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-12">No completed matches yet</p>
            )}
          </div>
        </div>
      )}

      {/* Upcoming Matches */}
      {upcomingMatches.length > 0 && (
        <div className="bg-card rounded-xl p-6 border border-border shadow-sm mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <CalendarDays size={18} className="text-primary" />
            Upcoming Matches
          </h3>
          <div className="divide-y divide-border">
            {upcomingMatches.map((match: Match) => (
              <div key={match.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{match.opponent}</p>
                  <p className="text-sm text-muted-foreground">{match.date} {match.time && `at ${match.time}`} — {match.venue}</p>
                </div>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">{match.competition}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setActiveTab("players")}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg font-semibold hover:bg-trojan-green-dark transition-colors"
          >
            <Users size={18} />
            Manage Players
          </button>
          <button
            onClick={() => setActiveTab("matches")}
            className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2.5 rounded-lg font-semibold hover:bg-trojan-red-dark transition-colors"
          >
            <Activity size={18} />
            Manage Matches
          </button>
          {stats.pendingRequests > 0 && (
            <button
              onClick={() => setActiveTab("joinRequests")}
              className="flex items-center gap-2 bg-trojan-red text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-trojan-red-dark transition-colors"
            >
              <UserPlus size={18} />
              Review Requests ({stats.pendingRequests})
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardTab;
