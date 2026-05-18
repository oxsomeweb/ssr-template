import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";
import { GALLERY } from "@/lib/images";

type Category = "all" | "interior" | "exterior" | "before-after";

interface GalleryImage {
  src: string;
  alt: string;
  category: Category[];
  span?: string;
}

const galleryImages: GalleryImage[] = [
  {
    src: GALLERY.exteriorRed,
    alt: "Red luxury car with gleaming exterior detail",
    category: ["exterior"],
    span: "md:col-span-2 md:row-span-2",
  },
  {
    src: GALLERY.interiorDark,
    alt: "Deep cleaned dark interior with pristine dashboard",
    category: ["exterior"],
  },
  {
    src: GALLERY.interiorClean,
    alt: "Interior deep cleaning and conditioning",
    category: ["interior", "before-after"],
  },
  {
    src: GALLERY.exteriorWhite,
    alt: "White vehicle exterior after premium wash",
    category: ["exterior"],
  },
  {
    src: GALLERY.premiumWash,
    alt: "Showroom finish after premium wash service",
    category: ["exterior", "before-after"],
    span: "md:col-span-2",
  },
  {
    src: GALLERY.waxFinish,
    alt: "Mirror-like wax finish on vehicle paint",
    category: ["exterior", "before-after"],
  },
  {
    src: GALLERY.batMobileWax,
    alt: "Fresh wax application with deep gloss finish",
    category: ["exterior"],
  },
  {
    src: GALLERY.ceramicCoating,
    alt: "Ceramic coating with water beads on glossy black paint",
    category: ["exterior"],
  },
  {
    src: GALLERY.stainBefore,
    alt: "Before: stain removal transformation",
    category: ["interior", "before-after"],
  },
  {
    src: GALLERY.fallInLove,
    alt: "Fall in love with your car again — full exterior detail",
    category: ["exterior"],
  },
  {
    src: GALLERY.wheelDetail,
    alt: "Gleaming chrome wheel after professional detailing",
    category: ["exterior"],
  },
  {
    src: GALLERY.exteriorSuv,
    alt: "SUV exterior detailing with ceramic shine",
    category: ["exterior"],
    span: "md:col-span-2",
  },
  {
    src: GALLERY.exteriorSedan,
    alt: "Sedan after complete exterior detail package",
    category: ["exterior"],
  },
  {
    src: GALLERY.beforeFloor,
    alt: "Before: dirty car floor mat with debris and crumbs",
    category: ["interior", "before-after"],
  },
  {
    src: GALLERY.afterFloor,
    alt: "After: pristine clean car floor mat after deep cleaning",
    category: ["interior", "before-after"],
  },
  {
    src: GALLERY.exteriorSedanDark,
    alt: "Dark sedan with showroom-quality exterior finish",
    category: ["exterior"],
  },
];

const filters: { label: string; value: Category }[] = [
  { label: "All", value: "all" },
  { label: "Interior", value: "interior" },
  { label: "Exterior", value: "exterior" },
  { label: "Before & After", value: "before-after" },
];

const GallerySection = () => {
  const [activeFilter, setActiveFilter] = useState<Category>("all");
  const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null);

  const filtered =
    activeFilter === "all"
      ? galleryImages
      : galleryImages.filter((img) => img.category.includes(activeFilter));

  return (
    <section id="gallery" className="py-24 md:py-32 bg-card">
      <div className="container">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <span className="text-primary font-body text-sm uppercase tracking-[0.3em] font-bold mb-4 block">
            Our Portfolio
          </span>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
            See the Drippy Difference
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Every vehicle tells a story. Here's what happens when luxury meets meticulous care.
          </p>
        </motion.div>

        <div className="flex items-center justify-center gap-2 mb-12 flex-wrap">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                activeFilter === f.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[280px]">
          <AnimatePresence mode="popLayout">
            {filtered.map((img) => (
              <motion.div
                key={img.src}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className={`relative group cursor-pointer rounded-lg overflow-hidden ${img.span || ""}`}
                onClick={() => setLightboxImage(img)}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-background/0 group-hover:bg-background/40 transition-all duration-300 flex items-center justify-center">
                  <ZoomIn className="w-8 h-8 text-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-lg flex items-center justify-center p-4"
            onClick={() => setLightboxImage(null)}
          >
            <button
              className="absolute top-6 right-6 text-foreground hover:text-primary transition-colors z-10"
              onClick={() => setLightboxImage(null)}
            >
              <X className="w-8 h-8" />
            </button>
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              src={lightboxImage.src}
              alt={lightboxImage.alt}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default GallerySection;
