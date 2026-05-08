import { useState } from "react";
import { Plus, Edit2, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPlayerStats, savePlayerStat, updatePlayerStat, deletePlayerStat, type PlayerStat } from "@/lib/auth";
import AdminModal from "./AdminModal";
import ConfirmDialog from "./ConfirmDialog";
import { Skeleton } from "@/components/ui/skeleton";

const positions = [
  "Prop", "Hooker", "Lock", "Flanker", "Number 8",
  "Scrum-Half", "Fly-Half", "Centre", "Wing", "Full-Back",
  "Head Coach", "Manager", "Physio"
];

const emptyStat = (): Partial<PlayerStat> => ({
  name: "", position: "", appearances: 0, tries: 0,
  conversions: 0, penalties: 0, dropGoals: 0, points: 0,
  tackles: 0, turnovers: 0, manOfMatch: 0, yellowCards: 0, redCards: 0,
});

const StatsTab = () => {
  const queryClient = useQueryClient();
  const [showStatForm, setShowStatForm] = useState(false);
  const [editingStat, setEditingStat] = useState<Partial<PlayerStat> | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const { data: playerStats = [], isLoading } = useQuery({
    queryKey: ["playerStats"],
    queryFn: getPlayerStats,
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!editingStat?.name || !editingStat?.position) throw new Error("Fill required fields");
      if (editingStat.id) {
        return updatePlayerStat(editingStat.id, editingStat);
      } else {
        return savePlayerStat(editingStat as Omit<PlayerStat, "id">);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playerStats"] });
      toast.success(editingStat?.id ? "Stats updated!" : "Stats added!");
      setShowStatForm(false);
      setEditingStat(null);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deletePlayerStat(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playerStats"] });
      toast.success("Stats deleted");
      setDeleteTarget(null);
    },
    onError: () => toast.error("Failed to delete stats"),
  });

  const StatField = ({ label, field }: { label: string; field: keyof PlayerStat }) => (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1">{label}</label>
      <input
        type="number"
        value={(editingStat?.[field] as number) || 0}
        onChange={(e) => setEditingStat({ ...editingStat, [field]: parseInt(e.target.value) || 0 })}
        className="input-field"
      />
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-foreground">Player Stats Management</h2>
        <button
          onClick={() => { setEditingStat(emptyStat()); setShowStatForm(true); }}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg font-semibold hover:bg-trojan-green-dark transition-colors"
        >
          <Plus size={18} />
          Add Player Stats
        </button>
      </div>

      <AdminModal
        isOpen={showStatForm}
        onClose={() => { setShowStatForm(false); setEditingStat(null); setShowAdvanced(false); }}
        title={editingStat?.id ? "Edit Player Stats" : "Add Player Stats"}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Player Name *</label>
            <input
              type="text" placeholder="John Doe"
              value={editingStat?.name || ""}
              onChange={(e) => setEditingStat({ ...editingStat, name: e.target.value })}
              className="input-field"
            />
          </div>
          <div>
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

          <div className="grid grid-cols-3 gap-3">
            <StatField label="Appearances" field="appearances" />
            <StatField label="Tries" field="tries" />
            <StatField label="Points" field="points" />
            <StatField label="Conversions" field="conversions" />
            <StatField label="Penalties" field="penalties" />
            <StatField label="Drop Goals" field="dropGoals" />
          </div>

          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {showAdvanced ? "Hide Advanced Stats" : "Show Advanced Stats"}
          </button>

          {showAdvanced && (
            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-border">
              <StatField label="Tackles" field="tackles" />
              <StatField label="Turnovers" field="turnovers" />
              <StatField label="Man of Match" field="manOfMatch" />
              <StatField label="Yellow Cards" field="yellowCards" />
              <StatField label="Red Cards" field="redCards" />
            </div>
          )}
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => { setShowStatForm(false); setEditingStat(null); setShowAdvanced(false); }}
            className="flex-1 bg-muted text-foreground px-4 py-2.5 rounded-lg font-semibold hover:bg-muted/80"
          >
            Cancel
          </button>
          <button
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending}
            className="flex-1 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg font-semibold hover:bg-trojan-green-dark disabled:opacity-50"
          >
            {saveMutation.isPending ? "Saving..." : "Save Stats"}
          </button>
        </div>
      </AdminModal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
        title="Delete Stats"
        message="Are you sure you want to delete this stats entry? This action cannot be undone."
        confirmLabel="Delete"
        destructive
      />

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
        </div>
      ) : (
        <>
          <div className="block md:hidden space-y-3">
            {playerStats.map((stat: PlayerStat) => (
              <motion.div
                key={stat.id}
                className="bg-card rounded-xl border border-border p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-bold text-foreground">{stat.name}</p>
                    <p className="text-sm text-muted-foreground">{stat.position}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => { setEditingStat(stat); setShowStatForm(true); }} className="p-2 text-primary hover:bg-primary/10 rounded active:scale-95 touch-manipulation" aria-label="Edit">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => setDeleteTarget(stat.id)} className="p-2 text-accent hover:bg-accent/10 rounded active:scale-95 touch-manipulation" aria-label="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 text-sm">
                  <div className="text-center"><p className="text-muted-foreground text-xs">Apps</p><p className="font-medium text-foreground">{stat.appearances}</p></div>
                  <div className="text-center"><p className="text-muted-foreground text-xs">Tries</p><p className="font-medium text-primary">{stat.tries}</p></div>
                  <div className="text-center"><p className="text-muted-foreground text-xs">Pts</p><p className="font-bold text-trojan-gold">{stat.points}</p></div>
                  <div className="text-center"><p className="text-muted-foreground text-xs">MoM</p><p className="font-medium text-foreground">{stat.manOfMatch}</p></div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="hidden md:block overflow-x-auto">
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
                {playerStats.map((stat: PlayerStat) => (
                  <tr key={stat.id} className="border-t border-border hover:bg-muted/30">
                    <td className="p-3 font-medium text-foreground">{stat.name}</td>
                    <td className="p-3 text-muted-foreground">{stat.position}</td>
                    <td className="p-3 text-center text-foreground">{stat.appearances}</td>
                    <td className="p-3 text-center text-primary font-medium">{stat.tries}</td>
                    <td className="p-3 text-center text-trojan-gold font-bold">{stat.points}</td>
                    <td className="p-3 text-center text-foreground">{stat.tackles}</td>
                    <td className="p-3 text-center text-foreground">{stat.manOfMatch}</td>
                    <td className="p-3 text-center">
                      <button onClick={() => { setEditingStat(stat); setShowStatForm(true); }} className="p-2 text-primary hover:bg-primary/10 rounded mr-1 active:scale-95"><Edit2 size={16} /></button>
                      <button onClick={() => setDeleteTarget(stat.id)} className="p-2 text-accent hover:bg-accent/10 rounded active:scale-95"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {playerStats.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No stats data yet. Add some player stats to get started.</p>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default StatsTab;
