import { motion } from "framer-motion";
import { CalendarCheck, MapPin, Sparkles } from "lucide-react";

const steps = [
  {
    icon: CalendarCheck,
    number: "01",
    title: "Book Your Service",
    description: "Choose your detailing package and pick a date and time that works for you. It takes less than two minutes.",
  },
  {
    icon: MapPin,
    number: "02",
    title: "We Come to You",
    description: "Our fully-equipped mobile unit arrives at your location — home, office, or wherever your vehicle is parked.",
  },
  {
    icon: Sparkles,
    number: "03",
    title: "Enjoy the Results",
    description: "Sit back while we transform your vehicle. When we're done, you'll think it just rolled off the lot.",
  },
];

const HowItWorksSection = () => {
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
            Simple Process
          </span>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground">
            How It Works
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-16 left-[16.6%] right-[16.6%] h-px bg-border" />

          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              className="relative text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-background border-2 border-primary mb-6 z-10">
                <step.icon className="w-8 h-8 text-primary" />
              </div>
              <div className="text-primary font-body text-xs font-bold tracking-[0.3em] mb-2">
                STEP {step.number}
              </div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-3">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
