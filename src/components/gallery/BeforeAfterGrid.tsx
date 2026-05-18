import { useState } from "react";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { GALLERY } from "@/lib/images";

interface CompareItem {
  before: string;
  after: string;
  label: string;
}

const comparisons: CompareItem[] = [
  { before: GALLERY.compareSedanBefore, after: GALLERY.compareSedanAfter, label: "Full Exterior Detail" },
  { before: GALLERY.compareSuvBefore, after: GALLERY.compareSuvAfter, label: "SUV Wash & Wax" },
  { before: GALLERY.compareSportsBefore, after: GALLERY.compareSportsAfter, label: "Paint Correction" },
  { before: GALLERY.compareInteriorBefore, after: GALLERY.compareInteriorAfter, label: "Interior Deep Clean" },
  { before: GALLERY.beforeFloor, after: GALLERY.afterFloor, label: "Floor Mat Revival" },
  { before: GALLERY.stainBefore, after: GALLERY.interiorClean, label: "Stain Removal" },
];

const CompareCard = ({ item, index }: { item: CompareItem; index: number }) => {
  const [showAfter, setShowAfter] = useState(false);
  const isMobile = useIsMobile();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-50px" }}
      className="relative aspect-[3/2] rounded-xl overflow-hidden cursor-pointer group"
      onMouseEnter={() => !isMobile && setShowAfter(true)}
      onMouseLeave={() => !isMobile && setShowAfter(false)}
      onClick={() => isMobile && setShowAfter((p) => !p)}
    >
      <img
        src={item.before}
        alt={`Before: ${item.label}`}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
        width={960}
        height={640}
      />
      <img
        src={item.after}
        alt={`After: ${item.label}`}
        className="absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
        style={{ opacity: showAfter ? 1 : 0 }}
        loading="lazy"
        width={960}
        height={640}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent pointer-events-none" />
      <div
        className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md transition-all duration-400 ${
          showAfter
            ? "bg-primary/90 text-primary-foreground"
            : "bg-background/80 text-foreground border border-foreground/10"
        }`}
      >
        {showAfter ? "After" : "Before"}
      </div>
      <div className="absolute bottom-4 left-4 right-4">
        <p className="text-foreground font-heading font-bold text-lg drop-shadow-lg">
          {item.label}
        </p>
        <p className="text-muted-foreground text-xs mt-0.5">
          {isMobile ? "Tap to compare" : "Hover to reveal"}
        </p>
      </div>
    </motion.div>
  );
};

const BeforeAfterGrid = () => {
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
          <span className="text-primary font-body text-sm uppercase tracking-[0.3em] font-bold mb-4 block">
            Transformations
          </span>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
            Hover to See the Magic
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Each card shows a real transformation. Hover over any image to instantly reveal the after — the results speak for themselves.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {comparisons.map((item, i) => (
            <CompareCard key={item.label} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BeforeAfterGrid;
