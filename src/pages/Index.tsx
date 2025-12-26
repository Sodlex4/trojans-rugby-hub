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
import cliford from "@/assets/clifford-mukaria.jpg"
import MARK from "@/assets/MARK-NGUGI.jpg"
import Elvis from "@/assets/Elvis-Obiero.jpg"
import ANDRE from "@/assets/andre-obure.jpg"
import Anyega from "@/assets/Anyega-NEWTON.jpg" 
import isaac from "@/assets/Isaac-waraba.jpg"
import jeremiah from "@/assets/jeremiah- ogutu.jpg"
import reagan from "@/assets/reagan.jpg"
import Worship from "@/assets/worship.jpg"
import sami from "@/assets/sami.jpg"
import Dennis from "@/assets/Dennis-Otieno.jpg"
import simon from "@/assets/koigi-simon.jpg"
import Brian from "@/assets/Brian-selete.jpg"
import Cornelius from "@/assets/cornelius-Kiptum.jpg"
import Patrick from "@/assets/Patrick-Apiri.jpg"
import Hanish from "@/assets/Hanish-Ochieng.jpg"
import peter from "@/assets/Peter-Mwendwa.jpg"
import Ireri from "@/assets/Ireri-bRIAN.jpg"
import James from "@/assets/James-Waithaka.jpg"
import Samuel from "@/assets/Samuel-Nyanga.jpg"
import Kelvin from"@/assets/Kelvin-Xavier.jpg"




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
    image: ANDRE,
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
    image: Anyega,
    category: "Forwards",
  },
  {
    id: 4,
    name: "Waraba Isaac",
    position: "Lock",
    number: "4",
    image: isaac,
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
    name: "Dennis Otieno",
    position: "Flanker",
    number: "6",
    image: Dennis,
    category: "Forwards",
  },
  {
    id: 7,
    name: "Simon koigi",
    position: "Flanker",
    number: "7",
    image: simon,
    category: "Forwards",
  },
  {
    id: 8,
    name: "Peter Mwendwa",
    position: "wing",
    number: "11",
    image: peter,
    category: "Forwards",
  },
  {
    id: 5,
    name: "Hanish-Ochieng",
    position: "Flanker",
    number: "7",
    image: Hanish,
    category: "Forwards",
  },
  {
    id: 13,
    name: "Corneilius Kiptum",
    position: "centre",
    number: "12",
    image: Cornelius,
    category: "Backs",
  },
  {
    id: 14,
    name: "Clifford Mukuria",
    position: "Wing",
    number: "11",
    image: cliford,
    category: "Backs",
  },
  {
    id: 15,
    name: "MARK NGUGI",
    position: "PROP",
    number: "1",
    image:MARK,
    category: "Forwards",
  },
  {
    id: 16,
    name: "Elvis Obiero",
    position: "Centre",
    number: "13",
    image:Elvis,
    category: "Backs",
  },
  {
    id: 17,
    name: "Patrick Apiri",
    position: "Centre",
    number: "12",
    image: Patrick,
    category: "Backs",
  },
  {
    id: 18,
    name: "Brian-Selete",
    position:"Full-Back",
    number: "15",
    image: Brian,
    category: "Backs",
  },
  {
    id: 10,
    name: "Kelvin Xavier",
    position: "Head Coach",
    number: "",
    image: Kelvin,
    category: "Staff",
  },
  {
    id: 11,
    name: "reagan kamau",
    position: "Manager",
    number: "",
    image: reagan,
    category: "Staff",
  },
  {
    id: 12,
    name:" Worship",
    position: "Physio",
    number: "",
    image:Worship,
    category: "Staff",
  },
  
  {
    id: 19,
    name: "jeremy Ogutu",
    position: "Scrum-Half",
    number: "9",
    image:jeremiah,
    category: "Backs",
  },

{
    id: 20,
    name: "Brian Ireri",
    position: "Wing",
    number: "14",
    image:Ireri,
    category: "Backs",
 },
{
    id: 50,
    name: "James Waithaka",
    position: "Scrum-Half",
    number: "9",
    image:James,
    category: "Backs",
 },
 
 {   id: 49,
    name: "Sam Nyanga",
    position: "Fly-Half",
    number: "10",
    image:Samuel,
    category: "Backs",
 }
 
  

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
    title: "celebrations of tears and joy from Trojans captain Sam ",
    description:
  "From the final whistle to the celebrations that followed, captain Sam’s tears of joy captured the passion, sacrifice, and unity of the Trojans.",
    image: sami,
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
