import { motion } from "framer-motion";
import { Trophy, Star, Target, Shield, User } from "lucide-react";
import { playerStats, getTopScorers, getTopTackers, getTopTryScorers } from "@/data/stats";

const PlayerStats = () => {
  const topScorers = getTopScorers();
  const topTackers = getTopTackers();
  const topTryScorers = getTopTryScorers();

  const StatCard = ({ title, icon: Icon, data, color }: { title: string; icon: any; data: any[]; color: string }) => (
    <div className="bg-card rounded-xl p-4 border border-border">
      <div className={`flex items-center gap-2 mb-3 ${color}`}>
        <Icon size={18} />
        <h4 className="font-semibold text-foreground">{title}</h4>
      </div>
      <div className="space-y-2">
        {data.map((player, index) => (
          <motion.div
            key={player.id}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                index === 0 ? "bg-trojan-gold text-black" :
                index === 1 ? "bg-muted text-foreground" :
                index === 2 ? "bg-accent text-white" :
                "bg-muted/50 text-muted-foreground"
              }`}>
                {index + 1}
              </span>
              <span className="font-medium text-foreground text-sm">{player.name}</span>
            </div>
            <span className="font-bold text-foreground">{player.points || player.tackles || player.tries}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <section id="stats" className="py-20 md:py-28 bg-muted/30 scroll-mt-20">
      <div className="container mx-auto px-6">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="section-title">PLAYER STATS</h2>
          <div className="section-divider" />
        </motion.div>
        
        <div className="space-y-6">
          {/* Overall Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div
              className="bg-primary/10 rounded-xl p-4 border border-primary/20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="text-primary" size={20} />
                <span className="text-sm text-muted-foreground">Total Points</span>
              </div>
              <p className="text-3xl font-bold text-foreground">
                {playerStats.reduce((a, b) => a + b.points, 0)}
              </p>
            </motion.div>
            
            <motion.div
              className="bg-trojan-gold/10 rounded-xl p-4 border border-trojan-gold/20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Target className="text-trojan-gold-dark" size={20} />
                <span className="text-sm text-muted-foreground">Total Tries</span>
              </div>
              <p className="text-3xl font-bold text-foreground">
                {playerStats.reduce((a, b) => a + b.tries, 0)}
              </p>
            </motion.div>
            
            <motion.div
              className="bg-trojan-green/10 rounded-xl p-4 border border-trojan-green/20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Shield className="text-trojan-green-dark" size={20} />
                <span className="text-sm text-muted-foreground">Total Tackles</span>
              </div>
              <p className="text-3xl font-bold text-foreground">
                {playerStats.reduce((a, b) => a + b.tackles, 0)}
              </p>
            </motion.div>
            
            <motion.div
              className="bg-accent/10 rounded-xl p-4 border border-accent/20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Star className="text-accent" size={20} />
                <span className="text-sm text-muted-foreground">Man of Match</span>
              </div>
              <p className="text-3xl font-bold text-foreground">
                {playerStats.reduce((a, b) => a + b.manOfMatch, 0)}
              </p>
            </motion.div>
          </div>
          
          {/* Top Lists */}
          <div className="grid md:grid-cols-3 gap-4">
            <StatCard title="Top Point Scorers" icon={Trophy} data={topScorers} color="text-primary" />
            <StatCard title="Top Try Scorers" icon={Target} data={topTryScorers} color="text-trojan-gold" />
            <StatCard title="Top Tacklers" icon={Shield} data={topTackers} color="text-trojan-green-dark" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlayerStats;