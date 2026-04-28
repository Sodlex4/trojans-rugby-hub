import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { leagueTable } from "@/data/stats";

const LeagueTable = () => {
  return (
    <div className="bg-card rounded-xl overflow-hidden border border-border">
      <div className="p-4 bg-primary/10 border-b border-border">
        <div className="flex items-center gap-2">
          <Trophy className="text-trojan-gold" size={20} />
          <h3 className="font-bold text-foreground">Kenya Cup League Table</h3>
        </div>
      </div>
      
      <table className="w-full">
        <thead>
          <tr className="bg-muted/50 text-muted-foreground text-sm">
            <th className="p-3 text-left font-medium">Pos</th>
            <th className="p-3 text-left font-medium">Team</th>
            <th className="p-3 text-center font-medium">P</th>
            <th className="p-3 text-center font-medium">W</th>
            <th className="p-3 text-center font-medium">D</th>
            <th className="p-3 text-center font-medium">L</th>
            <th className="p-3 text-right font-medium">Pts</th>
          </tr>
        </thead>
        <tbody>
          {leagueTable.map((team, index) => (
            <motion.tr
              key={team.position}
              className={`border-t border-border ${
                team.team === "Trojans RFC" ? "bg-primary/10" : ""
              } hover:bg-muted/30 transition-colors`}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <td className="p-3">
                <span className={`font-bold ${
                  team.position <= 3 ? "text-trojan-gold" : 
                  team.position >= 7 ? "text-accent" : "text-foreground"
                }`}>
                  {team.position}
                </span>
              </td>
              <td className="p-3 font-medium text-foreground">
                {team.team === "Trojans RFC" ? (
                  <span className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-primary-foreground text-xs font-bold">T</span>
                    </span>
                    {team.team}
                  </span>
                ) : (
                  team.team
                )}
              </td>
              <td className="p-3 text-center text-muted-foreground">{team.played}</td>
              <td className="p-3 text-center text-primary font-medium">{team.won}</td>
              <td className="p-3 text-center text-muted-foreground">{team.drawn}</td>
              <td className="p-3 text-center text-accent font-medium">{team.lost}</td>
              <td className="p-3 text-right font-bold text-foreground">{team.points}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeagueTable;