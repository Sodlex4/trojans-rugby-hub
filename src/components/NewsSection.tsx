import { motion } from "framer-motion";
import { toast } from "sonner";

interface NewsItem {
  id: number;
  date: string;
  title: string;
  description: string;
  image: string;
  link?: string;
}

interface NewsSectionProps {
  newsItems: NewsItem[];
}

const NewsSection = ({ newsItems }: NewsSectionProps) => {
  return (
    <section id="news" className="py-20 md:py-28 bg-primary scroll-mt-20">
      <div className="container mx-auto px-6">
        {/* Section Title */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-extrabold text-primary-foreground uppercase">
            HOT NEWS
          </h2>
          <div className="w-24 h-1.5 bg-accent mx-auto mt-4" />
        </motion.div>

        {/* News Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map((item, index) => (
            <motion.div
              key={item.id}
              className="bg-card rounded-xl overflow-hidden shadow-card card-hover group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Image */}
              <div className="relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-52 object-cover transition-transform duration-500 
                           group-hover:scale-110"
                />
                {/* Date Badge */}
                <div className="absolute top-4 left-4 bg-accent text-accent-foreground 
                              px-4 py-2 rounded-full text-sm font-bold">
                  {item.date}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-display font-bold text-foreground mb-3
                             group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                
                {/* Read More Link */}
                <motion.button
                  className="mt-4 text-primary font-semibold flex items-center gap-2
                           hover:text-trojan-green-dark transition-colors"
                  whileHover={{ x: 5 }}
                  onClick={() => {
                    if (item.link) {
                      window.open(item.link, "_blank", "noopener,noreferrer");
                    } else {
                      toast.info("Full article coming soon!");
                    }
                  }}
                  aria-label={`Read more about ${item.title}`}
                >
                  Read More
                  <span aria-hidden="true">→</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
