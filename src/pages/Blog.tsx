import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import { blogArticles } from "@/lib/blogData";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "@/i18n/LanguageContext";

const Blog = () => {
  const { t } = useTranslation();
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-background">
      <SeoHead title="Blog | Flower Tips & Guides – Charls Flowers Miami" description="Read our flower guides, tips, and inspiration. Custom bouquets, delivery info, and occasion ideas from Miami's premier flower shop." path="/blog" />
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <Breadcrumbs items={[{ label: t("nav.home"), to: "/" }, { label: t("nav.blog") }]} />

          <div className="text-center mb-12">
            <h1 className="font-title-retro text-4xl md:text-5xl text-foreground">{t("blogPage.title")}</h1>
            <p className="text-muted-foreground font-body mt-3 max-w-lg mx-auto">{t("blogPage.subtitle")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {blogArticles.map((article) => (
              <Link key={article.slug} to={`/blog/${article.slug}`} className="group block">
                <div className="relative overflow-hidden rounded-lg mb-4 aspect-video bg-muted">
                  <img src={article.image} alt={`${article.title} – Charls Flowers Miami`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" width={500} height={280} />
                  <div className="absolute inset-0 bg-foreground/5 group-hover:bg-foreground/15 transition-colors" />
                </div>
                <p className="font-body text-xs text-muted-foreground mb-1">{new Date(article.datePublished).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <h2 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">{article.title}</h2>
                <p className="font-body text-sm text-muted-foreground mb-3">{article.excerpt}</p>
                <span className="font-body text-xs text-primary tracking-widest uppercase inline-flex items-center gap-1">
                  {t("blogPage.readMore")} <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Blog;
