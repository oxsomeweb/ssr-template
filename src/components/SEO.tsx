import { Helmet } from "react-helmet-async";
import { OG_LOGO } from "@/lib/images";

// SSR-compatible SEO component. Same props as the previous useEffect-based
// version so no page code needs to change. Helmet collects tags in a context
// during SSR and entry-server.tsx extracts them into the document <head>.
const SITE_URL = "https://drippysuds.com";
const OG_IMAGE = OG_LOGO;

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  jsonLd?: Record<string, unknown>;
  noIndex?: boolean;
}

const SEO = ({ title, description, canonical, jsonLd, noIndex }: SEOProps) => {
  const resolvedCanonical = canonical || SITE_URL;
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={resolvedCanonical} />
      <meta property="og:image" content={OG_IMAGE} />
      <meta property="og:site_name" content="Drippy Suds Mobile Detailing" />
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={OG_IMAGE} />
      <link rel="canonical" href={resolvedCanonical} />
      {noIndex ? <meta name="robots" content="noindex,nofollow" /> : null}
      {jsonLd ? (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      ) : null}
    </Helmet>
  );
};

export default SEO;
