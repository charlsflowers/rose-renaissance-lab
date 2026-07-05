import { useEffect } from "react";
import { useParams, useLocation, Navigate as RRNavigate } from "react-router-dom";
import { Link, Navigate } from "@/i18n/LocalizedRouter";
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
import { resolveBlogInterlinks } from "@/lib/blogInterlinks";
import { useTranslation } from "@/i18n/LanguageContext";

const BASE_URL = "https://charlsflowers.com";

const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }: { value: SanityImage & { caption?: string } }) => {
      if (!value?.asset) return null;
      const src = urlFor(value).width(1200).auto("format").quality(80).url();
      return (
        <figure className="my-8">
          <img
            src={src}
            alt={value.alt || "Charls Flowers Miami"}
            className="w-full rounded-lg"
            loading="lazy"
            decoding="async"
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
  block: {
    // Force a single H1 per page (the post title). Any H1 used inside the
    // body in Sanity is demoted to H2 so SEO stays clean.
    h1: ({ children }) => (
      <h2 className="font-display text-2xl font-semibold text-foreground mt-10 mb-4">{children}</h2>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary pl-4 italic my-6 text-muted-foreground">
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const href = value?.href ?? "#";
      const isExternal =
        /^https?:\/\//i.test(href) && !/(^|\.)charlsflowers\.com/i.test(href);
      if (isExternal) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-2 hover:opacity-80 transition-opacity"
          >
            {children}
          </a>
        );
      }
      // Internal link — convert to React Router Link, same tab, brand color.
      const path = href.replace(/^https?:\/\/[^/]+/, "");
      return (
        <Link
          to={path}
          className="text-primary underline underline-offset-2 hover:opacity-80 transition-opacity"
        >
          {children}
        </Link>
      );
    },
  },
};

const BlogArticle = () => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const { t, language } = useTranslation();
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
          <p className="text-muted-foreground font-body">{t("blogArticle.articleNotFound")}</p>
          <Link to="/blog" className="text-primary font-body underline mt-4 inline-block">{t("blogArticle.backToBlog")}</Link>
        </div>
      </div>
    );
  }

  // Language toggle on a post: EN and ES versions have DIFFERENT slugs. If the
  // URL language doesn't match the fetched post's language, jump to the TRANSLATED
  // post (if it exists); otherwise normalize to this post's own-language URL.
  if (article.language !== language) {
    if (article.translationSlug) {
      const to =
        language === "es"
          ? `/es/blog/${article.translationSlug}`
          : `/blog/${article.translationSlug}`;
      return <RRNavigate to={to} replace />;
    }
    const own =
      article.language === "es"
        ? `/es/blog/${article.slug.current}`
        : `/blog/${article.slug.current}`;
    if (location.pathname !== own) return <RRNavigate to={own} replace />;
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

  // Logic-driven internal linking: blog article → affine on-site categories,
  // ordered low → high search volume (chain logic), ending at the main category.
  // Hints come from the article's Sanity categories AND its relatedLandings.
  const interlinkHints = [
    ...((article.categories ?? []).map((c) => c.slug?.current).filter(Boolean) as string[]),
    ...((article.relatedLandings ?? []) as string[]),
  ];
  const categoryInterlinks = resolveBlogInterlinks(
    interlinkHints,
    article.language === "es" ? "es" : "en",
  );

  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title={article.seoTitle || `${article.title} | Charls Flowers Miami`}
        description={article.seoDescription || article.excerpt}
        path={`/blog/${article.slug.current}`}
        image={imageUrl}
        type="article"
        noAlternateEs={article.language !== "es"}
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
          <Breadcrumbs items={[{ label: t("sitemap.links.home"), to: "/" }, { label: t("sitemap.links.blog"), to: "/blog" }, { label: article.title }]} />

          <article className="max-w-3xl mx-auto">
            <div className="mb-8">
              <p className="font-body text-xs text-muted-foreground mb-2">
                {new Date(article.publishedAt).toLocaleDateString(language === "es" ? "es-ES" : "en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
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
                loading="eager"
                fetchPriority="high"
                decoding="async"
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
                  {t("blogArticle.relatedZones")}
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

            {/* Interlinking blog → categoría afín (lógica de cadena / PageRank):
                cuando el artículo declara categorías/landings afines, enlazamos
                hacia esas colecciones ordenadas de menor a mayor volumen y
                terminamos en la categoría principal. Anchor = el propio
                keyword/título de la colección (no inventado aquí). */}
            {categoryInterlinks.length > 1 && (
              <section className="mt-12 pt-8 border-t border-border">
                <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                  {language === "es" ? "Colecciones relacionadas" : "Related collections"}
                </h2>
                <ul className="space-y-2 font-body">
                  {categoryInterlinks.map((l) => (
                    <li key={l.to}>
                      <Link to={l.to} className="text-primary hover:underline">
                        → {l.anchor}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Sigue leyendo — siempre visible, enlaza a colecciones clave */}
            <section className="mt-12 pt-8 border-t border-border">
              <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                {language === "es" ? "Sigue explorando" : "Keep exploring"}
              </h2>
              <ul className="space-y-2 font-body">
                <li>
                  <Link to="/bouquets" className="text-primary hover:underline">
                    → {language === "es" ? "Ver todos los ramos" : "Browse all bouquets"}
                  </Link>
                </li>
                <li>
                  <Link to="/bouquets/personalizar" className="text-primary hover:underline">
                    → {language === "es" ? "Crear ramo personalizado" : "Build a custom bouquet"}
                  </Link>
                </li>
                <li>
                  <Link to="/delivery" className="text-primary hover:underline">
                    → {language === "es" ? "Envío en Miami" : "Miami flower delivery"}
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="text-primary hover:underline">
                    → {language === "es" ? "Volver al blog" : "Back to the blog"}
                  </Link>
                </li>
              </ul>
            </section>
          </article>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BlogArticle;