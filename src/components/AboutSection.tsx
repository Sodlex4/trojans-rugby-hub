import { Trophy, Users, Calendar } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  { icon: Trophy, value: "15+", label: "Trophies" },
  { icon: Users, value: "50+", label: "Players" },
  { icon: Calendar, value: "10+", label: "Years" },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-20 md:py-28 bg-secondary">
      <div className="container mx-auto px-6">
        {/* Section Title */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">ABOUT US</h2>
          <div className="section-divider" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-card">
              <img
                src="https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&q=80"
                alt="Rugby team celebration"
                className="w-full h-auto object-cover"
              />
              {/* Overlay decoration */}
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-accent rounded-xl -z-10" />
            </div>
            {/* Floating badge */}
            <motion.div
              className="absolute -top-6 -right-6 bg-primary text-primary-foreground 
                         p-4 rounded-xl shadow-glow"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Trophy size={32} />
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h3 className="text-3xl md:text-4xl font-display text-foreground mb-6 tracking-wide">
              WELCOME TO TROJANS MURANG'A RUGBY CLUB
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed text-lg">
              We are the pride of Murang'a, dedicated to developing exceptional rugby 
              talent and fostering a community of champions. Our club stands as a 
              beacon of athletic excellence in Central Kenya.
            </p>
            <p className="text-muted-foreground mb-10 leading-relaxed">
              From grassroots development to competitive tournaments, we nurture 
              players who embody the spirit of teamwork, discipline, and 
              sportsmanship that defines true champions.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center p-4 rounded-xl bg-card shadow-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <stat.icon className="mx-auto text-primary mb-2" size={36} />
                  <p className="text-3xl font-display text-foreground">{stat.value}</p>
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
