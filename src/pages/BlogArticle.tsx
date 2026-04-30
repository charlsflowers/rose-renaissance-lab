import { useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd, { blogPostingSchema, breadcrumbSchema } from "@/components/JsonLd";
import { fetchBlogPost, urlFor, type SanityImage } from "@/lib/sanity";
import { retiredBlogSlugs } from "@/lib/blogData";
import { landingPages } from "@/lib/landingPagesData";

const BASE_URL = "https://www.charlsflowers.com";

const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }: { value: SanityImage & { caption?: string } }) => {
      if (!value?.asset) return null;
      const src = urlFor(value).width(1200).auto("format").url();
      return (
        <figure className="my-8">
          <img
            src={src}
            alt={value.alt || "Charls Flowers Miami"}
            className="w-full rounded-lg"
            loading="lazy"
          />
          {value.caption && (
            <figcaption className="text-xs text-muted-foreground mt-2 text-center italic">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  marks: {
    link: ({ children, value }) => {
      const href = value?.href ?? "#";
      const isExternal = /^https?:\/\//i.test(href) && !href.includes("charlsflowers.com");
      if (isExternal) {
        return (
          <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline">
            {children}
          </a>
        );
      }
      // Internal link — convert to React Router Link if path-like
      const path = href.replace(/^https?:\/\/[^/]+/, "");
      return (
        <Link to={path} className="text-primary underline">
          {children}
        </Link>
      );
    },
  },
};

const BlogArticle = () => {
  const { slug } = useParams<{ slug: string }>();
  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  // 301-equivalent redirect for retired AI-generated posts
  if (slug && retiredBlogSlugs.includes(slug)) {
    return <Navigate to="/blog" replace />;
  }

  const { data: article, isLoading, isError } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: () => fetchBlogPost(slug!),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 text-center">
          <p className="text-muted-foreground font-body">Article not found</p>
          <Link to="/blog" className="text-primary font-body underline mt-4 inline-block">Back to blog</Link>
        </div>
      </div>
    );
  }

  const imageUrl = urlFor(article.mainImage).width(1200).height(675).fit("crop").auto("format").url();
  const langCode = article.language === "es" ? "es-US" : "en-US";
  const inLanguage = article.language === "es" ? "es" : "en";

  // Resolve related landings (slug → human title via landingPages)
  const relatedLandings = (article.relatedLandings ?? [])
    .map((relSlug) => {
      const lp = landingPages.find((p) => p.slug === relSlug);
      return lp ? { slug: relSlug, label: lp.h1.replace(/ [|–—].*/g, "").trim() } : null;
    })
    .filter((x): x is { slug: string; label: string } => x !== null);

  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title={article.seoTitle || `${article.title} | Charl's Flowers Miami`}
        description={article.seoDescription || article.excerpt}
        path={`/blog/${article.slug.current}`}
        image={imageUrl}
        type="article"
        article={{ datePublished: article.publishedAt, dateModified: article.updatedAt }}
      />
      <JsonLd
        data={[
          blogPostingSchema({
            headline: article.title,
            slug: article.slug.current,
            datePublished: article.publishedAt,
            dateModified: article.updatedAt,
            image: imageUrl,
            description: article.seoDescription || article.excerpt,
            author: article.author || "Charls Flowers",
            inLanguage: langCode,
          }),
          breadcrumbSchema([
            { name: "Home", url: `${BASE_URL}/` },
            { name: "Blog", url: `${BASE_URL}/blog` },
            { name: article.title, url: `${BASE_URL}/blog/${article.slug.current}` },
          ]),
        ]}
      />
      <Navbar />
      <div className="pt-24 pb-16" lang={inLanguage}>
        <div className="container mx-auto px-6">
          <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Blog", to: "/blog" }, { label: article.title }]} />

          <article className="max-w-3xl mx-auto">
            <div className="mb-8">
              <p className="font-body text-xs text-muted-foreground mb-2">
                {new Date(article.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <h1 className="font-title-retro text-3xl md:text-4xl text-foreground mb-4">{article.title}</h1>
              {article.excerpt && (
                <p className="font-body text-lg text-muted-foreground leading-relaxed">{article.excerpt}</p>
              )}
            </div>

            <div className="relative overflow-hidden rounded-lg mb-10 aspect-video bg-muted">
              <img
                src={imageUrl}
                alt={article.mainImage.alt || `${article.title} – Charls Flowers Miami`}
                loading="lazy"
                width={1200}
                height={675}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="prose prose-lg max-w-none font-body text-foreground
              [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mt-10 [&_h2]:mb-4
              [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mt-8 [&_h3]:mb-3
              [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_p]:mb-5
              [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-5 [&_ul>li]:text-muted-foreground [&_ul>li]:mb-2
              [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-5 [&_ol>li]:text-muted-foreground [&_ol>li]:mb-2
              [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-6
            ">
              <PortableText value={article.body} components={portableTextComponents} />
            </div>

            {relatedLandings.length > 0 && (
              <section className="mt-12 pt-8 border-t border-border">
                <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                  Related delivery zones & guides
                </h2>
                <ul className="space-y-2">
                  {relatedLandings.map((rel) => (
                    <li key={rel.slug}>
                      <Link to={`/${rel.slug}`} className="text-primary hover:underline font-body">
                        → {rel.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </article>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BlogArticle;