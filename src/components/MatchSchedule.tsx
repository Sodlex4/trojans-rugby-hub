import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, Trophy } from "lucide-react";
import { matches, getUpcomingMatches, type Match } from "@/data/matches";

interface MatchScheduleProps {
  showAll?: boolean;
}

const MatchSchedule = ({ showAll = false }: MatchScheduleProps) => {
  const displayMatches = showAll ? getUpcomingMatches() : getUpcomingMatches().slice(0, 3);

  return (
    <div className="space-y-4">
      {displayMatches.map((match, index) => (
        <motion.div
          key={match.id}
          className="bg-card rounded-xl p-5 border border-border hover:border-primary/30 transition-all hover:shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <div className="flex items-center justify-between">
            {/* Competition Badge */}
            <div className="flex items-center gap-2 mb-3">
              <Trophy size={14} className="text-trojan-gold" />
              <span className="text-xs font-semibold text-trojan-gold uppercase tracking-wider">
                {match.competition}
              </span>
            </div>
            
            {/* Date & Time */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {match.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {match.time}
              </span>
            </div>
          </div>

           {/* Match Teams - Mobile: Stack vertically, Desktop: horizontal */}
           <div className="mt-3">
             {/* Mobile Layout */}
             <div className="block sm:hidden space-y-3">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                     <span className="text-primary-foreground font-bold text-base">T</span>
                   </div>
                   <div>
                     <p className="font-bold text-foreground text-sm">Trojans RFC</p>
                     <p className="text-xs text-muted-foreground">Murang'a</p>
                   </div>
                 </div>
                 <div className="text-center">
                   <span className="text-xl font-bold text-muted-foreground">VS</span>
                 </div>
                 <div className="flex items-center gap-3">
                   <div className="text-right">
                     <p className="font-bold text-foreground text-sm">{match.opponent}</p>
                   </div>
                   <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                     <img src={match.opponentLogo} alt={match.opponent} className="w-full h-full object-cover" />
                   </div>
                 </div>
               </div>
               <p className="text-center text-xs text-muted-foreground">{match.isHome ? "HOME" : "AWAY"}</p>
             </div>

             {/* Desktop Layout */}
             <div className="hidden sm:flex items-center justify-between">
               <div className="flex items-center gap-3">
                 <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                   <span className="text-primary-foreground font-bold text-lg">T</span>
                 </div>
                 <div>
                   <p className="font-bold text-foreground">Trojans RFC</p>
                   <p className="text-xs text-muted-foreground">Murang'a</p>
                 </div>
               </div>
               <div className="text-center px-4">
                 <span className="text-2xl font-bold text-muted-foreground">VS</span>
                 <p className="text-xs text-muted-foreground mt-1">{match.isHome ? "HOME" : "AWAY"}</p>
               </div>
               <div className="flex items-center gap-3">
                 <div className="text-right">
                   <p className="font-bold text-foreground">{match.opponent}</p>
                   <p className="text-xs text-muted-foreground">{match.opponent.replace("RFC", "").trim()}</p>
                 </div>
                 <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                   <img src={match.opponentLogo} alt={match.opponent} className="w-full h-full object-cover" />
                 </div>
               </div>
             </div>
           </div>

          {/* Venue */}
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
            <MapPin size={14} className="text-primary" />
            <span className="text-sm text-muted-foreground">{match.venue}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default MatchSchedule;