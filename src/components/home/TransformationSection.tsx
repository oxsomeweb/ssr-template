import { useState, useRef, useEffect, useCallback } from "react";
import { motion, useInView, useSpring, useMotionValue } from "framer-motion";
import { BEFORE_DETAIL, AFTER_DETAIL } from "@/lib/images";

const beforeImg = BEFORE_DETAIL;
const afterImg = AFTER_DETAIL;

const TransformationSection = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [pos, setPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const rawPos = useMotionValue(50);
  const springPos = useSpring(rawPos, { stiffness: 300, damping: 30, mass: 0.5 });

  // Subscribe to spring changes
  useEffect(() => {
    const unsub = springPos.on("change", (v) => setPos(v));
    return unsub;
  }, [springPos]);

  // Auto-animate reveal on first view
  useEffect(() => {
    if (!isInView || hasInteracted) return;
    const timeout = setTimeout(() => {
      rawPos.set(25);
      setTimeout(() => rawPos.set(75), 600);
      setTimeout(() => rawPos.set(50), 1200);
    }, 400);
    return () => clearTimeout(timeout);
  }, [isInView, hasInteracted, rawPos]);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    rawPos.set((x / rect.width) * 100);
    if (!hasInteracted) setHasInteracted(true);
  }, [rawPos, hasInteracted]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    setIsDragging(true);
    setHasInteracted(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    handleMove(e.clientX);
  }, [handleMove]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  }, [isDragging, handleMove]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const containerWidth = containerRef.current?.offsetWidth || 1000;

  return (
    <section ref={sectionRef} className="py-24 md:py-32 bg-background">
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
            The Proof Is in the Shine
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Drag the slider to see the dramatic transformation. Every detail matters, and the results speak for themselves.
          </p>
        </motion.div>

        <motion.div
          ref={containerRef}
          className="relative aspect-[16/9] max-w-4xl mx-auto rounded-2xl overflow-hidden cursor-col-resize select-none shadow-2xl ring-1 ring-foreground/10"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {/* After (full background) */}
          <img
            src={afterImg}
            alt="After detailing"
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />

          {/* Before (clipped by spring-driven pos) */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${pos}%` }}
          >
            <img
              src={beforeImg}
              alt="Before detailing"
              className="absolute inset-0 h-full object-cover"
              style={{ width: `${containerWidth}px`, maxWidth: "none" }}
              draggable={false}
            />
          </div>

          {/* Slider line */}
          <div
            className="absolute top-0 bottom-0 z-10 pointer-events-none"
            style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
          >
            <div className="absolute inset-0 w-[2px] bg-foreground/80 mx-auto" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-foreground shadow-[0_0_20px_rgba(0,0,0,0.3)] flex items-center justify-center transition-transform duration-150 hover:scale-110 active:scale-95">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M8 4L3 11L8 18" stroke="hsl(var(--background))" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14 4L19 11L14 18" stroke="hsl(var(--background))" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Labels */}
          <motion.div
            className="absolute top-5 left-5 z-20"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="bg-background/80 backdrop-blur-md text-foreground text-xs font-bold uppercase tracking-[0.15em] px-4 py-2 rounded-full border border-foreground/10">
              Before
            </div>
          </motion.div>
          <motion.div
            className="absolute top-5 right-5 z-20"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="bg-primary/90 backdrop-blur-md text-primary-foreground text-xs font-bold uppercase tracking-[0.15em] px-4 py-2 rounded-full">
              After
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default TransformationSection;
