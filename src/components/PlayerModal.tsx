import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
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

interface PlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: Partial<TeamMember> | null;
  onSave: (player: TeamMember) => void;
  isEditing: boolean;
}

const positions = [
  "Prop",
  "Hooker",
  "Lock",
  "Flanker",
  "Number 8",
  "Scrum-Half",
  "Fly-Half",
  "Centre",
  "Wing",
  "Full-Back",
  "Head Coach",
  "Manager",
  "Physio",
];

const PlayerModal = ({ isOpen, onClose, player, onSave, isEditing }: PlayerModalProps) => {
  const [form, setForm] = useState<Partial<TeamMember>>({
    name: "",
    position: "",
    number: "",
    image: "",
    category: "",
  });

  useEffect(() => {
    if (player) {
      setForm(player);
    }
  }, [player]);

  const handleSubmit = () => {
    if (!form.name || !form.position || !form.number || !form.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    onSave({
      id: form.id || Date.now(),
      name: form.name,
      position: form.position,
      number: form.number,
      image: form.image || "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=400&q=80",
      category: form.category,
    });

    toast.success(isEditing ? "Player updated successfully!" : "Player added successfully!");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-foreground/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-card rounded-2xl max-w-lg w-full p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-display text-primary tracking-wide">
                {isEditing ? "EDIT PLAYER" : "ADD PLAYER"}
              </h2>
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
              >
                <X size={24} />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-5">
              <div>
                <label className="block text-foreground font-semibold mb-2">
                  Player Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter player name"
                  value={form.name || ""}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-field"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-foreground font-semibold mb-2">
                    Position *
                  </label>
                  <select
                    value={form.position || ""}
                    onChange={(e) => setForm({ ...form, position: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Select Position</option>
                    {positions.map((pos) => (
                      <option key={pos} value={pos}>
                        {pos}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-foreground font-semibold mb-2">
                    Category *
                  </label>
                  <select
                    value={form.category || ""}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Select Category</option>
                    <option value="Forwards">Forwards</option>
                    <option value="Backs">Backs</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-foreground font-semibold mb-2">
                  Jersey Number *
                </label>
                <input
                  type="text"
                  placeholder="Enter jersey number"
                  value={form.number || ""}
                  onChange={(e) => setForm({ ...form, number: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-foreground font-semibold mb-2">
                  Image URL
                </label>
                <input
                  type="text"
                  placeholder="Enter image URL (optional)"
                  value={form.image || ""}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="input-field"
                />
              </div>

              {/* Image Preview */}
              {form.image && (
                <motion.div
                  className="flex justify-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <img
                    src={form.image}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-xl shadow-card"
                  />
                </motion.div>
              )}

              <motion.button
                onClick={handleSubmit}
                className="w-full bg-primary text-primary-foreground py-4 rounded-xl 
                         font-display text-lg tracking-wide flex items-center justify-center gap-3
                         hover:bg-trojan-green-dark transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Save size={20} />
                {isEditing ? "UPDATE PLAYER" : "ADD PLAYER"}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PlayerModal;
