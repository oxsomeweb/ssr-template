import { motion } from "framer-motion";

import { OG_LOGO } from "@/lib/images";
const LOGO_URL = OG_LOGO;

const BrandingSection = () => {
  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container text-center">
        <motion.img
          src={LOGO_URL}
          alt="Drippy Suds Mobile Detailing"
          className="mx-auto h-48 md:h-64 w-auto mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: "-100px" }}
        />
        <motion.h2
          className="font-heading text-4xl md:text-6xl font-bold text-foreground tracking-tight mb-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          DRIPPY SUDS
        </motion.h2>
        <motion.p
          className="text-muted-foreground text-lg md:text-xl tracking-wide"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          Luxury Mobile Detailing Any Place Any Time
        </motion.p>
      </div>
    </section>
  );
};

export default BrandingSection;
