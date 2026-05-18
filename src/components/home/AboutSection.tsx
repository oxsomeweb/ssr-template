import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ABOUT_TEAM } from "@/lib/images";

const AboutSection = () => {
  return (
    <section className="py-24 md:py-32 bg-card">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <span className="text-primary font-body text-sm uppercase tracking-[0.3em] font-bold mb-4 block">
              Our Story
            </span>
            {/* AI_START_ABOUT_HEADLINE */}
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              Born from a Passion for Cars
            </h2>
            {/* AI_END_ABOUT_HEADLINE */}
            {/* AI_START_ABOUT_BODY */}
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Drippy Suds started with one simple belief: your car deserves the same care and attention you'd give anything you love. What began as a weekend side hustle out of a garage in Sacramento has grown into a trusted name in premium mobile detailing.
              </p>
              <p>
                We're not a car wash. We're detailers — obsessive about the craft, committed to using only the best eco-friendly products, and driven by the satisfaction on our clients' faces when they see their vehicle transformed.
              </p>
              <p>
                Every foam cannon blast, every clay bar pass, every coat of ceramic protection — it's all done with intention. Because the details aren't just details. They're the whole point.
              </p>
            </div>
            {/* AI_END_ABOUT_BODY */}
            <Link
              to="/s/appointments"
              className="inline-block mt-8 bg-primary text-primary-foreground font-body font-bold text-sm uppercase tracking-widest px-8 py-3.5 rounded-sm hover:bg-primary/90 transition-all duration-300"
            >
              Experience the Difference
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-lg overflow-hidden">
              <img
                src={ABOUT_TEAM}
                alt="Drippy Suds team detailing a vehicle"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-6 rounded-lg shadow-lg">
              <p className="font-heading text-3xl font-bold">100%</p>
              <p className="text-sm font-body">Client Satisfaction</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
