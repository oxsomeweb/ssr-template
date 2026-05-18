import { motion } from "framer-motion";
import { Car, Leaf, Sparkles, ShieldCheck, Clock, ThumbsUp } from "lucide-react";

const props = [
  {
    icon: Car,
    title: "We Come to You",
    description: "No drop-offs, no waiting rooms. We bring the full detailing studio to your driveway, office, or anywhere you need us.",
  },
  {
    icon: Leaf,
    title: "Eco-Friendly Products",
    description: "Premium, biodegradable cleaning solutions that protect your vehicle and the environment without compromise.",
  },
  {
    icon: Sparkles,
    title: "Showroom-Quality Finish",
    description: "Every vehicle leaves looking like it just rolled off the showroom floor — gleaming paint, pristine interior, every detail perfect.",
  },
  {
    icon: ShieldCheck,
    title: "Deep Interior & Exterior Care",
    description: "From leather conditioning to paint correction, we address every surface with professional-grade tools and techniques.",
  },
  {
    icon: Clock,
    title: "Time-Saving Service",
    description: "Reclaim your weekend. We handle the detail work while you focus on what matters — your time is valuable.",
  },
  {
    icon: ThumbsUp,
    title: "Satisfaction Guaranteed",
    description: "If you're not completely satisfied, we'll make it right. Your car deserves perfection — and we stand behind every detail.",
  },
];

const WhyChooseSection = () => {
  return (
    <section
      className="py-28 md:py-36 relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, hsl(220 30% 6%) 0%, hsl(0 0% 0%) 50%, hsl(220 30% 6%) 100%)",
      }}
    >
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-[0.07]"
        style={{ background: "radial-gradient(ellipse, hsl(var(--primary)), transparent 70%)" }}
      />

      <div className="container relative z-10">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* AI_START_WHY_EYEBROW */}
          <span className="text-primary font-body text-sm uppercase tracking-[0.3em] font-bold mb-5 block">
            The Drippy Difference
          </span>
          {/* AI_END_WHY_EYEBROW */}
          {/* AI_START_WHY_HEADLINE */}
          <h2
            className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground"
            style={{ textShadow: "0 0 40px hsl(var(--primary) / 0.15)" }}
          >
            Why Choose Drippy Suds
          </h2>
          {/* AI_END_WHY_HEADLINE */}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {props.map((prop, i) => (
            <motion.div
              key={prop.title}
              className="group relative text-center p-8 md:p-10 rounded-xl border border-white/[0.06] overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-primary/20"
              style={{
                background: "linear-gradient(135deg, hsl(0 0% 100% / 0.03), hsl(0 0% 100% / 0.01))",
                backdropFilter: "blur(12px)",
                boxShadow: "0 4px 30px hsl(0 0% 0% / 0.3), inset 0 1px 0 hsl(0 0% 100% / 0.04)",
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              {/* Hover shine sweep */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{
                  background: "linear-gradient(105deg, transparent 40%, hsl(0 0% 100% / 0.04) 45%, hsl(0 0% 100% / 0.06) 50%, hsl(0 0% 100% / 0.04) 55%, transparent 60%)",
                  animation: "shineSweep 1.5s ease-in-out",
                }}
              />

              {/* Hover glow behind card */}
              <div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ boxShadow: "0 8px 40px hsl(var(--primary) / 0.12), 0 0 60px hsl(var(--primary) / 0.05)" }}
              />

              <div className="relative z-10">
                <div
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-8 transition-all duration-500 group-hover:scale-110"
                  style={{
                    background: "radial-gradient(circle, hsl(var(--primary) / 0.15), hsl(var(--primary) / 0.05))",
                    boxShadow: "0 0 20px hsl(var(--primary) / 0.1), inset 0 0 10px hsl(var(--primary) / 0.05)",
                  }}
                >
                  <prop.icon
                    className="w-7 h-7 text-primary transition-all duration-500"
                    style={{ filter: "drop-shadow(0 0 6px hsl(var(--primary) / 0.4))" }}
                  />
                </div>
                <h3
                  className="font-heading text-xl font-bold text-foreground mb-4 transition-all duration-300"
                  style={{ textShadow: "0 0 20px hsl(var(--primary) / 0.08)" }}
                >
                  {prop.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-[280px] mx-auto" style={{ color: "hsl(0 0% 72%)" }}>
                  {prop.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes shineSweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </section>
  );
};

export default WhyChooseSection;
