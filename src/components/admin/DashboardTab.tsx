import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Newspaper, Activity, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getMatches, getAllJoinRequests } from "@/lib/auth";

interface DashboardTabProps {
  teamMembers: any[];
  newsItems: any[];
  joinRequests: any[];
  setActiveTab: (tab: string) => void;
  setJoinRequests: (requests: any[]) => void;
  setPendingCount: (count: number) => void;
}

const DashboardTab = ({ teamMembers, newsItems, joinRequests, setActiveTab, setJoinRequests, setPendingCount }: DashboardTabProps) => {
  const [matches, setMatches] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMatches();
    fetchJoinRequests();
  }, []);

  const fetchMatches = async () => {
    try {
      const data = await getMatches();
      setMatches(data);
    } catch (error) {
      console.error("Failed to fetch matches");
    }
  };

  const fetchJoinRequests = async () => {
    try {
      const requests = await getAllJoinRequests();
      setJoinRequests(requests);
      setPendingCount(requests.filter((r: any) => r.status === "PENDING").length);
    } catch (error) {
      console.error("Failed to fetch join requests");
    }
  };

  const stats = {
    totalPlayers: teamMembers.length,
    totalNews: newsItems.length,
    forwards: teamMembers.filter(p => p.category === "Forwards").length,
    backs: teamMembers.filter(p => p.category === "Backs").length,
    staff: teamMembers.filter(p => p.category === "Staff").length,
    pendingRequests: joinRequests.filter((r: any) => r.status === "PENDING").length,
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h2 className="text-2xl font-bold text-foreground mb-6">Overview</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="text-primary" size={20} />
            </div>
            <span className="text-muted-foreground text-sm">Total Players</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{stats.totalPlayers}</p>
        </div>
        
        <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Newspaper className="text-accent" size={20} />
            </div>
            <span className="text-muted-foreground text-sm">News Items</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{stats.totalNews}</p>
        </div>
        
        <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-trojan-green/10 rounded-lg">
              <Activity className="text-trojan-green-dark" size={20} />
            </div>
            <span className="text-muted-foreground text-sm">Forwards</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{stats.forwards}</p>
        </div>
        
        <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-trojan-gold/10 rounded-lg">
              <UserPlus className="text-trojan-gold-dark" size={20} />
            </div>
            <span className="text-muted-foreground text-sm">Backs</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{stats.backs}</p>
        </div>

        <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-trojan-red/10 rounded-lg">
              <UserPlus className="text-trojan-red" size={20} />
            </div>
            <span className="text-muted-foreground text-sm">Pending Requests</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{stats.pendingRequests}</p>
        </div>
      </div>

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
