import { Link, Navigate, useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { cityPages } from "@/data/cityPages";
import { servicePages } from "@/data/servicePages";
import type { CityPageData } from "@/data/types";
import { GALLERY } from "@/lib/images";
import { motion } from "framer-motion";
import { MapPin, Phone, CheckCircle, Star, ChevronRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const benefits = [
  "Fully Mobile — We Come to You",
  "Eco-Friendly, Biodegradable Products",
  "Professional-Grade Equipment",
  "Satisfaction Guaranteed",
];

type CityData = CityPageData & {
  name: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  subtitle: string;
  introParagraph: string;
  localAnchor1: string;
  localAnchor2: string;
  accordionContent: string;
  featuredService: string;
  featuredServiceDesc: string;
  galleryImages: string[];
  climateHook: string;
  heroImage: string;
  layoutVariant: number;
};

const galleryImages = [GALLERY.interiorClean, GALLERY.premiumWash, GALLERY.exteriorSedan, GALLERY.ceramicCoating];

const toCityData = (entry: CityPageData): CityData => ({
  ...entry,
  name: entry.cityName,
  metaTitle: entry.seoTitle,
  metaDescription: entry.seoDescription,
  h1: entry.heroTitle,
  subtitle: entry.introParagraphs[0] || entry.seoDescription,
  introParagraph: entry.introParagraphs[0] || entry.seoDescription,
  localAnchor1: `Mobile detailing service for ${entry.cityName} homes, offices, and local neighborhoods.`,
  localAnchor2: `Serving ${entry.cityName} with interior, exterior, and ceramic coating appointments.`,
  accordionContent: entry.introParagraphs[1] || entry.introParagraphs[0] || entry.seoDescription,
  featuredService: `Mobile Detailing in ${entry.cityName}`,
  featuredServiceDesc: entry.seoDescription,
  galleryImages,
  climateHook: entry.introParagraphs[1] || entry.introParagraphs[0] || entry.seoDescription,
  heroImage: GALLERY.exteriorSedan,
  layoutVariant: (cityPages.findIndex((city) => city.slug === entry.slug) % 4) + 1,
});

// Layout variants determine block ordering for 50%+ uniqueness
const LayoutVariant1 = ({ city }: { city: CityData }) => (
  <>
    <IntroBlock city={city} />
    <FeaturedServiceBlock city={city} />
    <GalleryBlock city={city} />
    <ClimateBlock city={city} />
    <ServicesInCityBlock city={city} />
    <FAQBlock city={city} />
    <CTABlock city={city} />
  </>
);

const LayoutVariant2 = ({ city }: { city: CityData }) => (
  <>
    <FeaturedServiceBlock city={city} />
    <IntroBlock city={city} />
    <ClimateBlock city={city} />
    <GalleryBlock city={city} />
    <ServicesInCityBlock city={city} />
    <CTABlock city={city} />
    <FAQBlock city={city} />
  </>
);

const LayoutVariant3 = ({ city }: { city: CityData }) => (
  <>
    <ClimateBlock city={city} />
    <GalleryBlock city={city} />
    <IntroBlock city={city} />
    <FAQBlock city={city} />
    <ServicesInCityBlock city={city} />
    <FeaturedServiceBlock city={city} />
    <CTABlock city={city} />
  </>
);

const LayoutVariant4 = ({ city }: { city: CityData }) => (
  <>
    <GalleryBlock city={city} />
    <FeaturedServiceBlock city={city} />
    <ClimateBlock city={city} />
    <IntroBlock city={city} />
    <ServicesInCityBlock city={city} />
    <CTABlock city={city} />
    <FAQBlock city={city} />
  </>
);

// === Content Blocks ===

const IntroBlock = ({ city }: { city: CityData }) => (
  <section className="py-16 md:py-24 bg-background">
    <div className="container max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
          Why {city.name} Chooses Drippy Suds
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed mb-6">
          {city.introParagraph}
        </p>
        <div className="flex items-start gap-2 text-muted-foreground text-sm mb-2">
          <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
          <span>{city.localAnchor1}</span>
        </div>
        <div className="flex items-start gap-2 text-muted-foreground text-sm">
          <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
          <span>{city.localAnchor2}</span>
        </div>

        <div className="mt-10 border-l-2 border-primary pl-6">
          <h3 className="font-heading text-2xl font-bold text-foreground mb-4">
            Our {city.name} Detailing Process
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            {city.accordionContent}
          </p>
        </div>
      </motion.div>
    </div>
  </section>
);

const FeaturedServiceBlock = ({ city }: { city: CityData }) => (
  <section className="py-16 md:py-24 bg-card">
    <div className="container max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <span className="text-primary font-body text-sm uppercase tracking-[0.3em] font-bold mb-4 block">
          Featured in {city.name}
        </span>
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
          {city.featuredService}
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed mb-8">
          {city.featuredServiceDesc}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {benefits.map((b) => (
            <div key={b} className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-primary shrink-0" />
              <span className="text-foreground text-sm font-body">{b}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

const GalleryBlock = ({ city }: { city: CityData }) => (
  <section className="py-16 md:py-24 bg-background">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-center mb-10"
      >
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
          Our Work in {city.name}
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Real results from real vehicles in the {city.name} area.
        </p>
      </motion.div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {city.galleryImages.map((img, i) => (
          <motion.div
            key={i}
            className="aspect-[4/3] rounded-lg overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <img
              src={img}
              alt={`Mobile detailing result in ${city.name}`}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const ClimateBlock = ({ city }: { city: CityData }) => (
  <section className="py-16 md:py-24 bg-card">
    <div className="container max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
          Built for {city.name}'s Conditions
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed">
          {city.climateHook}
        </p>
      </motion.div>
    </div>
  </section>
);

const FAQBlock = ({ city }: { city: CityData }) => (
  <section className="py-16 md:py-24 bg-background">
    <div className="container max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <h2 className="font-heading text-2xl font-bold text-foreground mb-6">
          {city.name} Detailing FAQs
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {city.faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="text-left text-base font-medium font-body text-foreground hover:text-primary">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground font-body leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        {city.relatedLinks && city.relatedLinks.length > 0 && (
          <div className="mt-10">
            <h3 className="font-heading text-2xl font-bold text-foreground mb-4">Related Services</h3>
            <ul className="grid gap-2 sm:grid-cols-2">
              {city.relatedLinks.map((link) => (
                <li key={`${link.href}-${link.text}`}>
                  <a href={link.href} className="text-primary hover:underline underline-offset-4">
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        <a href="/" className="mt-6 inline-block text-primary hover:underline underline-offset-4">
          View all Sacramento service areas
        </a>
      </motion.div>
    </div>
  </section>
);

const ServicesInCityBlock = ({ city }: { city: CityData }) => (
  <section className="py-16 md:py-24 bg-background">
    <div className="container max-w-4xl">
      <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
        Services in {city.name}
      </h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {servicePages.map((s) => (
          <li key={s.slug}>
            <Link
              to={`/services/${s.slug}`}
              className="text-primary hover:underline underline-offset-4"
            >
              {s.heroTitle} in {city.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

const CTABlock = ({ city }: { city: CityData }) => (
  <section className="py-16 md:py-24 bg-card">
    <div className="container text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
          Ready for a Spotless Ride in {city.name}?
        </h2>
        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
          Book your mobile detail today and experience the Drippy Suds difference — right at your {city.name} home or office.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/s/appointments"
            className="inline-block bg-primary text-primary-foreground font-body font-bold text-sm uppercase tracking-widest px-10 py-4 rounded-sm hover:bg-primary/90 transition-all duration-300"
          >
            Book Now
          </Link>
          <a
            href="tel:9165074802"
            className="inline-flex items-center gap-2 text-primary font-body font-bold text-sm uppercase tracking-widest"
          >
            <Phone className="w-4 h-4" />
            (916) 507-4802
          </a>
        </div>
      </motion.div>
    </div>
  </section>
);

// === Main Page ===

const CityLanding = () => {
  const location = useLocation();
  const slug = location.pathname.replace("/mobile-detailing-", "");
  const city = slug ? cityPages.find((entry) => entry.slug === slug) : undefined;

  if (!city) return <Navigate to="/" replace />;

  const cityData = toCityData(city);

  const layoutVariants: Record<number, React.FC<{ city: CityData }>> = {
    1: LayoutVariant1,
    2: LayoutVariant2,
    3: LayoutVariant3,
    4: LayoutVariant4,
  };
  const SelectedLayout = layoutVariants[cityData.layoutVariant] || LayoutVariant1;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        name: "Drippy Suds Mobile Detailing",
        description: cityData.metaDescription,
        url: `https://drippysuds.com/mobile-detailing-${cityData.slug}`,
        telephone: "+19165074802",
        email: "Drippysudsllc@gmail.com",
        address: {
          "@type": "PostalAddress",
          addressLocality: cityData.name,
          addressRegion: "CA",
          addressCountry: "US",
        },
        areaServed: {
          "@type": "City",
          name: cityData.name,
        },
        priceRange: "$$",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://drippysuds.com/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: `Mobile Detailing in ${cityData.name}`,
            item: `https://drippysuds.com/mobile-detailing-${cityData.slug}`,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: cityData.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <Layout>
      <SEO
        title={cityData.metaTitle}
        description={cityData.metaDescription}
        canonical={`https://drippysuds.com/mobile-detailing-${cityData.slug}`}
        jsonLd={jsonLd}
      />

      {/* Hero */}
      <section className="relative py-24 md:py-36 overflow-hidden">
        <img
          src={cityData.heroImage}
          alt={`Mobile detailing in ${cityData.name}`}
          loading="eager"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/80" />
        <div className="container relative z-10">
          <motion.h1
            className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {cityData.h1}
          </motion.h1>
          <motion.p
            className="text-muted-foreground text-lg md:text-xl max-w-2xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {cityData.subtitle}
          </motion.p>
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-accent fill-accent" />
              ))}
            </div>
            <span className="text-muted-foreground text-sm font-body">
              5-Star Rated in {cityData.name}
            </span>
          </motion.div>
        </div>
      </section>

      {/* Layout variant renders blocks in unique order */}
      <SelectedLayout city={cityData} />

      <section className="py-10 border-t border-border">
        <div className="container">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/" className="text-muted-foreground hover:text-primary">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Service Areas</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to={`/mobile-detailing-${cityData.slug}`}>{cityData.name}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </section>
    </Layout>
  );
};

export default CityLanding;
