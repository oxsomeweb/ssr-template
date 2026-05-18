import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import PageHero from "@/components/PageHero";
import ContactSection from "@/components/home/ContactSection";
import { GALLERY, OG_LOGO } from "@/lib/images";
const heroBg = GALLERY.interiorClean;

const contactJsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "name": "Contact Drippy Suds Mobile Detailing",
  "url": "https://drippysuds.com/contact",
  "mainEntity": {
    "@type": "LocalBusiness",
    "name": "Drippy Suds Mobile Detailing",
    "image": OG_LOGO,
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
  },
};

const Contact = () => {
  return (
    <Layout>
      <SEO
        title="Contact Us | Drippy Suds Mobile Detailing Sacramento"
        description="Get in touch with Drippy Suds Mobile Detailing. Call, email, or visit us in Sacramento, CA for premium car detailing services."
        canonical="https://drippysuds.com/contact"
        jsonLd={contactJsonLd}
      />
      <PageHero title="Contact Us" backgroundImage={heroBg} />
      <ContactSection />
    </Layout>
  );
};

export default Contact;
