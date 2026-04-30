import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd, { breadcrumbSchema } from "@/components/JsonLd";
import { fetchBlogPosts, urlFor } from "@/lib/sanity";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "@/i18n/LanguageContext";

const BASE_URL = "https://www.charlsflowers.com";

const blogCollectionSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "@id": `${BASE_URL}/blog#blog`,
  name: "The Charl's Flowers Blog",
  description:
    "Miami floral insights, delivery guides, wedding inspiration, event planning tips and rose care advice from Charl's Flowers.",
  url: `${BASE_URL}/blog`,
  publisher: { "@id": `${BASE_URL}/#localbusiness` },
  inLanguage: "en-US",
};

const Blog = () => {
  const { t } = useTranslation();
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["blog-posts", "en"],
    queryFn: () => fetchBlogPosts("en"),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title="Charl's Flowers Blog | Miami Floral Guides, Tips & Insights"
        description="Expert guides on flower delivery, weddings, events and floral care in Miami. Insider tips from Charl's Flowers, Miami's luxury florist."
        path="/blog"
      />
      <JsonLd
        data={[
          blogCollectionSchema,
          breadcrumbSchema([
            { name: "Home", url: `${BASE_URL}/` },
            { name: "Blog", url: `${BASE_URL}/blog` },
          ]),
        ]}
      />
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <Breadcrumbs items={[{ label: t("nav.home"), to: "/" }, { label: t("nav.blog") }]} />

          <header className="text-center mb-10 max-w-3xl mx-auto">
            <h1 className="font-title-retro text-4xl md:text-5xl text-foreground">
              The Charl's Flowers Blog — Miami Floral Insights & Guides
            </h1>
            <p className="text-muted-foreground font-body mt-4 text-base">
              {t("blogPage.subtitle")}
            </p>
          </header>

          {/* Rich intro — turns /blog into a real landing instead of a thin index */}
          <section className="max-w-3xl mx-auto mb-14 font-body text-foreground/90 leading-relaxed space-y-4">
            <p>
              Welcome to the Charl's Flowers blog — a working notebook from inside Miami's
              luxury floral scene. We're a family-run florist based at 7261 NW 12th Street,
              delivering custom rose bouquets, room decorations and event arrangements across
              all of Miami-Dade up to 87 miles from our shop. This blog is where we share
              everything we learn day to day: what's actually in season, which bouquet sizes
              work for which occasions, how to time a same-day order before our 3 PM cutoff,
              and how to plan flowers around Miami's heat, humidity and traffic.
            </p>
            <p>
              You'll find practical guides on{" "}
              <Link to="/delivery" className="text-primary hover:underline">
                flower delivery in Miami
              </Link>{" "}
              — including how our flat $20 (0–5 mi) + $1.60/mile pricing works, which
              neighborhoods we cover same-day, and how we handle Fisher Island, hospitals,
              hotels and high-rise buildings in Brickell or Miami Beach. We also cover
              wedding and event planning: bouquet shapes for the bride, centerpieces, arches,
              gender reveal setups and the bilingual Mother's Day rush. For quinceañeras —
              still one of Miami's biggest celebrations — we share color palettes, traditional
              symbolism and how to coordinate flowers with the dress and venue.
            </p>
            <p>
              Beyond events, we publish floral care content: how to make roses last longer in
              Miami's climate, the difference between natural, glitter and painted finishes,
              and when a custom bouquet from our{" "}
              <Link to="/bouquets/personalizar" className="text-primary hover:underline">
                AI-powered builder
              </Link>{" "}
              makes more sense than a pre-designed one from the{" "}
              <Link to="/bouquets" className="text-primary hover:underline">
                main catalog
              </Link>
              . Expect neighborhood-specific recommendations (Coral Gables vs. Wynwood vs.
              Doral), occasion guides, and honest notes on what works — written by the people
              who actually arrange and deliver the flowers, not by an AI content farm.
            </p>
          </section>

          {isLoading ? (
            <div className="max-w-2xl mx-auto text-center py-10">
              <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
            </div>
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {posts.map((article) => (
                <Link
                  key={article._id}
                  to={`/blog/${article.slug.current}`}
                  className="group block"
                >
                  <div className="relative overflow-hidden rounded-lg mb-4 aspect-video bg-muted">
                    <img
                      src={urlFor(article.mainImage).width(800).height(450).fit("crop").auto("format").url()}
                      alt={article.mainImage.alt || `${article.title} – Charls Flowers Miami`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                      width={500}
                      height={280}
                    />
                    <div className="absolute inset-0 bg-foreground/5 group-hover:bg-foreground/15 transition-colors" />
                  </div>
                  <p className="font-body text-xs text-muted-foreground mb-1">
                    {new Date(article.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <h2 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                    {article.title}
                  </h2>
                  <p className="font-body text-sm text-muted-foreground mb-3">{article.excerpt}</p>
                  <span className="font-body text-xs text-primary tracking-widest uppercase inline-flex items-center gap-1">
                    {t("blogPage.readMore")} <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="max-w-2xl mx-auto text-center py-10 border-t border-border">
              <p className="font-body text-muted-foreground">
                Fresh articles coming soon. Follow us on{" "}
                <a
                  href="https://www.instagram.com/charlsflowers"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Instagram
                </a>{" "}
                for behind-the-scenes posts in the meantime.
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Blog;