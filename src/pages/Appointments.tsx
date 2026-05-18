import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import PageHero from "@/components/PageHero";
import { motion } from "framer-motion";
import { Clock, Phone, Mail, MapPin } from "lucide-react";
import BookingWizard from "@/components/booking/BookingWizard";
import { GALLERY, OG_LOGO } from "@/lib/images";
const heroBg = GALLERY.exteriorSedan;
const LOGO_URL = OG_LOGO;

const servicesJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Drippy Suds Mobile Detailing",
  "telephone": "+19165392062",
  "email": "drippysudsllc@gmail.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "2101 53rd Ave",
    "addressLocality": "Sacramento",
    "addressRegion": "CA",
    "postalCode": "95822",
    "addressCountry": "US",
  },
};

const Appointments = () => {
  return (
    <Layout>
      <SEO
        title="Book an Appointment | Drippy Suds Mobile Detailing"
        description="Book your mobile detailing appointment with Drippy Suds in Sacramento. Interior detail, exterior wash, Drippy Diamond Package, and ceramic coatings."
        canonical="https://drippysuds.com/s/appointments"
        jsonLd={servicesJsonLd}
      />
      <PageHero title="Book an Appointment" subtitle="Schedule your premium mobile detailing service" backgroundImage={heroBg} />
      <section className="py-12 md:py-16 bg-background">
        <div className="container max-w-5xl">

          {/* Contact info bar */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-xs text-muted-foreground mb-10 flex-wrap"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Open until 5:00 pm
            </span>
            <a href="tel:+19165392062" className="flex items-center gap-1.5 hover:text-primary transition-colors">
              <Phone className="w-3.5 h-3.5" />
              +1 916-539-2062
            </a>
            <a href="mailto:drippysudsllc@gmail.com" className="flex items-center gap-1.5 hover:text-primary transition-colors">
              <Mail className="w-3.5 h-3.5" />
              drippysudsllc@gmail.com
            </a>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              2101 53rd Ave, Sacramento, CA 95822
            </span>
          </motion.div>

          {/* Booking Wizard */}
          <BookingWizard />
        </div>
      </section>
    </Layout>
  );
};

export default Appointments;
