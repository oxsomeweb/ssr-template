export interface FaqItem {
  question: string;
  answer: string;
}

export interface CityPageData {
  slug: string;
  cityName: string;
  seoTitle: string;
  seoDescription: string;
  heroTitle: string;
  introParagraphs: string[];
  faqs: FaqItem[];
  relatedLinks?: { href: string; text: string }[];
}

export interface ServicePageSection {
  heading: string;
  content: string;
}

export interface ServicePageData {
  slug: string;
  category: string;
  seoTitle: string;
  seoDescription: string;
  canonical: string;
  heroTitle: string;
  breadcrumbLabel: string;
  introParagraphs: string[];
  sections: ServicePageSection[];
  faqs: FaqItem[];
  ctaText: string;
  relatedLinks?: { href: string; text: string }[];
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  image: string;
  content: string;
}
