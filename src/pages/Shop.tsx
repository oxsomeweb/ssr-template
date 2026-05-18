import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import PageHero from "@/components/PageHero";
import { GALLERY, OG_LOGO } from "@/lib/images";
const heroBg = GALLERY.premiumWash;

const shopJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Drippy Suds Mobile Detailing",
  "image": OG_LOGO,
  "url": "https://drippysuds.com/s/shop",
  "telephone": "+19165392062",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "2101 53rd Ave",
    "addressLocality": "Sacramento",
    "addressRegion": "CA",
    "postalCode": "95822",
    "addressCountry": "US",
  },
};

const Shop = () => {
  return (
    <Layout>
      <SEO
        title="Shop | Drippy Suds Mobile Detailing"
        description="Shop detailing products and accessories from Drippy Suds Mobile Detailing in Sacramento, CA."
        canonical="https://drippysuds.com/s/shop"
        jsonLd={shopJsonLd}
      />
      <PageHero title="Shop" subtitle="Detailing products and accessories coming soon" backgroundImage={heroBg} />
      <section className="py-16 md:py-24 bg-background min-h-[30vh] flex items-center">
        <div className="container text-center">
          <p className="text-muted-foreground text-lg">
            Items aren't available for sale yet. Come back later to purchase!
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default Shop;
