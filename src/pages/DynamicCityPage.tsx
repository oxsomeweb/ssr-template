import { useParams } from "react-router-dom";
import { useCityPage } from "@/hooks/useCityPage";
import { SeoInjectedLinks } from "@/components/SeoInjectedLinks";
import { SeoReviewBlocks } from "@/components/SeoReviewBlocks";
import { SeoContentOverrides } from "@/components/SeoContentOverrides";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function DynamicCityPage() {
  const { citySlug } = useParams();
  const pagePath = `/area/${citySlug}`;
  const { page, loading } = useCityPage(pagePath);

  if (loading) {
    return (
      <Layout>
        <div className="container max-w-4xl py-16 space-y-6">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </Layout>
    );
  }

  if (!page) {
    return (
      <Layout>
        <div className="container max-w-4xl py-16 text-center">
          <h1 className="font-heading text-3xl font-bold text-foreground mb-4">Page Not Found</h1>
          <p className="text-muted-foreground mb-6">This city page hasn't been created yet.</p>
          <Link to="/" className="text-primary hover:underline">← Back to Home</Link>
        </div>
      </Layout>
    );
  }

  const faqSchema = page.faq.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  } : undefined;

  return (
    <Layout>
      <SEO
        title={page.title_tag || page.h1}
        description={page.meta_description}
        canonical={`https://drippysuds.com${pagePath}`}
        jsonLd={faqSchema}
      />

      <section className="py-16 md:py-24">
        <div className="container max-w-4xl">
          <h1 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-4">{page.h1}</h1>
          <p className="text-lg text-muted-foreground mb-10">{page.intro_paragraph}</p>

          {page.body_sections.map((section, i) => (
            <div key={i} className="mb-10">
              <h2 className="font-heading text-2xl font-bold text-foreground mb-3">{section.heading}</h2>
              <div className="text-muted-foreground leading-relaxed whitespace-pre-line">{section.content}</div>
            </div>
          ))}

          {page.faq.length > 0 && (
            <div className="mb-10">
              <h2 className="font-heading text-2xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
              <div className="divide-y divide-border rounded-lg border border-border">
                {page.faq.map((item, i) => (
                  <details key={i} className="group p-4">
                    <summary className="font-medium cursor-pointer list-none flex items-center justify-between hover:text-primary transition-colors text-foreground">
                      {item.question}
                      <span className="ml-2 text-muted-foreground group-open:rotate-180 transition-transform">▾</span>
                    </summary>
                    <p className="mt-3 text-muted-foreground leading-relaxed">{item.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          )}

          {page.relatedLinks && page.relatedLinks.length > 0 && (
            <div className="mb-10">
              <h2 className="font-heading text-2xl font-bold text-foreground mb-4">Related Services</h2>
              <ul className="grid gap-2 sm:grid-cols-2">
                {page.relatedLinks.map((link) => (
                  <li key={`${link.href}-${link.text}`}>
                    <a href={link.href} className="text-primary hover:underline underline-offset-4">
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <a href="/" className="mb-10 inline-block text-primary hover:underline underline-offset-4">
            View all Sacramento service areas
          </a>

          {page.cta_text && (
            <div className="mt-12 p-8 rounded-lg bg-primary/5 border border-primary/20 text-center">
              <p className="text-lg font-medium text-foreground">{page.cta_text}</p>
              <Link
                to="/s/appointments"
                className="inline-block mt-4 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors"
              >
                Book Now
              </Link>
            </div>
          )}

          <SeoInjectedLinks pagePath={pagePath} />
          <SeoReviewBlocks pagePath={pagePath} />
          <SeoContentOverrides pagePath={pagePath} />

          <Breadcrumb className="mt-12 pt-8 border-t border-border">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Home</Link>
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
                  <Link to={pagePath}>{page.h1}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </section>

      {page.local_schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(page.local_schema) }}
        />
      )}
    </Layout>
  );
}
