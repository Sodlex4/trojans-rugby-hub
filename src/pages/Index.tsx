import { useState } from "react";
import { toast } from "sonner";
import Header from "@/components/Header";
import HeroSlider from "@/components/HeroSlider";
import AboutSection from "@/components/AboutSection";
import TeamSection from "@/components/TeamSection";
import NewsSection from "@/components/NewsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import ScrollToTop from "@/components/ScrollToTop";
import { teamMembers, type TeamMember } from "@/data/team";
import { newsItems, type NewsItem } from "@/data/news";
import { heroSlides } from "@/data/images";

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
      <Header
        scrollToSection={scrollToSection}
      />

      <HeroSlider
        slides={heroSlides}
        onJoinClick={() => setShowJoinModal(true)}
      />

      <AboutSection />

      <TeamSection
        teamMembers={teamMembersState}
        onDeletePlayer={handleDeletePlayer}
      />

      <NewsSection newsItems={newsItemsState} />

      <ContactSection />

      <Footer />

      <ScrollToTop />

      <AuthModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
      />
    </div>
  );
};

export default Index;