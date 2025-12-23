import { useState, useMemo } from "react";
import { Edit2, Trash2, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TeamMember {
  id: number;
  name: string;
  position: string;
  number: string;
  image: string;
  category: string;
}

interface TeamSectionProps {
  teamMembers: TeamMember[];
  isAdmin: boolean;
  onEditPlayer: (player: TeamMember) => void;
  onDeletePlayer: (id: number) => void;
}

const positions = [
  "All",
  "Forwards",
  "Backs",
  "Scrum-Half",
  "Fly-Half",
  "Prop",
  "Hooker",
  "Lock",
  "Flanker",
  "Number 8",
  "Wing",
  "Centre",
  "Full-Back",
];

const positionSuggestions = [
  "Hooker",
  "Flanker",
  "Prop",
  "Lock",
  "Number 8",
  "Scrum-Half",
  "Fly-Half",
  "Centre",
  "Wing",
  "Full-Back",
];

const TeamSection = ({ teamMembers, isAdmin, onEditPlayer, onDeletePlayer }: TeamSectionProps) => {
  const [selectedPosition, setSelectedPosition] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = useMemo(() => {
    if (!searchQuery) return positionSuggestions;
    return positionSuggestions.filter((pos) =>
      pos.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const filteredTeam = useMemo(() => {
    let result = teamMembers;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (member) =>
          member.name.toLowerCase().includes(query) ||
          member.position.toLowerCase().includes(query) ||
          member.category.toLowerCase().includes(query)
      );
    }

    // Filter by position
    if (selectedPosition !== "All") {
      result = result.filter(
        (member) =>
          member.category === selectedPosition || member.position === selectedPosition
      );
    }

    return result;
  }, [teamMembers, searchQuery, selectedPosition]);

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setShowSuggestions(false);
  };

  return (
    <section id="team" className="py-20 md:py-28 bg-card">
      <div className="container mx-auto px-6">
        {/* Section Title */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">OUR TEAM</h2>
          <div className="section-divider" />
        </motion.div>

        {/* Search Bar */}
        <motion.div
          className="max-w-md mx-auto mb-8 relative"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Search players by name or position..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="w-full pl-12 pr-10 py-3 rounded-full border border-border bg-background
                       focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
                       transition-all text-foreground placeholder:text-muted-foreground"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground 
                         hover:text-foreground transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Suggestions Dropdown */}
          <AnimatePresence>
            {showSuggestions && filteredSuggestions.length > 0 && (
              <motion.div
                className="absolute top-full left-0 right-0 mt-2 bg-card border border-border 
                         rounded-xl shadow-lg overflow-hidden z-20"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <p className="px-4 py-2 text-xs text-muted-foreground font-semibold uppercase tracking-wide border-b border-border">
                  Position Suggestions
                </p>
                {filteredSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onMouseDown={() => handleSuggestionClick(suggestion)}
                    className="w-full px-4 py-2.5 text-left text-foreground hover:bg-primary/10 
                             hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-primary/50" />
                    {suggestion}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Position Filter */}
        <motion.div
          className="mb-12 flex flex-wrap justify-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {positions.map((position) => (
            <button
              key={position}
              onClick={() => setSelectedPosition(position)}
              className={`filter-btn ${
                selectedPosition === position
                  ? "filter-btn-active"
                  : "filter-btn-inactive"
              }`}
            >
              {position}
            </button>
          ))}
        </motion.div>

        {/* Team Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          layout
        >
          <AnimatePresence mode="popLayout">
            {filteredTeam.map((member, index) => (
              <motion.div
                key={member.id}
                className="player-card group relative"
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                {/* Image Container */}
                <div className="relative overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-72 object-cover transition-transform duration-500 
                             group-hover:scale-110"
                  />
                  
                  {/* Jersey Number */}
                  <div className="jersey-number">{member.number}</div>

                  {/* Admin Controls */}
                  {isAdmin && (
                    <motion.div
                      className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                    >
                      <button
                        onClick={() => onEditPlayer(member)}
                        className="bg-primary text-primary-foreground p-2 rounded-full 
                                 hover:bg-trojan-green-dark transition-colors shadow-lg"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => onDeletePlayer(member.id)}
                        className="bg-accent text-accent-foreground p-2 rounded-full 
                                 hover:bg-trojan-red-dark transition-colors shadow-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </motion.div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent 
                                opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Info */}
                <div className="p-5 text-center">
                  <h3 className="text-xl font-display text-foreground tracking-wide mb-1">
                    {member.name}
                  </h3>
                  <p className="text-primary font-semibold">{member.position}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredTeam.length === 0 && (
          <motion.p
            className="text-center text-muted-foreground text-lg mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            No players found. Try a different search or filter.
          </motion.p>
        )}
      </div>
    </section>
  );
};

export default TeamSection;
