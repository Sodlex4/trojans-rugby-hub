import { useEffect, useState } from "react";
import { toast } from "sonner";
import Header from "@/components/Header";
import HeroSlider from "@/components/HeroSlider";
import AboutSection from "@/components/AboutSection";
import TeamSection from "@/components/TeamSection";
import MatchSchedule from "@/components/MatchSchedule";
import MatchResults from "@/components/MatchResults";
import LeagueTable from "@/components/LeagueTable";
import PlayerStats from "@/components/PlayerStats";
import NewsSection from "@/components/NewsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import ScrollToTop from "@/components/ScrollToTop";
import { teamMembers, type TeamMember } from "@/data/team";
import { newsItems, type NewsItem } from "@/data/news";
import { heroSlides } from "@/data/images";
import { Calendar, Trophy } from "lucide-react";
import { getMatches as getStoredMatches, getPlayerStats as getStoredStats } from "@/lib/auth";
import { motion } from "framer-motion";

const MatchesSection = () => {
  const [activeTab, setActiveTab] = useState<"schedule" | "results" | "table">("schedule");
  const [matches, setMatches] = useState<any[]>([]);
  
  useEffect(() => { setMatches(getStoredMatches()); }, []);
  
  const upcoming = matches.filter(m => m.status === "scheduled").slice(0, 4);
  const pastResults = matches.filter(m => m.status === "completed").slice(0, 4);

  return (
    <section id="matches" className="py-20 md:py-28 bg-card scroll-mt-20">
      <div className="container mx-auto px-6">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="section-title">MATCHES</h2>
          <div className="section-divider" />
        </motion.div>
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-muted/50 rounded-xl p-1">
            {(["schedule", "results", "table"] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${activeTab === tab ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
                {tab === "schedule" ? <Calendar size={18} /> : <Trophy size={18} />} {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {activeTab === "schedule" && <div className="max-w-3xl mx-auto"><MatchSchedule showAll={false} /></div>}
          {activeTab === "results" && <div className="max-w-3xl mx-auto"><MatchResults /></div>}
          {activeTab === "table" && <div className="max-w-2xl mx-auto"><LeagueTable /></div>}
        </motion.div>
      </div>
    </section>
  );
};

const Index = () => {
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [teamMembersState, setTeamMembersState] = useState<TeamMember[]>(teamMembers);
  const [newsItemsState, setNewsItemsState] = useState<NewsItem[]>(newsItems);

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDeletePlayer = (id: number) => {
    if (window.confirm("Are you sure you want to delete this player?")) {
      setTeamMembersState(teamMembersState.filter((p) => p.id !== id));
      toast.success("Player deleted successfully");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header scrollToSection={scrollToSection} />
      
      {/* Home Section */}
      <section id="home">
        <HeroSlider slides={heroSlides} onJoinClick={() => setShowJoinModal(true)} />
      </section>
      
      {/* About Section */}
      <section id="about">
        <AboutSection />
      </section>
      
      {/* Team Section */}
      <section id="team">
        <TeamSection teamMembers={teamMembersState} onDeletePlayer={handleDeletePlayer} />
      </section>
      
      {/* Matches Section - already has id="matches" in MatchesSection component */}
      <MatchesSection />
      
      {/* Stats Section - now has id="stats" in PlayerStats component */}
      <PlayerStats />
      
      {/* News Section */}
      <section id="news">
        <NewsSection newsItems={newsItemsState} />
      </section>
      
      {/* Contact Section */}
      <section id="contact">
        <ContactSection />
      </section>
      
      <Footer />
      <ScrollToTop />
      <AuthModal isOpen={showJoinModal} onClose={() => setShowJoinModal(false)} />
    </div>
  );
};

export default Index;