import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative min-h-screen flex flex-col bg-background text-foreground font-body selection:bg-primary selection:text-primary-foreground">
      {/* Ambient electric backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <div className="absolute inset-0 bg-grid bg-grid-fade opacity-40" />
        <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-primary/20 blur-[140px]" />
        <div className="absolute -bottom-60 -right-40 h-[640px] w-[640px] rounded-full bg-primary/10 blur-[160px]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      </div>

      {/* Marquee ticker */}
      <div className="relative z-30 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="overflow-hidden">
          <div className="marquee-track py-2 font-mono text-[11px] uppercase tracking-widest text-foreground/70">
            {Array.from({ length: 2 }).map((_, group) => (
              <div key={group} className="flex shrink-0 items-center gap-10 pr-10">
                <span className="flex items-center gap-2">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" />
                  Mobile Detailing • Sacramento · Elk Grove · Folsom · Roseville
                </span>
                <span className="text-primary">◆</span>
                <span>Booking 7 Days a Week</span>
                <span className="text-primary">◆</span>
                <span>Ceramic · Interior · Exterior · Diamond Package</span>
                <span className="text-primary">◆</span>
                <span>We Come To You</span>
                <span className="text-primary">◆</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Header />

      <main className="relative z-10 flex-1 pt-20">{children}</main>

      <Footer />
    </div>
  );
};

export default Layout;
