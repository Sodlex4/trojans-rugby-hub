import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Trophy } from "lucide-react";
import { getLeagueTable, type LeagueTeam } from "@/lib/auth";

const LeagueTable = () => {
  const [leagueTable, setLeagueTable] = useState<LeagueTeam[]>([]);

  useEffect(() => {
    const fetchTable = async () => {
      const data = await getLeagueTable();
      setLeagueTable(data);
    };
    fetchTable();
  }, []);

  if (leagueTable.length === 0) {
    return <p className="text-center text-muted-foreground py-8">League table not available yet.</p>;
  }

  return (
    <div className="bg-card rounded-xl overflow-hidden border border-border">
      <div className="p-4 bg-primary/10 border-b border-border">
        <div className="flex items-center gap-2">
          <Trophy className="text-trojan-gold" size={20} />
          <h3 className="font-bold text-foreground">Central Kenya Rugby League</h3>
        </div>
      </div>

      {/* Mobile Card Layout */}
      <div className="block md:hidden divide-y divide-border">
        {leagueTable.map((team, index) => (
          <motion.div
            key={team.position}
            className={`p-4 ${
              team.team === "Murang'a Trojans" ? "bg-primary/10" : ""
            }`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={`font-bold text-lg ${
                  team.position <= 3 ? "text-trojan-gold" :
                  team.position >= 7 ? "text-accent" : "text-foreground"
                }`}>
                  {team.position}
                </span>
                <span className="font-medium text-foreground">
                  {team.team === "Murang'a Trojans" ? (
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-primary-foreground text-xs font-bold">T</span>
                      </span>
                      {team.team}
                    </span>
                  ) : (
                    team.team
                  )}
                </span>
              </div>
              <span className="font-bold text-lg text-foreground">{team.totalPoints || 0} pts</span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-sm text-muted-foreground">
              <span>P: {team.played || 0}</span>
              <span>W: {team.won || 0}</span>
              <span>D: {team.drawn || 0}</span>
              <span>L: {team.lost || 0}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50 text-muted-foreground text-sm">
              <th className="p-3 text-left font-medium">Pos</th>
              <th className="p-3 text-left font-medium">Team</th>
              <th className="p-3 text-center font-medium">P</th>
              <th className="p-3 text-center font-medium">W</th>
              <th className="p-3 text-center font-medium">D</th>
              <th className="p-3 text-center font-medium">L</th>
              <th className="p-3 text-center font-medium">PF</th>
              <th className="p-3 text-center font-medium">PA</th>
              <th className="p-3 text-center font-medium">PD</th>
              <th className="p-3 text-center font-medium">BP</th>
              <th className="p-3 text-right font-medium">Pts</th>
            </tr>
          </thead>
          <tbody>
            {leagueTable.map((team, index) => (
              <motion.tr
                key={team.position}
                className={`border-t border-border ${
                  team.team === "Murang'a Trojans" ? "bg-primary/10" : ""
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
                  {team.team === "Murang'a Trojans" ? (
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
                <td className="p-3 text-center text-muted-foreground">{team.played || 0}</td>
                <td className="p-3 text-center text-primary font-medium">{team.won || 0}</td>
                <td className="p-3 text-center text-muted-foreground">{team.drawn || 0}</td>
                <td className="p-3 text-center text-accent font-medium">{team.lost || 0}</td>
                <td className="p-3 text-center text-muted-foreground">{team.pointsFor || 0}</td>
                <td className="p-3 text-center text-muted-foreground">{team.pointsAgainst || 0}</td>
                <td className="p-3 text-center text-muted-foreground">{team.pointsDifference || 0}</td>
                <td className="p-3 text-center text-muted-foreground">{team.bonusPoints || 0}</td>
                <td className="p-3 text-right font-bold text-foreground">{team.totalPoints || 0}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeagueTable;