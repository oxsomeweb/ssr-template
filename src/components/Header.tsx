import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import { LOGO } from "@/lib/images";
const logo = LOGO;

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
];

const SERVICE_LINKS = [
  { to: "/services/interior-detail", label: "Interior Detail" },
  { to: "/services/exterior-wash", label: "Exterior Wash" },
  { to: "/services/drippy-diamond-package", label: "Drippy Diamond" },
  { to: "/services/ceramic-coatings", label: "Ceramic Coatings" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="container flex items-center justify-between h-24">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Drippy Suds" className="h-20 w-auto" />
          <span className="font-heading text-lg font-semibold tracking-tight text-foreground hidden sm:block">
            Drippy Suds<br />
            <span className="text-sm font-normal text-muted-foreground">Mobile Detailing</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <div className="group relative pb-1">
            <Link
              to="/services"
              className={`flex items-center gap-1 text-sm font-bold uppercase tracking-widest transition-colors relative pb-1 ${
                isActive("/services")
                  ? "text-primary border-b-2 border-primary"
                  : "text-foreground hover:text-primary"
              }`}
            >
              Services
              <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" aria-hidden="true" />
            </Link>
            <div className="invisible absolute left-0 top-full z-50 min-w-64 border border-border bg-background/95 py-3 opacity-0 shadow-xl backdrop-blur-md transition-all duration-200 group-hover:visible group-hover:opacity-100">
              <Link to="/services" className="block px-4 py-2 text-sm font-bold uppercase tracking-widest text-foreground transition-colors hover:text-primary">
                All Services
              </Link>
              {SERVICE_LINKS.map((service) => (
                <Link key={service.to} to={service.to} className="block px-4 py-2 text-sm font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary">
                  {service.label}
                </Link>
              ))}
            </div>
          </div>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-bold uppercase tracking-widest transition-colors relative pb-1 ${
                isActive(link.to)
                  ? "text-primary border-b-2 border-primary"
                  : "text-foreground hover:text-primary"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/s/appointments"
            className="bg-primary text-primary-foreground font-bold text-sm uppercase tracking-widest px-6 py-2.5 rounded-none hover:bg-primary/90 transition-all duration-300"
          >
            Book Now
          </Link>
        </nav>

        <div className="flex items-center gap-4 md:hidden">
          <Link
            to="/s/appointments"
            className="bg-primary text-primary-foreground font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-none"
          >
            Book
          </Link>
          <button
            className="text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-background border-t border-border animate-fade-in">
          <nav className="container flex flex-col gap-4 py-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`text-sm font-bold uppercase tracking-widest transition-colors ${
                  isActive(link.to)
                    ? "text-primary"
                    : "text-foreground hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-l border-border pl-4">
              <Link
                to="/services"
                onClick={() => setMobileOpen(false)}
                className={`text-sm font-bold uppercase tracking-widest transition-colors ${
                  isActive("/services") ? "text-primary" : "text-foreground hover:text-primary"
                }`}
              >
                Services
              </Link>
              <div className="mt-3 flex flex-col gap-3 pl-4">
                {SERVICE_LINKS.map((service) => (
                  <Link
                    key={service.to}
                    to={service.to}
                    onClick={() => setMobileOpen(false)}
                    className="text-sm font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
                  >
                    {service.label}
                  </Link>
                ))}
              </div>
            </div>
            <Link to="/s/appointments" onClick={() => setMobileOpen(false)} className="text-sm font-bold uppercase tracking-widest text-foreground hover:text-primary transition-colors">Book an Appointment</Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
