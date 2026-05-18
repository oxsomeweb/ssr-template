import { motion } from "framer-motion";

import { PORTFOLIO_1, PORTFOLIO_2 } from "@/lib/images";

const images = [PORTFOLIO_1, PORTFOLIO_2];

const PortfolioSection = () => {
  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
            See Our Work
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {images.map((src, i) => (
            <motion.div
              key={i}
              className="aspect-[4/3] rounded-lg overflow-hidden group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <img
                src={src}
                alt={`Drippy Suds detailing work ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
