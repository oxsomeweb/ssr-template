import { motion } from "framer-motion";
import { QUALITY_CAR } from "@/lib/images";

const CAR_IMAGE = QUALITY_CAR;

const QualitySection = () => {
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
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              Feels Like A New Car
            </h2>
            <div className="w-16 h-1 bg-primary mb-8" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative"
          >
            <div className="aspect-[4/3] rounded-lg overflow-hidden">
              <img
                src={CAR_IMAGE}
                alt="Professional car detailing result"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default QualitySection;
