import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

const PageHero = ({ title, subtitle, backgroundImage, ctaLabel, ctaHref }: PageHeroProps) => {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background image with lazy loading */}
      {backgroundImage && (
        <img
          src={backgroundImage}
          alt=""
          aria-hidden="true"
          loading="eager"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />
      )}
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-background/75" />

      <div className="container relative z-10 text-center">
        <motion.h1
          className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {subtitle}
          </motion.p>
        )}
        {ctaLabel && ctaHref && (
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            <Link
              to={ctaHref}
              className="inline-flex items-center justify-center rounded-none bg-primary px-6 py-3 font-bold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {ctaLabel}
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default PageHero;
