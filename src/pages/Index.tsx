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
import PlayerModal from "@/components/PlayerModal";
import AdminDashboard from "@/components/AdminDashboard";
import ScrollToTop from "@/components/ScrollToTop";
import { teamMembers, type TeamMember } from "@/data/team";
import { newsItems, type NewsItem } from "@/data/news";
import { heroSlides } from "@/data/images";






const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Partial<TeamMember> | null>(null);
  const [teamMembersState, setTeamMembersState] = useState<TeamMember[]>(teamMembers);
  const [newsItemsState, setNewsItemsState] = useState<NewsItem[]>(newsItems);

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleAuth = (admin: boolean) => {
    setIsLoggedIn(true);
    setIsAdmin(admin);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    toast.success("Logged out successfully");
  };

  const handleAddPlayer = () => {
    setEditingPlayer({});
    setShowPlayerModal(true);
  };

  const handleEditPlayer = (player: TeamMember) => {
    setEditingPlayer(player);
    setShowPlayerModal(true);
  };

  const handleDeletePlayer = (id: number) => {
    if (window.confirm("Are you sure you want to delete this player?")) {
      setTeamMembersState(teamMembersState.filter((p) => p.id !== id));
      toast.success("Player deleted successfully");
    }
  };

  const handleSavePlayer = (player: TeamMember) => {
    if (editingPlayer?.id) {
      setTeamMembersState(teamMembersState.map((p) => (p.id === player.id ? player : p)));
    } else {
      setTeamMembersState([...teamMembersState, player]);
    }
    setShowPlayerModal(false);
    setEditingPlayer(null);
  };

  const handleOpenDashboard = () => {
    setShowAdminDashboard(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        onLogin={() => {
          setAuthMode("login");
          setShowAuthModal(true);
        }}
        onLogout={handleLogout}
        onAddPlayer={handleAddPlayer}
        onOpenDashboard={handleOpenDashboard}
        scrollToSection={scrollToSection}
      />

      <HeroSlider
        slides={heroSlides}
        isLoggedIn={isLoggedIn}
        onJoinClick={() => {
          setAuthMode("register");
          setShowAuthModal(true);
        }}
      />

      <AboutSection />

      <TeamSection
        teamMembers={teamMembersState}
        isAdmin={isAdmin}
        onEditPlayer={handleEditPlayer}
        onDeletePlayer={handleDeletePlayer}
      />

      <NewsSection newsItems={newsItemsState} />

      <ContactSection />

      <Footer />

      <ScrollToTop />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuth={handleAuth}
        initialMode={authMode}
      />

      <PlayerModal
        isOpen={showPlayerModal}
        onClose={() => {
          setShowPlayerModal(false);
          setEditingPlayer(null);
        }}
        player={editingPlayer}
        onSave={handleSavePlayer}
        isEditing={!!editingPlayer?.id}
      />

      <AdminDashboard
        isOpen={showAdminDashboard}
        onClose={() => setShowAdminDashboard(false)}
        teamMembers={teamMembersState}
        newsItems={newsItemsState}
        onUpdateTeamMembers={setTeamMembersState}
        onUpdateNewsItems={setNewsItemsState}
      />
    </div>
  );
};

export default Index;
