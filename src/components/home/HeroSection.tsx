import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { HERO_BG } from "@/lib/images";

const SERVICE_PILLS = [
  { label: "Interior Detail", to: "/services" },
  { label: "Exterior Detail", to: "/services" },
  { label: "Ceramic Coating", to: "/services" },
  { label: "Full Detail", to: "/services" },
];

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
        style={{ backgroundImage: `url(${HERO_BG})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background/90" />

      {/* Content */}
      <div className="relative z-10 container text-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* AI_START_HERO_EYEBROW */}
          <span className="text-primary font-body text-sm uppercase tracking-[0.3em] font-bold mb-4 block">
            Premium Mobile Detailing
          </span>
          {/* AI_END_HERO_EYEBROW */}
          {/* AI_START_HERO_HEADLINE */}
          <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-foreground tracking-tight leading-[0.95] mb-4">
            Your Car,
            <br />
            <span className="text-primary">Our Obsession</span>
          </h1>
          {/* AI_END_HERO_HEADLINE */}
          {/* AI_START_HERO_SUBTITLE */}
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-8 font-body">
            Sacramento's trusted mobile detailing service. We come to you — anywhere, anytime — and leave your ride looking showroom fresh.
          </p>
          {/* AI_END_HERO_SUBTITLE */}
          <Link
            to="/s/appointments"
            className="inline-flex border border-primary text-primary font-body text-sm md:text-base font-bold uppercase tracking-widest px-6 py-3 rounded-none hover:bg-primary hover:text-primary-foreground transition-all duration-300 mb-6"
          >
            First-time clients get $25 off
          </Link>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link
              to="/s/appointments"
              className="bg-primary text-primary-foreground font-body font-bold text-sm uppercase tracking-widest px-10 py-4 rounded-none hover:bg-primary/90 transition-all duration-300"
            >
              Book Now
            </Link>
            <Link
              to="/services"
              className="border border-foreground/20 text-foreground font-body font-bold text-sm uppercase tracking-widest px-10 py-4 rounded-none hover:bg-foreground/5 transition-all duration-300"
            >
              View Services
            </Link>
          </div>

          {/* Service quick-links */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {SERVICE_PILLS.map((pill) => (
              <Link
                key={pill.label}
                to={pill.to}
                className="border border-foreground/20 text-foreground/70 font-body text-xs uppercase tracking-widest px-4 py-2 rounded-none hover:border-primary hover:text-primary transition-all duration-300"
              >
                {pill.label}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
