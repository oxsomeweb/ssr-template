import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { services } from "@/data/services";

const servicePagePaths: Record<string, string> = {
  "Interior Detail Only": "/services/interior-detail",
  "Exterior Wash Only": "/services/exterior-wash",
  "Drippy Diamond Package": "/services/drippy-diamond-package",
  "Ceramic Coatings": "/services/ceramic-coatings",
};

const ServicesPreview = () => {
  return (
    <section className="py-24 md:py-32 bg-card">
      <div className="container">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <span className="text-primary font-body text-sm uppercase tracking-[0.3em] font-bold mb-4 block">
            Our Services
          </span>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
            Premium Detailing Packages
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Every package is designed to deliver showroom-quality results with eco-friendly products and meticulous attention to detail.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.id}
              className="bg-background border border-border rounded-lg p-8 hover:border-primary/40 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-heading text-2xl font-bold text-foreground">
                  {service.title}
                </h3>
                <span className="text-primary font-bold text-lg whitespace-nowrap ml-4">
                  {service.price_label}
                </span>
              </div>
              {service.description && (
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {service.description}
                </p>
              )}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                <span className="text-muted-foreground text-xs">{service.duration}</span>
                <Link
                  to={servicePagePaths[service.title] || "/services"}
                  className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider hover:gap-3 transition-all duration-300"
                >
                  View Service <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest hover:gap-3 transition-all duration-300"
          >
            View All Services <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesPreview;
