import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { getPlayers, getMatches, saveMatch, updateMatch, deleteMatch, type Match } from "@/lib/auth";
import type { TeamMember } from "@/data/team";

interface MatchesTabProps {
  teamMembers: TeamMember[];
}

const MatchesTab = ({ teamMembers }: MatchesTabProps) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [showMatchForm, setShowMatchForm] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Partial<Match> | null>(null);
  const [players, setPlayers] = useState<any[]>([]);

  useEffect(() => {
    fetchMatches();
    fetchPlayers();
  }, []);

  const fetchMatches = async () => {
    try {
      const data = await getMatches();
      setMatches(data);
    } catch (error) {
      console.error("Failed to fetch matches");
    }
  };

  const fetchPlayers = async () => {
    try {
      const data = await getPlayers();
      setPlayers(data);
    } catch (error) {
      console.error("Failed to fetch players");
    }
  };

  const handleSaveMatch = async () => {
    if (!editingMatch?.date || !editingMatch?.opponent) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      if (editingMatch.id) {
        await updateMatch(editingMatch.id, editingMatch);
        toast.success("Match updated!");
      } else {
        await saveMatch(editingMatch as Omit<Match, "id">);
        toast.success("Match added!");
      }
      setEditingMatch(null);
      setShowMatchForm(false);
      fetchMatches();
    } catch (error) {
      toast.error("Failed to save match");
    }
  };

  const handleDeleteMatch = async (id: number) => {
    if (!confirm("Delete this match?")) return;
    try {
      await deleteMatch(id);
      toast.success("Match deleted");
      fetchMatches();
    } catch (error) {
      toast.error("Failed to delete match");
    }
  };

  const handleAddNew = () => {
    setEditingMatch({ 
      date: "", time: "", opponent: "", venue: "", competition: "", 
      status: "scheduled", isHome: true, trojansScore: 0, opponentScore: 0 
    });
    setShowMatchForm(true);
  };

  const handleEdit = (match: Match) => {
    setEditingMatch(match);
    setShowMatchForm(true);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-foreground">Match Management</h2>
        <button 
          onClick={handleAddNew}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg font-semibold hover:bg-trojan-green-dark transition-colors"
        >
          <Plus size={18} />
          Add Match
        </button>
      </div>

      {showMatchForm && (
        <motion.div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div 
            className="bg-card rounded-2xl w-full max-w-lg p-6 my-8 shadow-2xl max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            <h3 className="text-xl font-bold text-foreground mb-4">
              {editingMatch?.id ? "Edit Match" : "Add New Match"}
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Date *</label>
                  <input 
                    type="text" 
                    placeholder="May 10, 2026" 
                    value={editingMatch?.date || ""} 
                    onChange={(e) => setEditingMatch({ ...editingMatch, date: e.target.value })} 
                    className="input-field" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Time *</label>
                  <input 
                    type="text" 
                    placeholder="3:00 PM" 
                    value={editingMatch?.time || ""} 
                    onChange={(e) => setEditingMatch({ ...editingMatch, time: e.target.value })} 
                    className="input-field" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Opponent *</label>
                <input 
                  type="text" 
                  placeholder="Kisumu RFC" 
                  value={editingMatch?.opponent || ""} 
                  onChange={(e) => setEditingMatch({ ...editingMatch, opponent: e.target.value })} 
                  className="input-field" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Venue *</label>
                  <input 
                    type="text" 
                    placeholder="Murang'a Sports Complex" 
                    value={editingMatch?.venue || ""} 
                    onChange={(e) => setEditingMatch({ ...editingMatch, venue: e.target.value })} 
                    className="input-field" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Competition *</label>
                  <input 
                    type="text" 
                    placeholder="Kenya Cup" 
                    value={editingMatch?.competition || ""} 
                    onChange={(e) => setEditingMatch({ ...editingMatch, competition: e.target.value })} 
                    className="input-field" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Result</label>
                  <select 
                    value={editingMatch?.result || ""} 
                    onChange={(e) => setEditingMatch({ ...editingMatch, result: e.target.value })} 
                    className="input-field"
                  >
                    <option value="">Scheduled</option>
                    <option value="W">Win</option>
                    <option value="L">Loss</option>
                    <option value="D">Draw</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Status</label>
                  <select 
                    value={editingMatch?.status || "scheduled"} 
                    onChange={(e) => setEditingMatch({ ...editingMatch, status: e.target.value as "scheduled" | "completed" | "live" })} 
                    className="input-field"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="live">Live</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Our Score</label>
                  <input 
                    type="number" 
                    value={editingMatch?.trojansScore || 0} 
                    onChange={(e) => setEditingMatch({ ...editingMatch, trojansScore: parseInt(e.target.value) })} 
                    className="input-field" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Opponent Score</label>
                  <input 
                    type="number" 
                    value={editingMatch?.opponentScore || 0} 
                    onChange={(e) => setEditingMatch({ ...editingMatch, opponentScore: parseInt(e.target.value) })} 
                    className="input-field" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Home/Away</label>
                  <select 
                    value={editingMatch?.isHome ? "true" : "false"} 
                    onChange={(e) => setEditingMatch({ ...editingMatch, isHome: e.target.value === "true" })} 
                    className="input-field"
                  >
                    <option value="true">Home</option>
                    <option value="false">Away</option>
                  </select>
                </div>
              </div>
              
              {/* Player selection for match */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Select Players for this Match</label>
                <div className="max-h-40 overflow-y-auto border border-border rounded-lg p-3 space-y-2">
                  {players.map((player) => (
                    <label key={player.id} className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-1 rounded">
                      <input
                        type="checkbox"
                        checked={editingMatch?.playerIds?.split(",").includes(String(player.id)) || false}
                        onChange={(e) => {
                          const currentIds = editingMatch?.playerIds ? editingMatch.playerIds.split(",").filter(Boolean) : [];
                          if (e.target.checked) {
                            currentIds.push(String(player.id));
                          } else {
                            const idx = currentIds.indexOf(String(player.id));
                            if (idx > -1) currentIds.splice(idx, 1);
                          }
                          setEditingMatch({ ...editingMatch, playerIds: currentIds.join(",") });
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">{player.name} - {player.position}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => { setShowMatchForm(false); setEditingMatch(null); }} 
                className="flex-1 bg-muted text-foreground px-4 py-2.5 rounded-lg font-semibold hover:bg-muted/80"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveMatch}
                className="flex-1 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg font-semibold hover:bg-trojan-green-dark"
              >
                Save Match
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      <div className="space-y-4">
        {matches.map((match) => (
          <div key={match.id} className="bg-card rounded-xl p-4 border border-border flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${match.result === "W" ? "bg-primary" : match.result === "L" ? "bg-accent" : "bg-muted"}`}>
                <Trophy size={20} className={match.result === "W" ? "text-primary-foreground" : "text-foreground"} />
              </div>
              <div>
                <p className="font-semibold text-foreground">{match.date} - {match.competition}</p>
                <p className="text-sm text-muted-foreground">{match.opponent} @ {match.venue}</p>
                {match.status === "completed" && <p className="text-sm font-bold text-primary">{match.trojansScore} - {match.opponentScore} ({match.result})</p>}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(match)} className="p-2 text-primary hover:bg-primary/10 rounded-lg"><Edit2 size={18} /></button>
              <button onClick={() => handleDeleteMatch(match.id)} className="p-2 text-accent hover:bg-accent/10 rounded-lg"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default MatchesTab;
