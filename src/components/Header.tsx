import { useState } from "react";
import { Menu, X, LogOut, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface HeaderProps {
  isLoggedIn: boolean;
  isAdmin: boolean;
  onLogin: () => void;
  onLogout: () => void;
  onAddPlayer: () => void;
  scrollToSection: (section: string) => void;
}

const Header = ({
  isLoggedIn,
  isAdmin,
  onLogin,
  onLogout,
  onAddPlayer,
  scrollToSection,
}: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = ["home", "about", "team", "news", "contact"];

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
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-primary-foreground">
              <h1 className="text-3xl md:text-4xl font-display tracking-wider">TROJANS</h1>
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

            {!isLoggedIn ? (
              <motion.button
                onClick={onLogin}
                className="bg-accent text-accent-foreground px-6 py-2 rounded-full font-bold
                         hover:bg-trojan-red-dark transition-all duration-300 shadow-button"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                JOIN US
              </motion.button>
            ) : (
              <div className="flex items-center gap-4">
                {isAdmin && (
                  <motion.button
                    onClick={onAddPlayer}
                    className="bg-trojan-gold text-foreground px-4 py-2 rounded-full font-bold
                             hover:opacity-90 transition-all duration-300 flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Plus size={16} />
                    Add Player
                  </motion.button>
                )}
                <motion.button
                  onClick={onLogout}
                  className="bg-accent text-accent-foreground px-4 py-2 rounded-full font-bold
                           hover:bg-trojan-red-dark transition-all duration-300 flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LogOut size={16} />
                  Logout
                </motion.button>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-primary-foreground p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
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
              {!isLoggedIn ? (
                <button
                  onClick={onLogin}
                  className="bg-accent text-accent-foreground px-6 py-2 rounded-full font-bold
                           hover:bg-trojan-red-dark transition-all duration-300 w-fit"
                >
                  JOIN US
                </button>
              ) : (
                <button
                  onClick={onLogout}
                  className="bg-accent text-accent-foreground px-6 py-2 rounded-full font-bold
                           hover:bg-trojan-red-dark transition-all duration-300 flex items-center gap-2 w-fit"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              )}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
