import { motion } from "framer-motion";

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
            <h2 className="text-3xl font-display tracking-wider">TROJANS</h2>
            <p className="text-sm tracking-[0.3em] opacity-70">MURANG'A RUGBY CLUB</p>
          </motion.div>

          {/* Links */}
          <motion.div
            className="flex flex-wrap justify-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
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
              >
                {link}
              </button>
            ))}
          </motion.div>

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

        {/* Decorative Line */}
        <motion.div
          className="mt-10 pt-6 border-t border-card/10"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-center text-card/40 text-xs">
            Building Champions • Fostering Community • Celebrating Excellence
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
