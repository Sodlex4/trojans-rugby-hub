import { useState } from "react";
import { Plus, Edit2, Trash2, Search } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { TeamMember } from "@/data/team";
import AdminModal from "./AdminModal";
import ConfirmDialog from "./ConfirmDialog";

interface PlayersTabProps {
  players: TeamMember[];
  onSavePlayer: (player: Partial<TeamMember>) => void;
  onDeletePlayer: (id: number, name: string) => void;
}

const positions = [
  "Prop", "Hooker", "Lock", "Flanker", "Number 8",
  "Scrum-Half", "Fly-Half", "Centre", "Wing", "Full-Back",
  "Head Coach", "Manager", "Physio"
];

const PlayersTab = ({ players, onSavePlayer, onDeletePlayer }: PlayersTabProps) => {
  const [showPlayerForm, setShowPlayerForm] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Partial<TeamMember> | null>(null);
  const [playerSearchQuery, setPlayerSearchQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);

  const filteredPlayers = playerSearchQuery
    ? players.filter(p =>
        p.name.toLowerCase().includes(playerSearchQuery.toLowerCase()) ||
        p.position.toLowerCase().includes(playerSearchQuery.toLowerCase())
      )
    : players;

  const handleSavePlayer = () => {
    if (!editingPlayer?.name || !editingPlayer?.position) {
      toast.error("Please fill in all required fields");
      return;
    }
    onSavePlayer(editingPlayer);
    setEditingPlayer(null);
    setShowPlayerForm(false);
  };

  const handleAddNew = () => {
    setEditingPlayer({});
    setShowPlayerForm(true);
  };

  const handleEdit = (player: TeamMember) => {
    setEditingPlayer(player);
    setShowPlayerForm(true);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      onDeletePlayer(deleteTarget.id, deleteTarget.name);
      setDeleteTarget(null);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-foreground">Players Management</h2>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg font-semibold hover:bg-trojan-green-dark transition-colors"
        >
          <Plus size={18} />
          Add Player
        </button>
      </div>

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

      <AdminModal
        isOpen={showPlayerForm}
        onClose={() => { setShowPlayerForm(false); setEditingPlayer(null); }}
        title={editingPlayer?.id ? "Edit Player" : "Add New Player"}
      >
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
      </AdminModal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        title="Delete Player"
        message={`Are you sure you want to delete ${deleteTarget?.name}? This action cannot be undone.`}
        confirmLabel="Delete"
        destructive
      />

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
                   onClick={() => handleEdit(player)}
                   className="p-2 bg-primary/90 text-primary-foreground rounded-lg hover:bg-primary transition-colors active:scale-95 touch-manipulation"
                   aria-label="Edit player"
                 >
                   <Edit2 size={16} />
                 </button>
                 <button
                   onClick={() => setDeleteTarget({ id: player.id, name: player.name })}
                   className="p-2 bg-accent/90 text-accent-foreground rounded-lg hover:bg-accent transition-colors active:scale-95 touch-manipulation"
                   aria-label="Delete player"
                 >
                   <Trash2 size={16} />
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
          <p className="text-muted-foreground">No players found</p>
        </div>
      )}
    </motion.div>
  );
};

export default PlayersTab;
