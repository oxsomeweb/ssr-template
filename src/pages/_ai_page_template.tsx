// AI page template — copy this file to src/pages/<NewPage>.tsx, then:
//   1. Replace every TEMPLATE_* identifier with a unique page identifier.
//   2. Edit only the content between AI_START_* / AI_END_* tags.
//   3. Register the route above the AI_ROUTE_ANCHOR comment in src/App.tsx.
//   4. Add the page to static_pages, routes.static, and editable_regions in site-map.json.
//   5. Run `node scripts/validate-structure.js` and confirm it exits 0.
//
// Do not delete, rename, or move any AI_START_* / AI_END_* tags.
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import PageHero from "@/components/PageHero";
import { GALLERY } from "@/lib/images";

const TEMPLATE_PATH = "/template-path";

const TemplatePage = () => {
  return (
    <Layout>
      <SEO
        title={
          /* AI_START_TEMPLATE_SEO_TITLE */
          "Template Page Title | Drippy Suds Mobile Detailing"
          /* AI_END_TEMPLATE_SEO_TITLE */
        }
        description={
          /* AI_START_TEMPLATE_SEO_DESCRIPTION */
          "Template page description for the new page — keep under 160 characters and include the primary keyword."
          /* AI_END_TEMPLATE_SEO_DESCRIPTION */
        }
        canonical={`https://drippysuds.com${TEMPLATE_PATH}`}
      />
      <PageHero
        title={
          /* AI_START_TEMPLATE_HERO_HEADLINE */
          "Template Page Headline"
          /* AI_END_TEMPLATE_HERO_HEADLINE */
        }
        subtitle={
          /* AI_START_TEMPLATE_HERO_SUBTITLE */
          "Short supporting subtitle for this page — one sentence."
          /* AI_END_TEMPLATE_HERO_SUBTITLE */
        }
        backgroundImage={GALLERY.waxFinish}
      />
      <section className="py-16 bg-background">
        <div className="container max-w-4xl">
          <h2 className="font-heading text-3xl font-bold text-foreground mb-6">
            {/* AI_START_TEMPLATE_BODY_HEADLINE */}
            Section Headline
            {/* AI_END_TEMPLATE_BODY_HEADLINE */}
          </h2>
          <div className="space-y-4 text-foreground/80 leading-relaxed">
            {/* AI_START_TEMPLATE_BODY */}
            <p>
              Replace this paragraph with the body content for the new page. Keep tone and
              voice consistent with the brand: premium, confident, and Sacramento-rooted.
            </p>
            {/* AI_END_TEMPLATE_BODY */}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default TemplatePage;
