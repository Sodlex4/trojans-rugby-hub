import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "./ThemeToggle";

interface HeaderProps {
  isLoggedIn?: boolean;
  isAdmin?: boolean;
  onLogin?: () => void;
  onLogout?: () => void;
  scrollToSection: (section: string) => void;
}

const Header = ({
  isLoggedIn,
  isAdmin,
  onLogin,
  onLogout,
  scrollToSection,
}: HeaderProps) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = ["home", "about", "team", "matches", "stats", "news", "contact"];

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
            <img src="/logo.jpg" alt="Trojans Logo" className="h-12 w-12 rounded-full object-cover" />
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
                className="btn-nav uppercase"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {item}
              </motion.button>
            ))}

            <ThemeToggle />

            {isAdmin && (
              <motion.button
                onClick={() => navigate("/admin")}
                className="btn-secondary flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LayoutDashboard size={16} />
                Dashboard
              </motion.button>
            )}
            {isLoggedIn && (
              <motion.button
                onClick={onLogout}
                className="btn-accent flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut size={16} />
                Logout
              </motion.button>
            )}
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
            <motion.nav
              className="md:hidden mt-4 pb-4 flex flex-col gap-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => handleNavClick(item)}
                  className="text-primary-foreground font-semibold text-left uppercase tracking-wide
                           hover:text-trojan-gold transition-colors"
                >
                  {item}
                </button>
              ))}

              <div className="flex items-center gap-4 pt-2 border-t border-primary-foreground/20">
                <ThemeToggle />
                <span className="text-primary-foreground/70 text-sm">Toggle theme</span>
              </div>

              {!isLoggedIn ? (
                <button
                  onClick={() => {
                    onLogin();
                    setMobileMenuOpen(false);
                  }}
                  className="btn-accent w-fit"
                >
                  JOIN US
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  {isAdmin && (
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
                  )}
                  <button
                    onClick={() => {
                      onLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="btn-accent flex items-center gap-2 w-fit"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
