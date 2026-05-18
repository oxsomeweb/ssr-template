import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import PageHero from "@/components/PageHero";
import ServicesSection from "@/components/home/ServicesSection";
import { GALLERY, OG_LOGO } from "@/lib/images";
import { servicePages } from "@/data/servicePages";
import { Link } from "react-router-dom";
const heroBg = GALLERY.waxFinish;

const comparisonRows = [
  {
    label: "Best for",
    values: [
      "Pet hair / smells / cabin reset",
      "Paint care / wheels / glass",
      "Full reset inside and out",
      "Long-term paint protection",
    ],
  },
  {
    label: "Time",
    values: ["~2 hours", "~1.5 hours", "~4–5 hours", "~5–8 hours"],
  },
  {
    label: "How often",
    values: [
      "Every 3–6 months",
      "Every 4–6 weeks",
      "Every 6 months",
      "Once (lasts 2–5 years)",
    ],
  },
];

const columns = ["Interior Only", "Exterior Wash", "Drippy Diamond", "Ceramic Coating"];

const faqs = [
  {
    question: "What's the difference between a car wash and a detailing?",
    answer:
      "A car wash is a quick rinse — soap, water, maybe a vacuum. Detailing is a hands-on, multi-stage process: we decontaminate paint, hand wash with proper two-bucket technique, clean wheels and tires individually, and on interiors we shampoo, brush, extract, and dress every surface. A wash makes a car look better for a day. A detail resets it.",
  },
  {
    question: "Can I combine services?",
    answer:
      "Yes. Most clients pair an Interior Detail with an Exterior Wash, or step up to the Drippy Diamond Package which already covers both. Ceramic Coatings are added on top of a full exterior prep. Tell us what the car needs and we'll quote the right combination.",
  },
  {
    question: "Do you need access to water or power at my location?",
    answer:
      "No. Our mobile rigs carry their own water tanks and battery power, so we can detail in apartment lots, office garages, and driveways without hookups. If water and power are available we're happy to use them, but it's never required.",
  },
  {
    question: "How long does mobile detailing take?",
    answer:
      "Interior Only and Exterior Wash typically run 1.5–2 hours. The Drippy Diamond Package takes 4–5 hours for a full inside-and-out reset. Ceramic Coatings run 5–8 hours depending on paint condition and the coating tier you choose. We give you a firm window when we book.",
  },
  {
    question: "What areas of Sacramento do you serve?",
    answer:
      "Sacramento, Elk Grove, Folsom, Roseville, Citrus Heights, Natomas, Rancho Cordova, West Sacramento, Carmichael, Fair Oaks, Arden-Arcade, and surrounding Sacramento metro.",
  },
];

const servicesJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

const Services = () => {
  return (
    <Layout>
      <SEO
        title="Our Services | Drippy Suds Mobile Detailing Sacramento"
        description="Explore our premium mobile detailing packages — interior, exterior, ceramic coatings and more. Serving Sacramento and surrounding areas."
        canonical="https://drippysuds.com/services"
        jsonLd={servicesJsonLd}
      />
      <PageHero title="Mobile Detailing Services in Sacramento" subtitle="Premium mobile detailing packages for every need" backgroundImage={heroBg} />

      {/* Intro */}
      <section className="py-20 bg-background">
        <div className="container max-w-3xl space-y-6 text-muted-foreground leading-relaxed">
          <p>
            Sacramento's summers run over 100°F for weeks, wildfire smoke seasons coat interiors with fine particulate, and winter mud works into carpet and upholstery. A car that goes six months without professional attention shows it.
          </p>
          <p>
            Drippy Suds is fully mobile — we bring everything to your driveway, apartment lot, or office parking structure. No drop-off, no waiting room, no driving a dirty car across town. Every service is done by hand with professional-grade products, not automated equipment.
          </p>
          <p className="font-heading text-xl text-foreground">
            Four services. Pick based on what the car needs.
          </p>
        </div>
      </section>

      <ServicesSection />

      {/* Comparison */}
      <section className="py-20 bg-background">
        <div className="container max-w-5xl">
          <div className="mb-10 text-center">
            <span className="text-primary font-body text-sm uppercase tracking-[0.3em] font-bold mb-4 block">
              Compare
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
              Not sure which to book?
            </h2>
          </div>

          {/* Desktop table */}
          <div className="hidden md:block overflow-hidden border border-border bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-4 text-left font-body text-xs uppercase tracking-wider text-accent font-bold"></th>
                  {columns.map((c) => (
                    <th key={c} className="p-4 text-left font-heading text-base text-foreground font-bold">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.label} className="border-b border-border last:border-0">
                    <td className="p-4 font-body text-xs uppercase tracking-wider text-accent font-bold align-top">
                      {row.label}
                    </td>
                    {row.values.map((v, i) => (
                      <td key={i} className="p-4 text-muted-foreground align-top">
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile stacked */}
          <div className="md:hidden grid gap-4">
            {columns.map((c, idx) => (
              <div key={c} className="border border-border bg-card p-5">
                <h3 className="font-heading text-lg font-bold text-foreground mb-3">{c}</h3>
                <dl className="space-y-2 text-sm">
                  {comparisonRows.map((row) => (
                    <div key={row.label}>
                      <dt className="text-xs uppercase tracking-wider text-accent font-bold">
                        {row.label}
                      </dt>
                      <dd className="text-muted-foreground">{row.values[idx]}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-card">
        <div className="container max-w-3xl">
          <div className="mb-10">
            <span className="text-primary font-body text-sm uppercase tracking-[0.3em] font-bold mb-4 block">
              FAQ
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
              Frequently asked questions
            </h2>
          </div>
          <dl className="divide-y divide-border">
            {faqs.map((faq, i) => (
              <div key={i} className="py-6">
                <dt className="text-base font-semibold font-body text-foreground mb-2">
                  {faq.question}
                </dt>
                <dd className="text-sm text-muted-foreground font-body leading-relaxed">
                  {faq.answer}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container max-w-4xl">
          <h2 className="font-heading text-3xl font-bold text-foreground mb-6">Service Pages</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {servicePages.map((service) => (
              <li key={service.slug}>
                <Link to={`/services/${service.slug}`} className="text-primary hover:underline underline-offset-4">
                  {service.heroTitle} in Sacramento
                </Link>
              </li>
            ))}
            {/* AI_SERVICE_HUB_ANCHOR */}
          </ul>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
