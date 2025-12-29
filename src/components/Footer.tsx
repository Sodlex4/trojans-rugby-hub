import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram, Code2 } from "lucide-react";

const socialLinks = [
  { icon: Facebook, label: "Facebook", href: "https://facebook.com/trojansrugby" },
  { icon: Twitter, label: "Twitter", href: "https://twitter.com/trojansrugby" },
  { icon: Instagram, label: "Instagram", href: "https://instagram.com/trojansrugby" },
];

const Footer = () => {

  return (
    <footer className="bg-foreground text-card py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-display font-extrabold uppercase">TROJANS</h2>
            <p className="text-sm tracking-[0.3em] opacity-70">MURANG'A RUGBY CLUB</p>
          </motion.div>

          {/* Links */}
          <motion.nav
            className="flex flex-wrap justify-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            aria-label="Footer navigation"
          >
            {["Home", "About", "Team", "News", "Contact"].map((link) => (
              <button
                key={link}
                onClick={() =>
                  document
                    .getElementById(link.toLowerCase())
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="text-card/70 hover:text-card transition-colors font-medium"
                aria-label={`Navigate to ${link} section`}
              >
                {link}
              </button>
            ))}
          </motion.nav>

          {/* Copyright */}
          <motion.div
            className="text-right md:text-right text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-card/70 text-sm">
              © {new Date().getFullYear()} Trojans Murang'a RFC
            </p>
            <p className="text-card/50 text-xs mt-1">
              Champions of Central Kenya
            </p>
          </motion.div>
        </div>

        {/* Social Links */}
        <motion.div
          className="mt-8 pt-6 border-t border-card/10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex justify-center gap-4 mb-6">
            {socialLinks.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-card/50 hover:text-primary transition-colors duration-300"
                whileHover={{ scale: 1.2, y: -2 }}
                whileTap={{ scale: 0.9 }}
                aria-label={`Follow us on ${social.label}`}
              >
                <social.icon size={24} />
              </motion.a>
            ))}
          </div>

          <p className="text-center text-card/40 text-xs">
            Building Champions • Fostering Community • Celebrating Excellence
          </p>

          {/* Developer Attribution */}
          <motion.div
            className="mt-6 pt-4 border-t border-card/5 flex items-center justify-center gap-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Code2 size={14} className="text-card/30" />
            <p className="text-card/30 text-xs">
              Crafted by{" "}
              <a
                href="https://github.com/Sodlex4"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors font-medium"
              >
                Steve Odongo
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
