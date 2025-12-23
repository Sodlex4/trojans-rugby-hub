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

interface TeamMember {
  id: number;
  name: string;
  position: string;
  number: string;
  image: string;
  category: string;
}

const slides = [
  {
    id: 1,
    title: "Champions of Murang'a",
    description:
      "Celebrating our victorious team with the BingwaFest Championship trophy and 250,000 KES prize!",
    image:
      "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=1200&q=80",
  },
  {
    id: 2,
    title: "Join Our Team Today",
    description:
      "Experience the thrill of rugby with Murang'a's finest players",
    image:
      "https://images.unsplash.com/photo-1512719994953-eabf50895df7?w=1200&q=80",
  },
  {
    id: 3,
    title: "Champions in Action",
    description: "Watch our Trojans dominate the field with skill and teamwork",
    image:
      "https://images.unsplash.com/photo-1486286701208-1d58e9338013?w=1200&q=80",
  },
];

const initialTeamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Andre Obure",
    position: "Prop",
    number: "1",
    image:
      "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=400&q=80",
    category: "Forwards",
  },
  {
    id: 2,
    name: "Steve Odongo",
    position: "Hooker",
    number: "2",
    image:
      "https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=400&q=80",
    category: "Forwards",
  },
  {
    id: 3,
    name: "Anyega Newton",
    position: "Prop",
    number: "3",
    image:
      "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400&q=80",
    category: "Forwards",
  },
  {
    id: 4,
    name: "James Kimani",
    position: "Lock",
    number: "4",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    category: "Forwards",
  },
  {
    id: 5,
    name: "Peter Wanjiku",
    position: "Flanker",
    number: "6",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
    category: "Forwards",
  },
  {
    id: 6,
    name: "David Mwangi",
    position: "Scrum-Half",
    number: "9",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    category: "Backs",
  },
  {
    id: 7,
    name: "Samuel Ochieng",
    position: "Fly-Half",
    number: "10",
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80",
    category: "Backs",
  },
  {
    id: 8,
    name: "Michael Otieno",
    position: "Wing",
    number: "11",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80",
    category: "Backs",
  },
];

const newsItems = [
  {
    id: 1,
    date: "21. DECEMBER 2024",
    title: "Trojans Win BingwaFest Championship!",
    description:
      "Historic victory with 250,000 KES prize money! Our team showed exceptional skill and determination throughout the tournament.",
    image:
      "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=600&q=80",
  },
  {
    id: 2,
    date: "15. DECEMBER 2024",
    title: "Youth Academy Opens Enrollment",
    description:
      "Join our youth development program and train with the best coaches in Central Kenya. Ages 8-18 welcome!",
    image:
      "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=600&q=80",
  },
  {
    id: 3,
    date: "10. DECEMBER 2024",
    title: "New Season Preparations Begin",
    description:
      "The team is gearing up for an exciting new season with intensive training sessions and new strategies.",
    image:
      "https://images.unsplash.com/photo-1486286701208-1d58e9338013?w=600&q=80",
  },
];

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Partial<TeamMember> | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);

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
      setTeamMembers(teamMembers.filter((p) => p.id !== id));
      toast.success("Player deleted successfully");
    }
  };

  const handleSavePlayer = (player: TeamMember) => {
    if (editingPlayer?.id) {
      setTeamMembers(teamMembers.map((p) => (p.id === player.id ? player : p)));
    } else {
      setTeamMembers([...teamMembers, player]);
    }
    setShowPlayerModal(false);
    setEditingPlayer(null);
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
        scrollToSection={scrollToSection}
      />

      <HeroSlider
        slides={slides}
        isLoggedIn={isLoggedIn}
        onJoinClick={() => {
          setAuthMode("register");
          setShowAuthModal(true);
        }}
      />

      <AboutSection />

      <TeamSection
        teamMembers={teamMembers}
        isAdmin={isAdmin}
        onEditPlayer={handleEditPlayer}
        onDeletePlayer={handleDeletePlayer}
      />

      <NewsSection newsItems={newsItems} />

      <ContactSection />

      <Footer />

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
    </div>
  );
};

export default Index;
