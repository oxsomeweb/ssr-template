import { motion } from "framer-motion";

const SEOContentSection = () => {
  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-8">
            Sacramento's Trusted Mobile Car Detailing Service
          </h2>
          <div className="prose prose-invert prose-sm max-w-none text-muted-foreground leading-relaxed space-y-4">
            <p>
              Finding a reliable mobile car detailing service in Sacramento shouldn't mean sacrificing quality for convenience. At Drippy Suds Mobile Detailing, we bring professional-grade interior and exterior detailing directly to your home, office, or wherever your vehicle happens to be. No more sitting in waiting rooms at the car wash. No more settling for a quick rinse that barely scratches the surface.
            </p>
            <p>
              Our interior detailing goes well beyond vacuuming. We deep-clean carpets and upholstery, condition leather surfaces, sanitize high-touch areas, and restore dashboards and trim to their original luster. If your car has been through spills, pet hair, or just months of daily use, we'll bring it back to that new-car feeling you thought was gone for good.
            </p>
            <p>
              On the exterior side, our hand-wash process uses pH-balanced, biodegradable products that are tough on dirt but gentle on your paint. We follow up with clay bar treatment, machine polishing where needed, and protective sealants or ceramic coatings that keep your vehicle looking sharp for months. Every wheel, every tire, every trim piece gets individual attention because half-measures aren't in our vocabulary.
            </p>
            <p>
              Eco-friendly car cleaning isn't just a tagline for us — it's how we operate. All of our cleaning solutions are biodegradable and water-efficient, which means you get a spotless vehicle without the environmental footprint of traditional detailing shops. We serve clients throughout the Sacramento area, including Elk Grove, Rancho Cordova, Natomas, Folsom, and Roseville, making premium detailing accessible no matter where you are in the region.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SEOContentSection;
