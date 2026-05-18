import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import PageHero from "@/components/PageHero";
import GallerySection from "@/components/home/GallerySection";
import BeforeAfterGrid from "@/components/gallery/BeforeAfterGrid";
import { GALLERY, OG_LOGO } from "@/lib/images";
const heroBg = GALLERY.exteriorRed;

const galleryJsonLd = {
  "@context": "https://schema.org",
  "@type": "ImageGallery",
  "name": "Drippy Suds Mobile Detailing Gallery",
  "description": "See the Drippy difference — browse our portfolio of interior and exterior detailing transformations on real Sacramento vehicles.",
  "url": "https://drippysuds.com/gallery",
  "publisher": {
    "@type": "LocalBusiness",
    "name": "Drippy Suds Mobile Detailing",
    "image": OG_LOGO,
    "telephone": "+19165392062",
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

const Gallery = () => {
  return (
    <Layout>
      <SEO
        title="Gallery | Drippy Suds Mobile Detailing Sacramento"
        description="See the Drippy difference — browse our portfolio of interior and exterior detailing transformations on real Sacramento vehicles."
        canonical="https://drippysuds.com/gallery"
        jsonLd={galleryJsonLd}
      />
      <PageHero title="Our Gallery" subtitle="See the Drippy difference on real Sacramento vehicles" backgroundImage={heroBg} />
      <BeforeAfterGrid />
      <GallerySection />
    </Layout>
  );
};

export default Gallery;
