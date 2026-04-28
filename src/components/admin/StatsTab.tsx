import { useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { getPlayerStats, savePlayerStats, updatePlayerStat, deletePlayerStat, addPlayerStat, type PlayerStat } from "@/lib/auth";

const positions = [
  "Prop", "Hooker", "Lock", "Flanker", "Number 8",
  "Scrum-Half", "Fly-Half", "Centre", "Wing", "Full-Back",
  "Head Coach", "Manager", "Physio"
];

const StatsTab = () => {
  const [playerStats, setPlayerStats] = useState<PlayerStat[]>([]);
  const [showStatForm, setShowStatForm] = useState(false);
  const [editingStat, setEditingStat] = useState<Partial<PlayerStat> | null>(null);

  useState(() => {
    fetchStats();
  });

  const fetchStats = async () => {
    try {
      const stats = await getPlayerStats();
      setPlayerStats(stats);
    } catch (error) {
      console.error("Failed to fetch player stats");
    }
  };

  const handleSaveStat = async () => {
    if (!editingStat?.name || !editingStat?.position) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      if (editingStat.id) {
        await updatePlayerStat(editingStat.id, editingStat);
        toast.success("Player stats updated!");
      } else {
        await addPlayerStat(editingStat as Omit<PlayerStat, "id">);
        toast.success("Player stats added!");
      }
      setEditingStat(null);
      setShowStatForm(false);
      fetchStats();
    } catch (error) {
      toast.error("Failed to save stats");
    }
  };

  const handleDeleteStat = async (id: number) => {
    if (!confirm("Delete this stats entry?")) return;
    try {
      await deletePlayerStat(id);
      toast.success("Stats deleted");
      fetchStats();
    } catch (error) {
      toast.error("Failed to delete stats");
    }
  };

  const handleAddNew = () => {
    setEditingStat({ 
      id: 0, name: "", position: "", appearances: 0, tries: 0, 
      conversions: 0, penalties: 0, dropGoals: 0, points: 0, 
      tackles: 0, turnovers: 0, manOfMatch: 0, yellowCards: 0, redCards: 0 
    });
    setShowStatForm(true);
  };

  const handleEdit = (stat: PlayerStat) => {
    setEditingStat(stat);
    setShowStatForm(true);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-foreground">Player Stats Management</h2>
        <button 
          onClick={handleAddNew}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg font-semibold hover:bg-trojan-green-dark transition-colors"
        >
          <Plus size={18} />
          Add Player Stats
        </button>
      </div>

      {showStatForm && (
        <motion.div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div 
            className="bg-card rounded-2xl w-full max-w-lg p-6 my-8 shadow-2xl max-h-[80vh] overflow-y-auto"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            <h3 className="text-xl font-bold text-foreground mb-4">
              {editingStat?.id ? "Edit Player Stats" : "Add Player Stats"}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1">Player Name *</label>
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  value={editingStat?.name || ""} 
                  onChange={(e) => setEditingStat({ ...editingStat, name: e.target.value })} 
                  className="input-field" 
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1">Position *</label>
                <select 
                  value={editingStat?.position || ""} 
                  onChange={(e) => setEditingStat({ ...editingStat, position: e.target.value })} 
                  className="input-field"
                >
                  <option value="">Select Position</option>
                  {positions.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div><label className="block text-sm font-medium text-foreground mb-1">Appearances</label><input type="number" value={editingStat?.appearances || 0} onChange={(e) => setEditingStat({ ...editingStat, appearances: parseInt(e.target.value) })} className="input-field" /></div>
              <div><label className="block text-sm font-medium text-foreground mb-1">Tries</label><input type="number" value={editingStat?.tries || 0} onChange={(e) => setEditingStat({ ...editingStat, tries: parseInt(e.target.value) })} className="input-field" /></div>
              <div><label className="block text-sm font-medium text-foreground mb-1">Conversions</label><input type="number" value={editingStat?.conversions || 0} onChange={(e) => setEditingStat({ ...editingStat, conversions: parseInt(e.target.value) })} className="input-field" /></div>
              <div><label className="block text-sm font-medium text-foreground mb-1">Penalties</label><input type="number" value={editingStat?.penalties || 0} onChange={(e) => setEditingStat({ ...editingStat, penalties: parseInt(e.target.value) })} className="input-field" /></div>
              <div><label className="block text-sm font-medium text-foreground mb-1">Drop Goals</label><input type="number" value={editingStat?.dropGoals || 0} onChange={(e) => setEditingStat({ ...editingStat, dropGoals: parseInt(e.target.value) })} className="input-field" /></div>
              <div><label className="block text-sm font-medium text-foreground mb-1">Points</label><input type="number" value={editingStat?.points || 0} onChange={(e) => setEditingStat({ ...editingStat, points: parseInt(e.target.value) })} className="input-field" /></div>
              <div><label className="block text-sm font-medium text-foreground mb-1">Tackles</label><input type="number" value={editingStat?.tackles || 0} onChange={(e) => setEditingStat({ ...editingStat, tackles: parseInt(e.target.value) })} className="input-field" /></div>
              <div><label className="block text-sm font-medium text-foreground mb-1">Turnovers</label><input type="number" value={editingStat?.turnovers || 0} onChange={(e) => setEditingStat({ ...editingStat, turnovers: parseInt(e.target.value) })} className="input-field" /></div>
              <div><label className="block text-sm font-medium text-foreground mb-1">Man of Match</label><input type="number" value={editingStat?.manOfMatch || 0} onChange={(e) => setEditingStat({ ...editingStat, manOfMatch: parseInt(e.target.value) })} className="input-field" /></div>
              <div><label className="block text-sm font-medium text-foreground mb-1">Yellow Cards</label><input type="number" value={editingStat?.yellowCards || 0} onChange={(e) => setEditingStat({ ...editingStat, yellowCards: parseInt(e.target.value) })} className="input-field" /></div>
              <div><label className="block text-sm font-medium text-foreground mb-1">Red Cards</label><input type="number" value={editingStat?.redCards || 0} onChange={(e) => setEditingStat({ ...editingStat, redCards: parseInt(e.target.value) })} className="input-field" /></div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setShowStatForm(false); setEditingStat(null); }} className="flex-1 bg-muted text-foreground px-4 py-2.5 rounded-lg font-semibold hover:bg-muted/80">Cancel</button>
              <button onClick={handleSaveStat} className="flex-1 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg font-semibold hover:bg-trojan-green-dark">Save Stats</button>
            </div>
          </motion.div>
        </motion.div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full bg-card rounded-xl border border-border">
          <thead className="bg-muted/50">
            <tr>
              <th className="p-3 text-left text-sm font-medium text-muted-foreground">Player</th>
              <th className="p-3 text-left text-sm font-medium text-muted-foreground">Position</th>
              <th className="p-3 text-center text-sm font-medium text-muted-foreground">Apps</th>
              <th className="p-3 text-center text-sm font-medium text-muted-foreground">Tries</th>
              <th className="p-3 text-center text-sm font-medium text-muted-foreground">Points</th>
              <th className="p-3 text-center text-sm font-medium text-muted-foreground">Tackles</th>
              <th className="p-3 text-center text-sm font-medium text-muted-foreground">MoM</th>
              <th className="p-3 text-center text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {playerStats.map((stat) => (
              <tr key={stat.id} className="border-t border-border hover:bg-muted/30">
                <td className="p-3 font-medium text-foreground">{stat.name}</td>
                <td className="p-3 text-muted-foreground">{stat.position}</td>
                <td className="p-3 text-center text-foreground">{stat.appearances}</td>
                <td className="p-3 text-center text-primary font-medium">{stat.tries}</td>
                <td className="p-3 text-center text-trojan-gold font-bold">{stat.points}</td>
                <td className="p-3 text-center text-foreground">{stat.tackles}</td>
                <td className="p-3 text-center text-foreground">{stat.manOfMatch}</td>
                <td className="p-3 text-center">
                  <button onClick={() => handleEdit(stat)} className="p-1.5 text-primary hover:bg-primary/10 rounded mr-1"><Edit2 size={14} /></button>
                  <button onClick={() => handleDeleteStat(stat.id)} className="p-1.5 text-accent hover:bg-accent/10 rounded"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default StatsTab;
