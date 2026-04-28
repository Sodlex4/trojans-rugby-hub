import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Trophy, ChevronRight } from "lucide-react";
import MatchSchedule from "./MatchSchedule";
import MatchResults from "./MatchResults";
import LeagueTable from "./LeagueTable";

type TabType = "schedule" | "results" | "table";

const Matches = () => {
  const [activeTab, setActiveTab] = useState<TabType>("schedule");

  const tabs = [
    { id: "schedule", label: "Upcoming", icon: Calendar },
    { id: "results", label: "Results", icon: Trophy },
    { id: "table", label: "Table", icon: Trophy },
  ] as const;

  return (
    <section id="matches" className="py-20 md:py-28 bg-card scroll-mt-20">
      <div className="container mx-auto px-6">
        {/* Section Title */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">MATCHES</h2>
          <div className="section-divider" />
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-muted/50 rounded-xl p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "schedule" && (
            <div className="max-w-3xl mx-auto">
              <MatchSchedule showAll={true} />
            </div>
          )}

          {activeTab === "results" && (
            <div className="max-w-3xl mx-auto">
              <MatchResults />
            </div>
          )}

          {activeTab === "table" && (
            <div className="max-w-2xl mx-auto">
              <LeagueTable />
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Matches;