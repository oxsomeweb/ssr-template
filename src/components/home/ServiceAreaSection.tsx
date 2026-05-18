import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { cityPages } from "@/data/cityPages";

const ServiceAreaSection = () => {
  return (
    <section className="py-24 md:py-32 bg-card">
      <div className="container text-center">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <span className="text-primary font-body text-sm uppercase tracking-[0.3em] font-bold mb-4 block">
            Service Area
          </span>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
            We Cover Greater Sacramento
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Our mobile detailing team serves the entire Sacramento metro area. If you're nearby, we'll come to you.
          </p>
        </motion.div>

        <motion.ul
          className="flex flex-wrap items-center justify-center gap-3 mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {cityPages.map((area) => (
            <li key={area.slug}>
              <Link
                to={`/mobile-detailing-${area.slug}`}
                className="inline-flex items-center gap-1.5 bg-secondary text-muted-foreground text-sm font-body px-4 py-2 rounded-full"
              >
                <MapPin className="w-3.5 h-3.5 text-primary" />
                {area.cityName}
              </Link>
            </li>
          ))}
          {/* AI_CITY_HUB_ANCHOR */}
        </motion.ul>

        <Link
          to="/s/appointments"
          className="inline-block bg-primary text-primary-foreground font-body font-bold text-sm uppercase tracking-widest px-10 py-4 rounded-sm hover:bg-primary/90 transition-all duration-300"
        >
          Book Your Detail Today
        </Link>
      </div>
    </section>
  );
};

export default ServiceAreaSection;
