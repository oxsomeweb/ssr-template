import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import HeroSection from "@/components/home/HeroSection";
import TrustBar from "@/components/home/TrustBar";
import ServicesPreview from "@/components/home/ServicesPreview";
import WhyChooseSection from "@/components/home/WhyChooseSection";
import GalleryPreview from "@/components/home/GalleryPreview";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import AboutSection from "@/components/home/AboutSection";
import PaymentMethodsSection from "@/components/home/PaymentMethodsSection";
import TransformationSection from "@/components/home/TransformationSection";
import AIPreviewSection from "@/components/home/AIPreviewSection";
import ServiceAreaSection from "@/components/home/ServiceAreaSection";
import { OG_LOGO } from "@/lib/images";

const homeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Drippy Suds Mobile Detailing",
    "image": OG_LOGO,
    "logo": OG_LOGO,
    "url": "https://drippysuds.com",
    "telephone": "+19165392062",
    "email": "drippysudsllc@gmail.com",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "2101 53rd Ave",
      "addressLocality": "Sacramento",
      "addressRegion": "CA",
      "postalCode": "95822",
      "addressCountry": "US",
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 38.5382,
      "longitude": -121.4930,
    },
    "areaServed": [
      "Sacramento", "Elk Grove", "Rancho Cordova", "Natomas", "Folsom",
      "Roseville", "Citrus Heights", "West Sacramento", "Carmichael",
      "Fair Oaks", "Arden-Arcade", "North Highlands",
    ],
    "sameAs": [],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Drippy Suds Mobile Detailing",
    "url": "https://drippysuds.com",
  },
]
};

const Index = () => {
  return (
    <Layout>
      <SEO
        title="Drippy Suds Mobile Detailing | Premium Car Detailing Sacramento, CA"
        description="Luxury mobile car detailing in Sacramento, CA. Eco-friendly interior & exterior detailing, ceramic coatings, and showroom-quality results. Book your appointment today."
        canonical="https://drippysuds.com"
        jsonLd={homeJsonLd}
      />
      <HeroSection />
      <TrustBar />
      <ServicesPreview />
      <HowItWorksSection />
      <TransformationSection />
      <WhyChooseSection />
      <GalleryPreview />
      <AIPreviewSection />
      <TestimonialsSection />
      <AboutSection />
      <ServiceAreaSection />
      <PaymentMethodsSection />
    </Layout>
  );
};

export default Index;
