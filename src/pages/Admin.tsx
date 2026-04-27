import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Edit2, Trash2, Users, Newspaper, Settings, LayoutDashboard, ArrowLeft, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { teamMembers as initialTeamMembers, type TeamMember } from "@/data/team";
import { newsItems as initialNewsItems, type NewsItem } from "@/data/news";

const positions = [
  "Prop", "Hooker", "Lock", "Flanker", "Number 8",
  "Scrum-Half", "Fly-Half", "Centre", "Wing", "Full-Back",
  "Head Coach", "Manager", "Physio"
];

const AdminPage = () => {
  const navigate = useNavigate();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [newsItems, setNewsItems] = useState<NewsItem[]>(initialNewsItems);
  const [activeTab, setActiveTab] = useState<"players" | "news" | "settings">("players");
  const [editingPlayer, setEditingPlayer] = useState<Partial<TeamMember> | null>(null);
  const [editingNews, setEditingNews] = useState<Partial<NewsItem> | null>(null);
  const [showPlayerForm, setShowPlayerForm] = useState(false);
  const [showNewsForm, setShowNewsForm] = useState(false);

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

  const handleDeletePlayer = (id: number) => {
    if (window.confirm("Are you sure you want to delete this player?")) {
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

  const handleDeleteNews = (id: number) => {
    if (window.confirm("Are you sure you want to delete this news item?")) {
      setNewsItems(newsItems.filter((n) => n.id !== id));
      toast.success("News deleted successfully");
    }
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="bg-primary p-4 sticky top-0 z-40">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="text-primary-foreground" size={24} />
            <h1 className="text-xl font-display font-bold text-primary-foreground uppercase">
              Admin Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors">
              <ArrowLeft size={18} />
              Back to Site
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-lg font-semibold hover:bg-trojan-red-dark transition-colors">
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <div className="flex border-b border-border mb-6">
          <button onClick={() => setActiveTab("players")} className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors ${activeTab === "players" ? "text-primary border-b-2 border-primary bg-primary/5" : "text-muted-foreground hover:text-foreground"}`}>
            <Users size={20} />
            Players ({teamMembers.length})
          </button>
          <button onClick={() => setActiveTab("news")} className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors ${activeTab === "news" ? "text-primary border-b-2 border-primary bg-primary/5" : "text-muted-foreground hover:text-foreground"}`}>
            <Newspaper size={20} />
            News ({newsItems.length})
          </button>
          <button onClick={() => setActiveTab("settings")} className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors ${activeTab === "settings" ? "text-primary border-b-2 border-primary bg-primary/5" : "text-muted-foreground hover:text-foreground"}`}>
            <Settings size={20} />
            Settings
          </button>
        </div>

        {activeTab === "players" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-foreground">Manage Players</h3>
              <button onClick={() => { setEditingPlayer({}); setShowPlayerForm(true); }} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-trojan-green-dark transition-colors">
                <Plus size={18} />
                Add Player
              </button>
            </div>

            {showPlayerForm && (
              <motion.div className="bg-muted/50 rounded-xl p-6 mb-6" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <h4 className="text-lg font-semibold mb-4">{editingPlayer?.id ? "Edit Player" : "Add New Player"}</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Player Name *" value={editingPlayer?.name || ""} onChange={(e) => setEditingPlayer({ ...editingPlayer, name: e.target.value })} className="input-field" />
                  <select value={editingPlayer?.position || ""} onChange={(e) => setEditingPlayer({ ...editingPlayer, position: e.target.value })} className="input-field">
                    <option value="">Select Position *</option>
                    {positions.map((pos) => (<option key={pos} value={pos}>{pos}</option>))}
                  </select>
                  <input type="text" placeholder="Jersey Number" value={editingPlayer?.number || ""} onChange={(e) => setEditingPlayer({ ...editingPlayer, number: e.target.value })} className="input-field" />
                  <input type="text" placeholder="Image URL" value={editingPlayer?.image || ""} onChange={(e) => setEditingPlayer({ ...editingPlayer, image: e.target.value })} className="input-field" />
                </div>
                <div className="flex gap-3 mt-4">
                  <button onClick={handleSavePlayer} className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-semibold hover:bg-trojan-green-dark transition-colors">Save Player</button>
                  <button onClick={() => { setShowPlayerForm(false); setEditingPlayer(null); }} className="bg-muted text-foreground px-6 py-2 rounded-lg font-semibold hover:bg-muted/80 transition-colors">Cancel</button>
                </div>
              </motion.div>
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {teamMembers.map((player) => (
                <div key={player.id} className="flex items-center gap-4 bg-card rounded-xl p-4 border border-border hover:border-primary/30 transition-colors">
                  <img src={player.image} alt={player.name} className="w-16 h-16 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">{player.name}</p>
                    <p className="text-sm text-muted-foreground">#{player.number} • {player.position}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => { setEditingPlayer(player); setShowPlayerForm(true); }} className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"><Edit2 size={16} /></button>
                    <button onClick={() => handleDeletePlayer(player.id)} className="p-2 text-accent hover:bg-accent/10 rounded-lg transition-colors"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "news" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-foreground">Manage News</h3>
              <button onClick={() => { setEditingNews({}); setShowNewsForm(true); }} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-trojan-green-dark transition-colors">
                <Plus size={18} />
                Add News
              </button>
            </div>

            {showNewsForm && (
              <motion.div className="bg-muted/50 rounded-xl p-6 mb-6" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <h4 className="text-lg font-semibold mb-4">{editingNews?.id ? "Edit News" : "Add News Item"}</h4>
                <div className="space-y-4">
                  <input type="text" placeholder="News Title *" value={editingNews?.title || ""} onChange={(e) => setEditingNews({ ...editingNews, title: e.target.value })} className="input-field w-full" />
                  <textarea placeholder="News Description *" value={editingNews?.description || ""} onChange={(e) => setEditingNews({ ...editingNews, description: e.target.value })} className="input-field w-full h-24 resize-none" />
                  <input type="text" placeholder="Image URL" value={editingNews?.image || ""} onChange={(e) => setEditingNews({ ...editingNews, image: e.target.value })} className="input-field w-full" />
                </div>
                <div className="flex gap-3 mt-4">
                  <button onClick={handleSaveNews} className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-semibold hover:bg-trojan-green-dark transition-colors">Save News</button>
                  <button onClick={() => { setShowNewsForm(false); setEditingNews(null); }} className="bg-muted text-foreground px-6 py-2 rounded-lg font-semibold hover:bg-muted/80 transition-colors">Cancel</button>
                </div>
              </motion.div>
            )}

            <div className="grid gap-4">
              {newsItems.map((news) => (
                <div key={news.id} className="flex items-center gap-4 bg-card rounded-xl p-4 border border-border hover:border-primary/30 transition-colors">
                  <img src={news.image} alt={news.title} className="w-20 h-14 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">{news.title}</p>
                    <p className="text-sm text-muted-foreground">{news.date}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => { setEditingNews(news); setShowNewsForm(true); }} className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"><Edit2 size={16} /></button>
                    <button onClick={() => handleDeleteNews(news.id)} className="p-2 text-accent hover:bg-accent/10 rounded-lg transition-colors"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "settings" && (
          <div className="text-center py-12">
            <Settings size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Settings</h3>
            <p className="text-muted-foreground">Additional settings and configurations coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;