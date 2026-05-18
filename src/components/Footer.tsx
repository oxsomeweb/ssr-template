import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Instagram } from "lucide-react";
import { LOGO } from "@/lib/images";
import { cityPages } from "@/data/cityPages";
const logo = LOGO;

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <img src={logo} alt="Drippy Suds" className="h-28 w-auto self-start" />
            <img
              src="/apple-touch-icon.png"
              alt=""
              width={1}
              height={1}
              style={{ opacity: 0.01, pointerEvents: 'none', position: 'absolute' }}
              aria-hidden="true"
            />
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Luxury Mobile Detailing — Any Place, Any Time.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://www.facebook.com/profile.php?id=61583284144373" target="_blank" rel="noopener noreferrer" className="text-[#1877F2] hover:opacity-80 transition-opacity" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/_drippy_suds/" target="_blank" rel="noopener noreferrer" className="text-[#E4405F] hover:opacity-80 transition-opacity" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.yelp.com/biz/drippy-suds-mobile-detailing-sacramento" target="_blank" rel="noopener noreferrer" className="text-[#FF1A1A] hover:opacity-80 transition-opacity" aria-label="Yelp">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12.271 6.727c-.234.647-.455 1.262-.666 1.845-.211.583-.3 1.078-.266 1.486.034.408.227.686.578.836.352.15.758.133 1.219-.05.46-.184 1.002-.502 1.625-.953l2.648-1.93c.367-.266.607-.53.719-.792.112-.261.094-.514-.055-.758a3.615 3.615 0 0 0-.672-.797 8.467 8.467 0 0 0-.875-.727c-.32-.222-.66-.42-1.023-.594-.362-.174-.706-.3-1.031-.375-.326-.075-.606-.064-.844.033-.237.098-.393.312-.468.645-.075.332-.218.767-.43 1.305l-.459 1.126Zm-1.64 5.758c-.3-.25-.676-.364-1.126-.34-.45.023-.984.176-1.601.46l-2.625 1.196c-.392.183-.664.39-.813.617-.15.228-.172.484-.063.766.108.283.303.59.586.923.282.332.621.654 1.015.968.395.313.81.585 1.243.813.434.228.843.38 1.227.453.383.074.7.035.953-.117.253-.152.402-.444.445-.879l.29-3.258c.042-.517-.005-.937-.14-1.259a1.152 1.152 0 0 0-.391-.343Zm2.093-1.046c.234.158.519.224.852.196.332-.03.637-.128.914-.297a2.06 2.06 0 0 0 .68-.648c.173-.264.247-.553.218-.867l-.327-3.258c-.05-.467-.183-.81-.399-1.032-.216-.221-.493-.312-.832-.273-.338.04-.706.184-1.101.434-.396.25-.82.566-1.274.95l-2.586 2.163c-.358.3-.574.594-.648.883-.075.29-.005.558.21.805.215.246.547.453.993.617.447.164.933.247 1.461.247.262 0 .509-.017.742-.05.192-.028.34-.05.445-.07h.152c.183 0 .334.053.453.156l.047.044Zm-2.18 2.516c-.234-.283-.547-.445-.938-.484-.391-.04-.82.058-1.289.293l-2.578 1.258c-.383.192-.642.41-.774.656-.133.247-.137.504-.012.774.125.27.345.554.66.851.315.298.684.578 1.106.844.421.265.856.484 1.304.656.45.172.86.262 1.227.27.368.008.664-.095.89-.31.227-.215.336-.558.329-1.031l-.07-3.282c-.017-.533-.113-.945-.29-1.234a1.157 1.157 0 0 0-.564-.26Z"/></svg>
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-3">
            <h4 className="font-heading text-lg font-semibold text-foreground mb-2">Quick Links</h4>
            <Link to="/" className="text-muted-foreground hover:text-primary transition-colors text-sm">Home</Link>
            <Link to="/services" className="text-muted-foreground hover:text-primary transition-colors text-sm">Services</Link>
            <Link to="/services/interior-detail" className="text-muted-foreground hover:text-primary transition-colors text-xs pl-2">Interior Detail</Link>
            <Link to="/services/exterior-wash" className="text-muted-foreground hover:text-primary transition-colors text-xs pl-2">Exterior Wash</Link>
            <Link to="/services/drippy-diamond-package" className="text-muted-foreground hover:text-primary transition-colors text-xs pl-2">Drippy Diamond</Link>
            <Link to="/services/ceramic-coatings" className="text-muted-foreground hover:text-primary transition-colors text-xs pl-2">Ceramic Coatings</Link>
            <Link to="/gallery" className="text-muted-foreground hover:text-primary transition-colors text-sm">Gallery</Link>
            <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors text-sm">Contact</Link>
            <Link to="/s/appointments" className="text-muted-foreground hover:text-primary transition-colors text-sm">Book an Appointment</Link>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <h4 className="font-heading text-lg font-semibold text-foreground mb-2">Contact Us</h4>
            <a href="mailto:Drippysudsllc@gmail.com" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm">
              <Mail className="w-4 h-4" />
              Drippysudsllc@gmail.com
            </a>
            <a href="tel:9165074802" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm">
              <Phone className="w-4 h-4" />
              (916) 507-4802
            </a>
          </div>

          {/* Service Area */}
          <div className="flex flex-col gap-3">
            <h4 className="font-heading text-lg font-semibold text-foreground mb-2">Service Area</h4>
            <div className="flex flex-wrap gap-2">
              {cityPages.map((area) => (
                <Link
                  key={area.slug}
                  to={`/mobile-detailing-${area.slug}`}
                  className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors text-xs"
                >
                  <MapPin className="w-3 h-3 text-primary" />
                  {area.cityName}
                </Link>
              ))}
              {/* AI_CITY_HUB_ANCHOR */}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col items-center gap-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
            <p className="text-muted-foreground text-xs">
              © {new Date().getFullYear()} Drippy Suds Mobile Detailing. All rights reserved.
            </p>
            <div className="flex items-center gap-3 text-muted-foreground text-xs">
              <span>Drippy Suds • 2101 53rd Ave SACRAMENTO, CA 95822</span>
            </div>
          </div>
          <a href="https://oxsome.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors text-xs">
            Built by Oxsome
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
