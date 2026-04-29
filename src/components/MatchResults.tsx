import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, CheckCircle, XCircle, Trophy } from "lucide-react";
import { getMatches, type Match } from "@/lib/auth";

const MatchResults = () => {
  const [pastResults, setPastResults] = useState<Match[]>([]);

  useEffect(() => {
    const fetchResults = async () => {
      const allMatches = await getMatches();
      const completed = allMatches
        .filter(m => m.status === "completed")
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setPastResults(completed);
    };
    fetchResults();
  }, []);

  if (pastResults.length === 0) {
    return <p className="text-center text-muted-foreground py-8">No match results available.</p>;
  }

  return (
    <div className="space-y-4">
      {pastResults.map((match, index) => (
        <motion.div
          key={match.id}
          className="bg-card rounded-xl p-5 border border-border"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Trophy size={14} className="text-trojan-gold" />
              <span className="text-xs font-semibold text-trojan-gold uppercase tracking-wider">
                {match.competition}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar size={14} />
              {match.date}
            </div>
          </div>

          {/* Score */}
          <div className="flex items-center justify-between">
            {/* Trojans */}
            <div className="flex items-center gap-3">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                match.result === "W" ? "bg-primary" : match.result === "L" ? "bg-accent" : "bg-muted"
              }`}>
                <span className={`text-primary-foreground font-bold text-xl ${
                  match.result === "W" ? "" : match.result === "L" ? "" : "text-foreground"
                }`}>
                  T
                </span>
              </div>
              <div>
                <p className="font-bold text-lg text-foreground">Trojans RFC</p>
                <p className="text-xs text-muted-foreground">
                  {match.isHome ? "Home" : "Away"}
                </p>
              </div>
            </div>

            {/* Score Display */}
            <div className="text-center">
              <div className="flex items-center gap-4">
                <span className={`text-4xl font-bold ${
                  match.result === "W" ? "text-primary" : match.result === "L" ? "text-accent" : "text-muted-foreground"
                }`}>
                  {match.trojansScore}
                </span>
                <span className="text-2xl text-muted-foreground">-</span>
                <span className="text-4xl font-bold text-foreground">
                  {match.opponentScore}
                </span>
              </div>
              <div className={`mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
                match.result === "W" 
                  ? "bg-primary/20 text-primary" 
                  : match.result === "L" 
                  ? "bg-accent/20 text-accent"
                  : "bg-muted text-muted-foreground"
              }`}>
                {match.result === "W" ? (
                  <><CheckCircle size={14} /> WIN</>
                ) : match.result === "L" ? (
                  <><XCircle size={14} /> LOSS</>
                ) : (
                  <>DRAW</>
                )}
              </div>
            </div>

            {/* Opponent */}
            <div className="flex items-center gap-3">
              <div className="text-left">
                <p className="font-bold text-lg text-foreground">{match.opponent}</p>
                <p className="text-xs text-muted-foreground">
                  {match.opponent.replace("RFC", "").trim()}
                </p>
              </div>
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                <img 
                  src={match.opponentLogo} 
                  alt={match.opponent}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Venue */}
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
            <MapPin size={14} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{match.venue}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default MatchResults;