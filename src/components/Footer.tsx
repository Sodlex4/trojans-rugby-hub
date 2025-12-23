import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";

const roles = ["steve", "frontend", "selftaughtdev", "problemsolver"];

const Footer = () => {
  const textRef = useRef<HTMLSpanElement>(null);
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (textRef.current) {
        // Fade out
        gsap.to(textRef.current, {
          opacity: 0,
          y: -20,
          duration: 0.5,
          ease: "power2.inOut",
          onComplete: () => {
            setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
            // Fade in
            if (textRef.current) {
              gsap.fromTo(
                textRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
              );
            }
          },
        });
      }
    }, 2500);

    return () => clearInterval(interval);
  }, []);

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
          <p className="text-center text-card/40 text-xs mb-6">
            Building Champions • Fostering Community • Celebrating Excellence
          </p>

          {/* GSAP Fading Text */}
          <div className="text-center">
            <p className="text-card/50 text-sm mb-2">Developed by</p>
            <div className="h-10 flex items-center justify-center">
              <span
                ref={textRef}
                className="text-2xl md:text-3xl font-display text-primary tracking-wider"
              >
                {roles[currentRoleIndex]}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
