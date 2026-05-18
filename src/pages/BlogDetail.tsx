import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Calendar } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  meta_description: string | null;
  featured_image_url: string | null;
  tags: string[];
  keywords: string[];
  status: string;
  created_at: string;
}

export default function BlogDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const fetchPost = async () => {
      const { data } = await supabase
        .from("seo_blog_drafts")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (data) setPost(data as BlogPost);
      setLoading(false);
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <Layout>
        <div className="container max-w-3xl py-16 space-y-6">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <div className="container max-w-3xl py-16 text-center">
          <h1 className="font-heading text-3xl font-bold text-foreground mb-4">Post Not Found</h1>
          <Link to="/blog" className="text-primary hover:underline">← Back to Blog</Link>
        </div>
      </Layout>
    );
  }

  // Simple Markdown-to-HTML renderer for blog content
  const renderContent = (md: string) => {
    return md
      .replace(/^### (.+)$/gm, '<h3 class="font-heading text-xl font-bold text-foreground mt-8 mb-3">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 class="font-heading text-2xl font-bold text-foreground mt-10 mb-4">$1</h2>')
      .replace(/^# (.+)$/gm, '<h2 class="font-heading text-2xl font-bold text-foreground mt-10 mb-4">$1</h2>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-primary hover:underline">$1</a>')
      .replace(/^- (.+)$/gm, '<li class="ml-4 text-muted-foreground">$1</li>')
      .replace(/(<li.*<\/li>\n?)+/g, '<ul class="list-disc space-y-1 my-4">$&</ul>')
      .replace(/\n\n/g, '</p><p class="text-muted-foreground leading-relaxed mt-4">')
      .replace(/^(?!<)/, '<p class="text-muted-foreground leading-relaxed">')
      .replace(/(?!>)$/, '</p>');
  };

  return (
    <Layout>
      <SEO
        title={`${post.title} | Drippy Suds Blog`}
        description={post.meta_description || `Read about ${post.title} on the Drippy Suds blog.`}
        canonical={`https://drippysuds.com/blog/${post.slug}`}
      />

      <article className="py-16 md:py-24">
        <div className="container max-w-3xl">
          <Link to="/blog" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>

          {post.featured_image_url && (
            <img
              src={post.featured_image_url}
              alt={post.title}
              className="w-full rounded-lg mb-8 max-h-96 object-cover"
            />
          )}

          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Calendar className="w-4 h-4" />
            {new Date(post.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </div>

          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">{post.title}</h1>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag, i) => (
                <span key={i} className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div
            className="prose prose-lg max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: renderContent(post.content) }}
          />

          {post.keywords && post.keywords.length > 0 && (
            <div className="mt-12 pt-6 border-t border-border">
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Topics</p>
              <div className="flex flex-wrap gap-2">
                {post.keywords.map((kw, i) => (
                  <span key={i} className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">{kw}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </Layout>
  );
}
