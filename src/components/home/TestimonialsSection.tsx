import { motion } from "framer-motion";
import { Star, Shield } from "lucide-react";
import { reviews } from "@/data/reviews";
import yelpLogo from "@/assets/yelp-logo.png";

type Review = {
  id: string;
  name: string;
  location: string;
  review: string;
  rating: number;
  created_at: string;
  avatar_url: string | null;
  initials: string;
  is_featured: boolean;
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1) return "today";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

const TestimonialsSection = () => {
  return (
    <section
      className="py-24 md:py-32 relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, hsl(220 30% 6%) 0%, hsl(0 0% 0%) 50%, hsl(220 30% 6%) 100%)",
      }}
    >
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full opacity-[0.05] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, hsl(var(--primary)), transparent 70%)" }}
      />

      <div className="container relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <span className="text-primary font-body text-sm uppercase tracking-[0.3em] font-bold mb-4 block">
            Real Reviews
          </span>
          <h2
            className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4"
            style={{ textShadow: "0 0 40px hsl(var(--primary) / 0.15)" }}
          >
            Trusted by Local Car Owners
          </h2>
          <div className="flex items-center justify-center gap-3 mt-6">
            <img src={yelpLogo} alt="Yelp" className="h-6 w-auto" loading="lazy" />
            <span className="text-muted-foreground text-sm font-body">
              5.0 stars · 30+ verified reviews
            </span>
          </div>
        </motion.div>

        <div className="columns-1 md:columns-2 gap-6 space-y-6">
          {reviews.map((t, i) => (
            <motion.div
              key={t.id}
              className={`break-inside-avoid group relative rounded-xl border overflow-hidden transition-all duration-500 hover:-translate-y-1 ${
                t.is_featured ? "border-primary/20 p-10" : "border-white/[0.06] p-7"
              }`}
              style={{
                background: t.is_featured
                  ? "linear-gradient(135deg, hsl(var(--primary) / 0.08), hsl(0 0% 100% / 0.03))"
                  : "linear-gradient(135deg, hsl(0 0% 100% / 0.03), hsl(0 0% 100% / 0.01))",
                backdropFilter: "blur(12px)",
                boxShadow: t.is_featured
                  ? "0 8px 40px hsl(var(--primary) / 0.1), inset 0 1px 0 hsl(0 0% 100% / 0.06)"
                  : "0 4px 30px hsl(0 0% 0% / 0.3), inset 0 1px 0 hsl(0 0% 100% / 0.04)",
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{
                boxShadow: "0 12px 50px hsl(var(--primary) / 0.12), inset 0 1px 0 hsl(0 0% 100% / 0.08)",
              }}
            >
              {/* Header */}
              <div className="flex items-start gap-4 mb-5">
                {t.avatar_url ? (
                  <img
                    src={t.avatar_url}
                    alt={t.name}
                    className="w-11 h-11 rounded-full object-cover flex-shrink-0"
                    loading="lazy"
                  />
                ) : (
                  <div
                    className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-primary-foreground"
                    style={{
                      background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.7))",
                      boxShadow: "0 0 12px hsl(var(--primary) / 0.3)",
                    }}
                  >
                    {t.initials}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-heading font-bold text-foreground text-sm">{t.name}</p>
                  <p className="text-muted-foreground text-xs">
                    {t.location} · {timeAgo(t.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 bg-white/[0.06] border border-white/[0.08] rounded-full px-2.5 py-1 flex-shrink-0">
                  <Shield className="w-3 h-3 text-[#FF1A1A]" />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Yelp
                  </span>
                </div>
              </div>

              {/* Stars */}
              <div className="flex items-center gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-3.5 h-3.5 fill-accent text-accent" />
                ))}
              </div>

              {/* Review text */}
              <p className="text-sm leading-relaxed" style={{ color: "hsl(0 0% 75%)" }}>
                {t.review}
              </p>

              {t.is_featured && (
                <div className="mt-5 pt-4 border-t border-white/[0.06]">
                  <p className="text-xs text-primary/60 font-body uppercase tracking-wider font-bold">
                    ★ Featured Review
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
