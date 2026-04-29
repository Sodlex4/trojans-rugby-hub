import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, ArrowLeft, LayoutDashboard, Users, CalendarDays, Trophy, Newspaper, UserPlus, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { teamMembers as initialTeamMembers, type TeamMember } from "@/data/team";
import { newsItems as initialNewsItems, type NewsItem } from "@/data/news";
import { 
  login, logout, isAuthenticated, isAdmin,
  getAllJoinRequests,
  getSettings, getSiteLogo,
} from "@/lib/auth";
import LoginForm from "@/components/admin/LoginForm";
import DashboardTab from "@/components/admin/DashboardTab";
import PlayersTab from "@/components/admin/PlayersTab";
import MatchesTab from "@/components/admin/MatchesTab";
import StatsTab from "@/components/admin/StatsTab";
import NewsTab from "@/components/admin/NewsTab";
import JoinRequestsTab from "@/components/admin/JoinRequestsTab";
import SettingsTab from "@/components/admin/SettingsTab";

const AdminPage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  const [isAdminUser, setIsAdminUser] = useState(isAdmin());
  const [activeTab, setActiveTab] = useState("dashboard");
  
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [newsItems, setNewsItems] = useState<NewsItem[]>(initialNewsItems);
  const [joinRequests, setJoinRequests] = useState<any[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [lastRequestCount, setLastRequestCount] = useState(0);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const [loginLogo, setLoginLogo] = useState("/logo.jpg");

  useEffect(() => {
    const fetchLogo = async () => {
      const logo = await getSiteLogo();
      setLoginLogo(logo);
    };
    fetchLogo();
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setIsAdminUser(true);
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setIsAdminUser(false);
  };

  const handleMarkNotificationSeen = () => {
    setHasNewNotification(false);
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

  const handleSavePlayer = (player: Partial<TeamMember>) => {
    if (player.id) {
      setTeamMembers(teamMembers.map((p) => (p.id === player.id ? player as TeamMember : p)));
      toast.success("Player updated successfully");
    } else {
      const newPlayer: TeamMember = {
        id: Math.max(...teamMembers.map((p) => p.id), 0) + 1,
        name: player.name || "",
        position: player.position || "",
        number: player.number || "",
        image: player.image || "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=400&q=80",
        category: ["Prop", "Hooker", "Lock", "Flanker", "Number 8"].includes(player.position || "") ? "Forwards" : "Backs",
      };
      setTeamMembers([...teamMembers, newPlayer]);
      toast.success("Player added successfully");
    }
  };

  const handleDeletePlayer = (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      setTeamMembers(teamMembers.filter((p) => p.id !== id));
      toast.success("Player deleted successfully");
    }
  };

  const handleSaveNews = (news: Partial<NewsItem>) => {
    if (news.id) {
      setNewsItems(newsItems.map((n) => (n.id === news.id ? news as NewsItem : n)));
      toast.success("News updated successfully");
    } else {
      const newNews: NewsItem = {
        id: Math.max(...newsItems.map((n) => n.id), 0) + 1,
        date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }).toUpperCase().replace(/ /g, ". "),
        title: news.title || "",
        description: news.description || "",
        image: news.image || "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=600&q=80",
      };
      setNewsItems([...newsItems, newNews]);
      toast.success("News added successfully");
    }
  };

  const handleDeleteNews = (id: number, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      setNewsItems(newsItems.filter((n) => n.id !== id));
      toast.success("News deleted successfully");
    }
  };

  const handleSettingsChange = async () => {
    const logo = await getSiteLogo();
    setLoginLogo(logo);
  };

  if (!isLoggedIn) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  if (!isAdminUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card rounded-2xl max-w-md w-full p-8 shadow-2xl border border-border text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">You don't have admin privileges.</p>
          <button onClick={handleLogout} className="btn-accent">Logout</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 md:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <a href="/" className="flex items-center gap-2 text-primary-foreground/90 hover:text-primary-foreground transition-colors">
                <ArrowLeft size={20} />
                <span className="hidden sm:inline">Back to Site</span>
              </a>
              <div className="w-px h-6 bg-primary-foreground/30 hidden sm:block" />
              <h1 className="text-lg md:text-xl font-display font-bold text-primary-foreground">Admin Dashboard</h1>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 bg-accent/90 text-accent-foreground px-4 py-2 rounded-lg font-semibold hover:bg-accent transition-colors text-sm">
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      
        <div className="container mx-auto px-4 md:px-6">
          <nav className="flex gap-1 overflow-x-auto pb-1">
            {[
              { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
              { id: "players", label: "Players", icon: Users },
              { id: "matches", label: "Matches", icon: CalendarDays },
              { id: "stats", label: "Stats", icon: Trophy },
              { id: "news", label: "News", icon: Newspaper },
              { id: "joinRequests", label: "Join Requests", icon: UserPlus, badge: pendingCount, hasNotification: hasNewNotification },
              { id: "settings", label: "Settings", icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === "joinRequests") handleMarkNotificationSeen();
                }}
                className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "text-primary-foreground border-primary-foreground bg-white/10"
                    : "text-primary-foreground/70 border-transparent hover:text-primary-foreground hover:bg-white/5"
                }`}
              >
                {tab.id === "joinRequests" && (tab.hasNotification || (tab.badge as number) > 0) ? (
                  <span className="relative">
                    <tab.icon size={18} />
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-trojan-red rounded-full animate-pulse" />
                  </span>
                ) : (
                  <tab.icon size={18} />
                )}
                <span>{tab.label}</span>
                {tab.id === "players" && <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">{teamMembers.length}</span>}
                {tab.id === "news" && <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">{newsItems.length}</span>}
                {tab.id === "joinRequests" && (tab.badge as number) > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${tab.hasNotification ? "bg-trojan-red animate-pulse" : "bg-trojan-red"}`}>{tab.badge}</span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6 py-6">
        {activeTab === "dashboard" && (
          <DashboardTab 
            teamMembers={teamMembers}
            newsItems={newsItems}
            joinRequests={joinRequests}
            setActiveTab={setActiveTab}
            setJoinRequests={setJoinRequests}
            setPendingCount={setPendingCount}
          />
        )}

        {activeTab === "players" && (
          <PlayersTab 
            players={teamMembers}
            onSavePlayer={handleSavePlayer}
            onDeletePlayer={handleDeletePlayer}
          />
        )}

        {activeTab === "matches" && <MatchesTab teamMembers={teamMembers} />}

        {activeTab === "stats" && <StatsTab />}

        {activeTab === "news" && (
          <NewsTab 
            newsItems={newsItems}
            onSaveNews={handleSaveNews}
            onDeleteNews={handleDeleteNews}
          />
        )}

        {activeTab === "joinRequests" && <JoinRequestsTab onRefresh={fetchJoinRequests} />}

        {activeTab === "settings" && <SettingsTab onSettingsChange={handleSettingsChange} />}
      </main>
    </div>
  );
};

export default AdminPage;
