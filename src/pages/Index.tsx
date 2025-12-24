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

// Import hero images
import heroSlide1 from "@/assets/hero-slide-1.jpg";
import heroSlide2 from "@/assets/hero-slide-2.jpg";
import heroSlide3 from "@/assets/hero-slide-3.jpg";
import heroSlide4 from "@/assets/hero-slide-4.jpg";
import heroSlide5 from "@/assets/hero-slide-5.jpg";
import steveOdongo from "@/assets/steve-odongo.jpg";
import jere9 from "@/assets/jere9.jpg";
import bradley from "@/assets/Bradley-Thomas.jpg";

interface TeamMember {
  id: number;
  name: string;
  position: string;
  number: string;
  image: string;
  category: string;
}

interface NewsItem {
  id: number;
  date: string;
  title: string;
  description: string;
  image: string;
}

const slides = [
  {
    id: 1,
    title: "Champions of Murang'a",
    description:
      "Celebrating our victorious team with the BingwaFest Championship trophy and 250,000 KES prize!",
    image: heroSlide1,
  },
  {
    id: 2,
    title: "Power in the Scrum",
    description:
      "Watch our forwards dominate with raw power and perfect technique in every breakdown.",
    image: heroSlide2,
  },
  {
    id: 3,
    title: "Speed & Agility",
    description:
      "Our backs break through defenses with lightning speed and exceptional ball handling.",
    image: heroSlide3,
  },
  {
    id: 4,
    title: "TROJAN TUKO SAWA MUNGU",
    description:
      "Brotherhood, teamwork, and unwavering commitment define the Trojans spirit.",
    image: heroSlide4,
  },
  {
    id: 5,
    title: "Rising to Victory",
    description:
      "Dominating lineouts and aerial battles - excellence in every aspect of the game.",
    image: heroSlide5,
  },
];

const initialTeamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Andre Obure",
    position: "Prop",
    number: "1",
    image: "@/assets/Telegram Desktop/team.jpg",
    category: "Forwards",
  },
  {
    id: 2,
    name: "Steve Odongo",
    position: "Hooker",
    number: "2",
    image: steveOdongo,
    category: "Forwards",
  },
  {
    id: 3,
    name: "Anyega Newton",
    position: "Prop",
    number: "3",
    image: "@/assets/Telegram Desktop/team.jpg",
    category: "Forwards",
  },
  {
    id: 4,
    name: "Waraba Isaac",
    position: "Lock",
    number: "4",
    image: "@/assets/Telegram Desktop/team.jpg",
    category: "Forwards",
  },
  {
    id: 9,
    name: "Bradley Thomas",
    position: "Lock",
    number: "5",
    image: bradley,
    category: "Forwards",
  },
  {
    id: 6,
    name: "David Mwangi",
    position: "Flanker",
    number: "6",
    image: "@/assets/Telegram Desktop/team.jpg",
    category: "Forwards",
  },
  {
    id: 7,
    name: "Samuel Ochieng",
    position: "Flanker",
    number: "7",
    image: "@/assets/Telegram Desktop/team.jpg",
    category: "Forwards",
  },
  {
    id: 8,
    name: "Michael Otieno",
    position: "Number 8",
    number: "8",
    image: "@/assets/Telegram Desktop/team.jpg",
    category: "Forwards",
  },
  {
    id: 5,
    name: "Peter Wanjiku",
    position: "Lock",
    number: "9",
    image: "@/assets/Telegram Desktop/team.jpg",
    category: "Forwards",
  },
  {
    id: 13,
    name: "Player 12",
    position: "Fly-Half",
    number: "10",
    image: "@/assets/Telegram Desktop/photo_2025-12-23_13-59-05.jpg",
    category: "Backs",
  },
  {
    id: 14,
    name: "Player 13",
    position: "Wing",
    number: "11",
    image: "@/assets/Telegram Desktop/photo_2025-12-23_13-59-07.jpg",
    category: "Backs",
  },
  {
    id: 15,
    name: "Player 14",
    position: "Centre",
    number: "12",
    image: "@/assets/Telegram Desktop/photo_2025-12-23_13-59-08.jpg",
    category: "Backs",
  },
  {
    id: 16,
    name: "Player 15",
    position: "Centre",
    number: "13",
    image: "@/assets/Telegram Desktop/photo_2025-12-23_13-59-10.jpg",
    category: "Backs",
  },
  {
    id: 17,
    name: "Player 16",
    position: "Wing",
    number: "14",
    image: "@/assets/Telegram Desktop/photo_2025-12-23_13-59-11.jpg",
    category: "Backs",
  },
  {
    id: 18,
    name: "Player 17",
    position: "Fullback",
    number: "15",
    image: "@/assets/Telegram Desktop/photo_2025-12-23_13-59-26.jpg",
    category: "Backs",
  },
  {
    id: 10,
    name: "Kelvin Xavier",
    position: "Head Coach",
    number: "",
    image: "@/assets/Telegram Desktop/team.jpg",
    category: "Staff",
  },
  {
    id: 11,
    name: "Ivy Nduta",
    position: "Manager",
    number: "",
    image: "@/assets/Telegram Desktop/team.jpg",
    category: "Staff",
  },
  {
    id: 12,
    name: "Faith Wavinya",
    position: "Physio",
    number: "",
    image: "@/assets/Telegram Desktop/team.jpg",
    category: "Staff",
  },
];

const initialNewsItems: NewsItem[] = [
  {
    id: 1,
    date: "21. DECEMBER 2025",
    title: "Trojans Win BingwaFest Kenya Championship!",
    description:
      "Historic victory at BingwaFest Kenya with 250,000 KES prize money! Our team showed exceptional skill and determination throughout the tournament.",
    image: heroSlide4,
  },
  {
    id: 2,
    date: "21. DECEMBER 2025",
    title: "New Players Join the Squad",
    description:
      "We welcome three talented new players to the Trojans family! Fresh talent ready to make their mark on the field.",
    image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&q=80",
  },
  {
    id: 3,
    date: "21. DECEMBER 2025",
    title: "BingwaFest Kenya - Road to Finals",
    description:
      "Relive our incredible journey through the BingwaFest Kenya tournament. From group stages to the grand finale!",
    image: jere9,
  },
  {
    id: 4,
    date: "10. DECEMBER 2024",
    title: "Youth Academy Opens Enrollment",
    description:
      "Join our youth development program and train with the best coaches in Central Kenya. Ages 8-18 welcome!",
    image: "https://images.unsplash.com/photo-1512719994953-eabf50895df7?w=600&q=80",
  },
  {
    id: 5,
    date: "21. DECEMBER 2025",
    title: "Trojans Win BingwaFest Kenya Championship!",
    description:
      "Historic victory at BingwaFest Kenya with 250,000 KES prize money! Our team showed exceptional skill and determination throughout the tournament.",
    image: heroSlide4,
  },
];

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Partial<TeamMember> | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [newsItems, setNewsItems] = useState<NewsItem[]>(initialNewsItems);

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

      <AdminDashboard
        isOpen={showAdminDashboard}
        onClose={() => setShowAdminDashboard(false)}
        teamMembers={teamMembers}
        newsItems={newsItems}
        onUpdateTeamMembers={setTeamMembers}
        onUpdateNewsItems={setNewsItems}
      />
    </div>
  );
};

export default Index;
