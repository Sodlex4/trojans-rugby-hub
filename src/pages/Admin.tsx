import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Plus, Edit2, Trash2, Users, Newspaper, Settings, 
  LayoutDashboard, ArrowLeft, LogOut, Search, UserPlus, Check, X, Mail, Phone, Calendar, Activity, AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { teamMembers as initialTeamMembers, type TeamMember } from "@/data/team";
import { newsItems as initialNewsItems, type NewsItem } from "@/data/news";
import { 
  login, logout, isAuthenticated, isAdmin,
  getAllJoinRequests, acceptJoinRequest, declineJoinRequest 
} from "@/lib/auth";

const positions = [
  "Prop", "Hooker", "Lock", "Flanker", "Number 8",
  "Scrum-Half", "Fly-Half", "Centre", "Wing", "Full-Back",
  "Head Coach", "Manager", "Physio"
];

interface JoinRequest {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  createdAt: string;
}

const AdminPage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  const [isAdminUser, setIsAdminUser] = useState(isAdmin());
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [newsItems, setNewsItems] = useState<NewsItem[]>(initialNewsItems);
  const [activeTab, setActiveTab] = useState<"dashboard" | "players" | "news" | "joinRequests" | "settings">("dashboard");
  const [editingPlayer, setEditingPlayer] = useState<Partial<TeamMember> | null>(null);
  const [editingNews, setEditingNews] = useState<Partial<NewsItem> | null>(null);
  const [showPlayerForm, setShowPlayerForm] = useState(false);
  const [showNewsForm, setShowNewsForm] = useState(false);
  const [playerSearchQuery, setPlayerSearchQuery] = useState("");
  const [newsSearchQuery, setNewsSearchQuery] = useState("");

  // Check auth on mount
  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
    setIsAdminUser(isAdmin());
  }, []);
  
  // Join Requests state
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);

  const handleLogin = async () => {
    if (!loginForm.username || !loginForm.password) {
      toast.error("Please enter username and password");
      return;
    }
    
    setIsLoggingIn(true);
    const result = await login(loginForm.username, loginForm.password);
    setIsLoggingIn(false);
    
    if (result.success) {
      setIsLoggedIn(true);
      setIsAdminUser(isAdmin());
      toast.success("Welcome back!");
    } else {
      toast.error(result.error || "Invalid credentials");
    }
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setIsAdminUser(false);
    setLoginForm({ username: "", password: "" });
  };

  // Fetch join requests on mount and when tab changes
  useEffect(() => {
    if (activeTab === "joinRequests") {
      fetchJoinRequests();
    }
  }, [activeTab]);

  const fetchJoinRequests = async () => {
    setIsLoadingRequests(true);
    try {
      const requests = getAllJoinRequests();
      setJoinRequests(requests);
      setPendingCount(requests.filter((r: JoinRequest) => r.status === "PENDING").length);
    } catch (error) {
      console.error("Failed to fetch join requests:", error);
      toast.error("Failed to load join requests");
    } finally {
      setIsLoadingRequests(false);
    }
  };

  const handleAcceptRequest = async (id: number) => {
    try {
      acceptJoinRequest(id);
      toast.success("Request accepted!");
      fetchJoinRequests();
    } catch (error) {
      toast.error("Failed to accept request");
    }
  };

  const handleDeclineRequest = async (id: number) => {
    try {
      declineJoinRequest(id);
      toast.success("Request declined");
      fetchJoinRequests();
    } catch (error) {
      toast.error("Failed to decline request");
    }
  };

  // Filter functions
  const filteredPlayers = playerSearchQuery 
    ? teamMembers.filter(p => 
        p.name.toLowerCase().includes(playerSearchQuery.toLowerCase()) ||
        p.position.toLowerCase().includes(playerSearchQuery.toLowerCase())
      )
    : teamMembers;

  const filteredNews = newsSearchQuery
    ? newsItems.filter(n =>
        n.title.toLowerCase().includes(newsSearchQuery.toLowerCase()) ||
        n.description.toLowerCase().includes(newsSearchQuery.toLowerCase())
      )
    : newsItems;

  // Stats
  const stats = {
    totalPlayers: teamMembers.length,
    totalNews: newsItems.length,
    forwards: teamMembers.filter(p => p.category === "Forwards").length,
    backs: teamMembers.filter(p => p.category === "Backs").length,
    staff: teamMembers.filter(p => p.category === "Staff").length,
    pendingRequests: pendingCount,
  };

  const handleSavePlayer = () => {
    if (!editingPlayer?.name || !editingPlayer?.position) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (editingPlayer.id) {
      setTeamMembers(teamMembers.map((p) => (p.id === editingPlayer.id ? editingPlayer as TeamMember : p)));
      toast.success("Player updated successfully");
    } else {
      const newPlayer: TeamMember = {
        id: Math.max(...teamMembers.map((p) => p.id), 0) + 1,
        name: editingPlayer.name || "",
        position: editingPlayer.position || "",
        number: editingPlayer.number || "",
        image: editingPlayer.image || "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=400&q=80",
        category: ["Prop", "Hooker", "Lock", "Flanker", "Number 8"].includes(editingPlayer.position || "") ? "Forwards" : "Backs",
      };
      setTeamMembers([...teamMembers, newPlayer]);
      toast.success("Player added successfully");
    }
    setEditingPlayer(null);
    setShowPlayerForm(false);
  };

  const handleDeletePlayer = (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      setTeamMembers(teamMembers.filter((p) => p.id !== id));
      toast.success("Player deleted successfully");
    }
  };

  const handleSaveNews = () => {
    if (!editingNews?.title || !editingNews?.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (editingNews.id) {
      setNewsItems(newsItems.map((n) => (n.id === editingNews.id ? editingNews as NewsItem : n)));
      toast.success("News updated successfully");
    } else {
      const newNews: NewsItem = {
        id: Math.max(...newsItems.map((n) => n.id), 0) + 1,
        date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }).toUpperCase().replace(/ /g, ". "),
        title: editingNews.title || "",
        description: editingNews.description || "",
        image: editingNews.image || "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=600&q=80",
      };
      setNewsItems([...newsItems, newNews]);
      toast.success("News added successfully");
    }
    setEditingNews(null);
    setShowNewsForm(false);
  };

  const handleDeleteNews = (id: number, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      setNewsItems(newsItems.filter((n) => n.id !== id));
      toast.success("News deleted successfully");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", { 
      day: "2-digit", 
      month: "long", 
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Show login form if not authenticated
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card rounded-2xl max-w-md w-full p-8 shadow-2xl border border-border">
          <div className="text-center mb-8">
            <LayoutDashboard className="w-16 h-16 text-primary mx-auto mb-4" />
            <h1 className="text-2xl font-display font-bold text-foreground uppercase">Admin Login</h1>
            <p className="text-muted-foreground mt-2">Sign in to manage the club</p>
          </div>
          
          <div className="space-y-5">
            <div>
              <label className="block text-foreground font-semibold mb-2">Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                className="input-field"
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
            
            <div>
              <label className="block text-foreground font-semibold mb-2">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                className="input-field"
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
            
            <motion.button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="w-full bg-primary text-primary-foreground py-4 rounded-xl 
                       font-display font-bold text-lg uppercase
                       hover:bg-trojan-green-dark transition-all duration-300
                       disabled:opacity-50"
              whileHover={{ scale: isLoggingIn ? 1 : 1.02 }}
              whileTap={{ scale: isLoggingIn ? 1 : 0.98 }}
            >
              {isLoggingIn ? "Signing in..." : "LOGIN"}
            </motion.button>
            
            <div className="text-center pt-4">
              <Link to="/" className="text-primary hover:underline text-sm">
                ← Back to homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 md:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-2 text-primary-foreground/90 hover:text-primary-foreground transition-colors">
                <ArrowLeft size={20} />
                <span className="hidden sm:inline">Back to Site</span>
              </Link>
              <div className="w-px h-6 bg-primary-foreground/30 hidden sm:block" />
              <h1 className="text-lg md:text-xl font-display font-bold text-primary-foreground">
                Admin Dashboard
              </h1>
            </div>
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-2 bg-accent/90 text-accent-foreground px-4 py-2 rounded-lg font-semibold hover:bg-accent transition-colors text-sm"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      
        {/* Tab Navigation */}
        <div className="container mx-auto px-4 md:px-6">
          <nav className="flex gap-1 overflow-x-auto pb-1">
            {[
              { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
              { id: "players", label: "Players", icon: Users },
              { id: "news", label: "News", icon: Newspaper },
              { id: "joinRequests", label: "Join Requests", icon: UserPlus, badge: stats.pendingRequests },
              { id: "settings", label: "Settings", icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "text-primary-foreground border-primary-foreground bg-white/10"
                    : "text-primary-foreground/70 border-transparent hover:text-primary-foreground hover:bg-white/5"
                }`}
              >
                <tab.icon size={18} />
                <span>{tab.label}</span>
                {tab.id === "players" && <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">{stats.totalPlayers}</span>}
                {tab.id === "news" && <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">{stats.totalNews}</span>}
                {tab.id === "joinRequests" && tab.badge > 0 && (
                  <span className="bg-trojan-red px-2 py-0.5 rounded-full text-xs font-bold">{tab.badge}</span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-6 py-6">
        
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
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
                  onClick={() => { setEditingPlayer({}); setShowPlayerForm(true); setActiveTab("players"); }}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg font-semibold hover:bg-trojan-green-dark transition-colors"
                >
                  <Plus size={18} />
                  Add Player
                </button>
                <button 
                  onClick={() => { setEditingNews({}); setShowNewsForm(true); setActiveTab("news"); }}
                  className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2.5 rounded-lg font-semibold hover:bg-trojan-red-dark transition-colors"
                >
                  <Plus size={18} />
                  Add News
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
        )}

        {/* Players Tab */}
        {activeTab === "players" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold text-foreground">Players Management</h2>
              <button 
                onClick={() => { setEditingPlayer({}); setShowPlayerForm(true); }} 
                className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg font-semibold hover:bg-trojan-green-dark transition-colors"
              >
                <Plus size={18} />
                Add Player
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <input
                type="text"
                placeholder="Search players by name or position..."
                value={playerSearchQuery}
                onChange={(e) => setPlayerSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
            </div>

            {/* Player Form Modal */}
            {showPlayerForm && (
              <motion.div 
                className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div 
                  className="bg-card rounded-2xl w-full max-w-lg p-6 my-8 shadow-2xl"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                >
                  <h3 className="text-xl font-bold text-foreground mb-4">
                    {editingPlayer?.id ? "Edit Player" : "Add New Player"}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Player Name *</label>
                      <input
                        type="text"
                        value={editingPlayer?.name || ""}
                        onChange={(e) => setEditingPlayer({ ...editingPlayer, name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="Enter player name"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Position *</label>
                        <select
                          value={editingPlayer?.position || ""}
                          onChange={(e) => setEditingPlayer({ ...editingPlayer, position: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                        >
                          <option value="">Select position</option>
                          {positions.map((pos) => (
                            <option key={pos} value={pos}>{pos}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Jersey Number</label>
                        <input
                          type="text"
                          value={editingPlayer?.number || ""}
                          onChange={(e) => setEditingPlayer({ ...editingPlayer, number: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                          placeholder="e.g., 10"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Image URL</label>
                      <input
                        type="text"
                        value={editingPlayer?.image || ""}
                        onChange={(e) => setEditingPlayer({ ...editingPlayer, image: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button 
                      onClick={handleSavePlayer}
                      className="flex-1 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg font-semibold hover:bg-trojan-green-dark transition-colors"
                    >
                      {editingPlayer?.id ? "Update Player" : "Add Player"}
                    </button>
                    <button 
                      onClick={() => { setShowPlayerForm(false); setEditingPlayer(null); }}
                      className="bg-muted text-foreground px-4 py-2.5 rounded-lg font-semibold hover:bg-muted/80 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Players Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredPlayers.map((player) => (
                <div 
                  key={player.id} 
                  className="bg-card rounded-xl overflow-hidden border border-border hover:border-primary/30 transition-all hover:shadow-md"
                >
                  <div className="aspect-[4/3] relative">
                    <img
                      src={player.image}
                      alt={player.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-1">
                      <button
                        onClick={() => { setEditingPlayer(player); setShowPlayerForm(true); }}
                        className="p-1.5 bg-primary/90 text-primary-foreground rounded-lg hover:bg-primary transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeletePlayer(player.id, player.name)}
                        className="p-1.5 bg-accent/90 text-accent-foreground rounded-lg hover:bg-accent transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    {player.number && (
                      <div className="absolute bottom-2 right-2 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                        {player.number}
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="font-semibold text-foreground truncate">{player.name}</p>
                    <p className="text-sm text-muted-foreground">{player.position}</p>
                  </div>
                </div>
              ))}
            </div>

            {filteredPlayers.length === 0 && (
              <div className="text-center py-12">
                <AlertCircle className="mx-auto text-muted-foreground mb-4" size={40} />
                <p className="text-muted-foreground">No players found</p>
              </div>
            )}
          </motion.div>
        )}

        {/* News Tab */}
        {activeTab === "news" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold text-foreground">News Management</h2>
              <button 
                onClick={() => { setEditingNews({}); setShowNewsForm(true); }} 
                className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg font-semibold hover:bg-trojan-green-dark transition-colors"
              >
                <Plus size={18} />
                Add News
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <input
                type="text"
                placeholder="Search news by title..."
                value={newsSearchQuery}
                onChange={(e) => setNewsSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
            </div>

            {/* News Form Modal */}
            {showNewsForm && (
              <motion.div 
                className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div 
                  className="bg-card rounded-2xl w-full max-w-lg p-6 my-8 shadow-2xl"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                >
                  <h3 className="text-xl font-bold text-foreground mb-4">
                    {editingNews?.id ? "Edit News" : "Add News Item"}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Title *</label>
                      <input
                        type="text"
                        value={editingNews?.title || ""}
                        onChange={(e) => setEditingNews({ ...editingNews, title: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="News title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Description *</label>
                      <textarea
                        value={editingNews?.description || ""}
                        onChange={(e) => setEditingNews({ ...editingNews, description: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 h-32 resize-none"
                        placeholder="News description"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Image URL</label>
                      <input
                        type="text"
                        value={editingNews?.image || ""}
                        onChange={(e) => setEditingNews({ ...editingNews, image: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button 
                      onClick={handleSaveNews}
                      className="flex-1 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg font-semibold hover:bg-trojan-green-dark transition-colors"
                    >
                      {editingNews?.id ? "Update News" : "Add News"}
                    </button>
                    <button 
                      onClick={() => { setShowNewsForm(false); setEditingNews(null); }}
                      className="bg-muted text-foreground px-4 py-2.5 rounded-lg font-semibold hover:bg-muted/80 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* News List */}
            <div className="space-y-4">
              {filteredNews.map((news) => (
                <div 
                  key={news.id} 
                  className="bg-card rounded-xl p-4 border border-border hover:border-primary/30 transition-all hover:shadow-md flex gap-4"
                >
                  <img
                    src={news.image}
                    alt={news.title}
                    className="w-24 h-20 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground truncate">{news.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{news.date}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{news.description}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => { setEditingNews(news); setShowNewsForm(true); }}
                      className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteNews(news.id, news.title)}
                      className="p-2 text-accent hover:bg-accent/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredNews.length === 0 && (
              <div className="text-center py-12">
                <AlertCircle className="mx-auto text-muted-foreground mb-4" size={40} />
                <p className="text-muted-foreground">No news found</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Join Requests Tab */}
        {activeTab === "joinRequests" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold text-foreground">Join Requests</h2>
              <button 
                onClick={fetchJoinRequests}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg font-semibold hover:bg-trojan-green-dark transition-colors"
              >
                <Search size={18} />
                Refresh
              </button>
            </div>

            {isLoadingRequests ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            ) : joinRequests.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-xl border border-border">
                <UserPlus className="mx-auto text-muted-foreground mb-4" size={40} />
                <p className="text-muted-foreground">No join requests yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {joinRequests.map((request) => (
                  <div 
                    key={request.id} 
                    className={`bg-card rounded-xl p-5 border transition-all hover:shadow-md ${
                      request.status === "PENDING" 
                        ? "border-l-4 border-l-trojan-gold" 
                        : request.status === "ACCEPTED"
                        ? "border-l-4 border-l-primary"
                        : "border-l-4 border-l-muted opacity-60"
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-foreground text-lg">{request.name}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            request.status === "PENDING" 
                              ? "bg-trojan-gold/20 text-trojan-gold-dark"
                              : request.status === "ACCEPTED"
                              ? "bg-primary/20 text-primary"
                              : "bg-muted text-muted-foreground"
                          }`}>
                            {request.status}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                          <a href={`mailto:${request.email}`} className="flex items-center gap-1.5 hover:text-primary transition-colors">
                            <Mail size={14} />
                            {request.email}
                          </a>
                          {request.phone && (
                            <a href={`tel:${request.phone}`} className="flex items-center gap-1.5 hover:text-primary transition-colors">
                              <Phone size={14} />
                              {request.phone}
                            </a>
                          )}
                          <span className="flex items-center gap-1.5">
                            <Calendar size={14} />
                            {formatDate(request.createdAt)}
                          </span>
                        </div>

                        <div className="bg-muted/50 rounded-lg p-3">
                          <p className="text-sm text-muted-foreground">
                            <span className="font-semibold text-foreground">Message: </span>
                            {request.message || "No message provided"}
                          </p>
                        </div>
                      </div>

                      {request.status === "PENDING" && (
                        <div className="flex gap-2 lg:flex-col lg:w-32">
                          <button
                            onClick={() => handleAcceptRequest(request.id)}
                            className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:bg-trojan-green-dark transition-colors"
                          >
                            <Check size={16} />
                            Accept
                          </button>
                          <button
                            onClick={() => handleDeclineRequest(request.id)}
                            className="flex-1 flex items-center justify-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-lg font-semibold hover:bg-trojan-red-dark transition-colors"
                          >
                            <X size={16} />
                            Decline
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-2xl font-bold text-foreground mb-6">Settings</h2>
            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="flex items-center gap-4 mb-4">
                <Settings className="text-muted-foreground" size={32} />
                <div>
                  <h3 className="font-semibold text-foreground">Site Settings</h3>
                  <p className="text-sm text-muted-foreground">Configure your site preferences</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                Settings panel coming soon. This will include site configuration options like site title, description, social links, and more.
              </p>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default AdminPage;