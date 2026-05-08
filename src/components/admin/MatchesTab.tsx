import { useState } from "react";
import { Plus, Edit2, Trash2, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPlayers, getMatches, saveMatch, updateMatch, deleteMatch, type Match } from "@/lib/auth";
import type { TeamMember } from "@/data/team";
import AdminModal from "./AdminModal";
import ConfirmDialog from "./ConfirmDialog";
import { Skeleton } from "@/components/ui/skeleton";

interface MatchesTabProps {
  teamMembers: TeamMember[];
}

const MatchesTab = ({ teamMembers }: MatchesTabProps) => {
  const queryClient = useQueryClient();
  const [showMatchForm, setShowMatchForm] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Partial<Match> | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  const { data: matches = [], isLoading } = useQuery({
    queryKey: ["matches"],
    queryFn: getMatches,
  });

  const { data: players = [] } = useQuery({
    queryKey: ["players"],
    queryFn: getPlayers,
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!editingMatch?.date || !editingMatch?.opponent) throw new Error("Fill required fields");
      if (editingMatch.id) {
        return updateMatch(editingMatch.id, editingMatch);
      } else {
        return saveMatch(editingMatch as Omit<Match, "id">);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matches"] });
      toast.success(editingMatch?.id ? "Match updated!" : "Match added!");
      setShowMatchForm(false);
      setEditingMatch(null);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => deleteMatch(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matches"] });
      toast.success("Match deleted");
      setDeleteTarget(null);
    },
    onError: () => toast.error("Failed to delete match"),
  });

  const handleEdit = (match: Match) => {
    setEditingMatch(match);
    setShowMatchForm(true);
  };

  const handleAddNew = () => {
    setEditingMatch({
      date: "", time: "", opponent: "", venue: "", competition: "",
      status: "scheduled", isHome: true, trojansScore: 0, opponentScore: 0
    });
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

      <AdminModal
        isOpen={showMatchForm}
        onClose={() => { setShowMatchForm(false); setEditingMatch(null); }}
        title={editingMatch?.id ? "Edit Match" : "Add New Match"}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Date *</label>
              <input
                type="text" placeholder="May 10, 2026"
                value={editingMatch?.date || ""}
                onChange={(e) => setEditingMatch({ ...editingMatch, date: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Time *</label>
              <input
                type="text" placeholder="3:00 PM"
                value={editingMatch?.time || ""}
                onChange={(e) => setEditingMatch({ ...editingMatch, time: e.target.value })}
                className="input-field"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Opponent *</label>
            <input
              type="text" placeholder="Kisumu RFC"
              value={editingMatch?.opponent || ""}
              onChange={(e) => setEditingMatch({ ...editingMatch, opponent: e.target.value })}
              className="input-field"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Venue *</label>
              <input
                type="text" placeholder="Murang'a Sports Complex"
                value={editingMatch?.venue || ""}
                onChange={(e) => setEditingMatch({ ...editingMatch, venue: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Competition *</label>
              <input
                type="text" placeholder="Kenya Cup"
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
                onChange={(e) => setEditingMatch({ ...editingMatch, trojansScore: parseInt(e.target.value) || 0 })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Opponent Score</label>
              <input
                type="number"
                value={editingMatch?.opponentScore || 0}
                onChange={(e) => setEditingMatch({ ...editingMatch, opponentScore: parseInt(e.target.value) || 0 })}
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

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Select Players for this Match</label>
            <div className="max-h-40 overflow-y-auto border border-border rounded-lg p-3 space-y-2">
              {players.length === 0 ? (
                <p className="text-sm text-muted-foreground">No players loaded</p>
              ) : (
                players.map((player: any) => (
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
                ))
              )}
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
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending}
            className="flex-1 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg font-semibold hover:bg-trojan-green-dark disabled:opacity-50"
          >
            {saveMutation.isPending ? "Saving..." : "Save Match"}
          </button>
        </div>
      </AdminModal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
        title="Delete Match"
        message="Are you sure you want to delete this match? This action cannot be undone."
        confirmLabel="Delete"
        destructive
      />

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {matches.map((match: Match) => (
            <div key={match.id} className="bg-card rounded-xl p-4 border border-border flex items-center justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center relative ${
                  match.result === "W" ? "bg-primary" : match.result === "L" ? "bg-accent" : "bg-muted"
                }`}>
                  <Trophy size={20} className={match.result === "W" ? "text-primary-foreground" : "text-foreground"} />
                  {match.status === "live" && (
                    <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-trojan-red rounded-full animate-ping" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-foreground">{match.date} — {match.competition}</p>
                    {match.status === "live" && (
                      <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-bold bg-trojan-red text-white rounded-full animate-pulse">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                        LIVE
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {match.opponent}
                    <span className="mx-1.5">·</span>
                    {match.isHome ? "Home" : "Away"}
                    <span className="mx-1.5">·</span>
                    {match.venue}
                  </p>
                  {match.status === "completed" && (
                    <p className="text-sm font-bold text-primary mt-0.5">
                      {match.trojansScore} – {match.opponentScore}
                      <span className="ml-1.5 text-xs font-medium text-muted-foreground">
                        ({match.result === "W" ? "Win" : match.result === "L" ? "Loss" : "Draw"})
                      </span>
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(match)} className="p-2 text-primary hover:bg-primary/10 rounded-lg"><Edit2 size={18} /></button>
                <button onClick={() => setDeleteTarget(match.id)} className="p-2 text-accent hover:bg-accent/10 rounded-lg"><Trash2 size={18} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && matches.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No matches found</p>
        </div>
      )}
    </motion.div>
  );
};

export default MatchesTab;
