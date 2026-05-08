import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import { getSiteLogo } from "@/lib/auth";

interface HeaderProps {
  scrollToSection: (section: string) => void;
}

const navItems = ["home", "about", "team", "matches", "stats", "news", "contact"];

const Header = ({ scrollToSection }: HeaderProps) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoSrc, setLogoSrc] = useState<string>("/logo.jpg");
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    getSiteLogo().then(setLogoSrc);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );

    navItems.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleNavClick = (section: string) => {
    scrollToSection(section);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => scrollToSection("home")}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img src={logoSrc} alt="Trojans Logo" className="h-12 w-12 rounded-full object-cover" />
            <div className="text-primary-foreground">
              <h1 className="text-2xl md:text-3xl font-display font-extrabold uppercase">TROJANS</h1>
              <p className="text-sm tracking-[0.3em] opacity-90">MURANG'A</p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item, index) => (
              <motion.button
                key={item}
                onClick={() => handleNavClick(item)}
                className={`btn-nav uppercase relative ${
                  activeSection === item ? "text-trojan-gold" : ""
                }`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {item}
                {activeSection === item && (
                  <motion.span
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-trojan-gold rounded-full"
                    layoutId="activeSection"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}

            <ThemeToggle />

            <motion.button
              onClick={() => navigate("/admin")}
              className="btn-secondary flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <LayoutDashboard size={16} />
              Dashboard
            </motion.button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-primary-foreground p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, maxHeight: 0 }}
              animate={{ opacity: 1, maxHeight: 600 }}
              exit={{ opacity: 0, maxHeight: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden overflow-hidden"
            >
              <nav className="mt-4 pb-4 flex flex-col gap-4">
                {navItems.map((item) => (
                  <button
                    key={item}
                    onClick={() => handleNavClick(item)}
                    className={`text-primary-foreground font-semibold text-left uppercase tracking-wide
                               hover:text-trojan-gold transition-colors py-3 px-4 w-full ${
                      activeSection === item ? "text-trojan-gold" : ""
                    }`}
                  >
                    {item}
                  </button>
                ))}

                <div className="flex items-center gap-4 pt-2 border-t border-primary-foreground/20">
                  <ThemeToggle />
                  <span className="text-primary-foreground/70 text-sm">Toggle theme</span>
                </div>

                <button
                  onClick={() => {
                    navigate("/admin");
                    setMobileMenuOpen(false);
                  }}
                  className="btn-secondary flex items-center gap-2 w-fit"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
