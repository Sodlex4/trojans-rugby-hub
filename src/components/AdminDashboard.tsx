import { useState } from "react";
import { X, Plus, Edit2, Trash2, Users, Newspaper, Settings, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface TeamMember {
  id: number;
  name: string;
  position: string;
  number: string;
  image: string;
  category: string;
}

interface NewsItem {
  id: number;
  date: string;
  title: string;
  description: string;
  image: string;
}

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  teamMembers: TeamMember[];
  newsItems: NewsItem[];
  onUpdateTeamMembers: (members: TeamMember[]) => void;
  onUpdateNewsItems: (items: NewsItem[]) => void;
}

const positions = [
  "Prop", "Hooker", "Lock", "Flanker", "Number 8",
  "Scrum-Half", "Fly-Half", "Centre", "Wing", "Full-Back"
];

const AdminDashboard = ({
  isOpen,
  onClose,
  teamMembers,
  newsItems,
  onUpdateTeamMembers,
  onUpdateNewsItems,
}: AdminDashboardProps) => {
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
      onUpdateTeamMembers(
        teamMembers.map((p) => (p.id === editingPlayer.id ? editingPlayer as TeamMember : p))
      );
      toast.success("Player updated successfully");
    } else {
      const newPlayer: TeamMember = {
        id: Math.max(...teamMembers.map((p) => p.id), 0) + 1,
        name: editingPlayer.name || "",
        position: editingPlayer.position || "",
        number: editingPlayer.number || "",
        image: editingPlayer.image || "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=400&q=80",
        category: ["Prop", "Hooker", "Lock", "Flanker", "Number 8"].includes(editingPlayer.position || "") 
          ? "Forwards" : "Backs",
      };
      onUpdateTeamMembers([...teamMembers, newPlayer]);
      toast.success("Player added successfully");
    }
    setEditingPlayer(null);
    setShowPlayerForm(false);
  };

  const handleDeletePlayer = (id: number) => {
    if (window.confirm("Are you sure you want to delete this player?")) {
      onUpdateTeamMembers(teamMembers.filter((p) => p.id !== id));
      toast.success("Player deleted successfully");
    }
  };

  const handleSaveNews = () => {
    if (!editingNews?.title || !editingNews?.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (editingNews.id) {
      onUpdateNewsItems(
        newsItems.map((n) => (n.id === editingNews.id ? editingNews as NewsItem : n))
      );
      toast.success("News updated successfully");
    } else {
      const newNews: NewsItem = {
        id: Math.max(...newsItems.map((n) => n.id), 0) + 1,
        date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }).toUpperCase().replace(/ /g, ". "),
        title: editingNews.title || "",
        description: editingNews.description || "",
        image: editingNews.image || "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=600&q=80",
      };
      onUpdateNewsItems([...newsItems, newNews]);
      toast.success("News added successfully");
    }
    setEditingNews(null);
    setShowNewsForm(false);
  };

  const handleDeleteNews = (id: number) => {
    if (window.confirm("Are you sure you want to delete this news item?")) {
      onUpdateNewsItems(newsItems.filter((n) => n.id !== id));
      toast.success("News deleted successfully");
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-foreground/80 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-card rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          {/* Header */}
          <div className="bg-primary p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LayoutDashboard className="text-primary-foreground" size={28} />
              <h2 className="text-2xl font-display text-primary-foreground tracking-wide">
                Admin Dashboard
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            >
              <X size={28} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border">
            <button
              onClick={() => setActiveTab("players")}
              className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors ${
                activeTab === "players"
                  ? "text-primary border-b-2 border-primary bg-primary/5"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Users size={20} />
              Players ({teamMembers.length})
            </button>
            <button
              onClick={() => setActiveTab("news")}
              className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors ${
                activeTab === "news"
                  ? "text-primary border-b-2 border-primary bg-primary/5"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Newspaper size={20} />
              News ({newsItems.length})
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors ${
                activeTab === "settings"
                  ? "text-primary border-b-2 border-primary bg-primary/5"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Settings size={20} />
              Settings
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {/* Players Tab */}
            {activeTab === "players" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-foreground">Manage Players</h3>
                  <button
                    onClick={() => {
                      setEditingPlayer({});
                      setShowPlayerForm(true);
                    }}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold
                             flex items-center gap-2 hover:bg-trojan-green-dark transition-colors"
                  >
                    <Plus size={18} />
                    Add Player
                  </button>
                </div>

                {showPlayerForm && (
                  <motion.div
                    className="bg-muted/50 rounded-xl p-6 mb-6"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h4 className="text-lg font-semibold mb-4">
                      {editingPlayer?.id ? "Edit Player" : "Add New Player"}
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Player Name *"
                        value={editingPlayer?.name || ""}
                        onChange={(e) => setEditingPlayer({ ...editingPlayer, name: e.target.value })}
                        className="input-field"
                      />
                      <select
                        value={editingPlayer?.position || ""}
                        onChange={(e) => setEditingPlayer({ ...editingPlayer, position: e.target.value })}
                        className="input-field"
                      >
                        <option value="">Select Position *</option>
                        {positions.map((pos) => (
                          <option key={pos} value={pos}>{pos}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        placeholder="Jersey Number"
                        value={editingPlayer?.number || ""}
                        onChange={(e) => setEditingPlayer({ ...editingPlayer, number: e.target.value })}
                        className="input-field"
                      />
                      <input
                        type="text"
                        placeholder="Image URL"
                        value={editingPlayer?.image || ""}
                        onChange={(e) => setEditingPlayer({ ...editingPlayer, image: e.target.value })}
                        className="input-field"
                      />
                    </div>
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={handleSavePlayer}
                        className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-semibold
                                 hover:bg-trojan-green-dark transition-colors"
                      >
                        Save Player
                      </button>
                      <button
                        onClick={() => {
                          setShowPlayerForm(false);
                          setEditingPlayer(null);
                        }}
                        className="bg-muted text-foreground px-6 py-2 rounded-lg font-semibold
                                 hover:bg-muted/80 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}

                <div className="grid gap-3">
                  {teamMembers.map((player) => (
                    <div
                      key={player.id}
                      className="flex items-center gap-4 bg-muted/30 rounded-lg p-4 hover:bg-muted/50 transition-colors"
                    >
                      <img
                        src={player.image}
                        alt={player.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{player.name}</p>
                        <p className="text-sm text-muted-foreground">
                          #{player.number} • {player.position} • {player.category}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingPlayer(player);
                            setShowPlayerForm(true);
                          }}
                          className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeletePlayer(player.id)}
                          className="p-2 text-accent hover:bg-accent/10 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* News Tab */}
            {activeTab === "news" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-foreground">Manage News</h3>
                  <button
                    onClick={() => {
                      setEditingNews({});
                      setShowNewsForm(true);
                    }}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold
                             flex items-center gap-2 hover:bg-trojan-green-dark transition-colors"
                  >
                    <Plus size={18} />
                    Add News
                  </button>
                </div>

                {showNewsForm && (
                  <motion.div
                    className="bg-muted/50 rounded-xl p-6 mb-6"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h4 className="text-lg font-semibold mb-4">
                      {editingNews?.id ? "Edit News" : "Add News Item"}
                    </h4>
                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="News Title *"
                        value={editingNews?.title || ""}
                        onChange={(e) => setEditingNews({ ...editingNews, title: e.target.value })}
                        className="input-field w-full"
                      />
                      <textarea
                        placeholder="News Description *"
                        value={editingNews?.description || ""}
                        onChange={(e) => setEditingNews({ ...editingNews, description: e.target.value })}
                        className="input-field w-full h-24 resize-none"
                      />
                      <input
                        type="text"
                        placeholder="Image URL"
                        value={editingNews?.image || ""}
                        onChange={(e) => setEditingNews({ ...editingNews, image: e.target.value })}
                        className="input-field w-full"
                      />
                    </div>
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={handleSaveNews}
                        className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-semibold
                                 hover:bg-trojan-green-dark transition-colors"
                      >
                        Save News
                      </button>
                      <button
                        onClick={() => {
                          setShowNewsForm(false);
                          setEditingNews(null);
                        }}
                        className="bg-muted text-foreground px-6 py-2 rounded-lg font-semibold
                                 hover:bg-muted/80 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}

                <div className="grid gap-3">
                  {newsItems.map((news) => (
                    <div
                      key={news.id}
                      className="flex items-center gap-4 bg-muted/30 rounded-lg p-4 hover:bg-muted/50 transition-colors"
                    >
                      <img
                        src={news.image}
                        alt={news.title}
                        className="w-16 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{news.title}</p>
                        <p className="text-sm text-muted-foreground">{news.date}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingNews(news);
                            setShowNewsForm(true);
                          }}
                          className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteNews(news.id)}
                          className="p-2 text-accent hover:bg-accent/10 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="text-center py-12">
                <Settings size={48} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Settings</h3>
                <p className="text-muted-foreground">
                  Additional settings and configurations coming soon.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AdminDashboard;
