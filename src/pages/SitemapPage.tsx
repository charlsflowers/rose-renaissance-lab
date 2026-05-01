import { Link } from "@/i18n/LocalizedRouter";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import { landingPages } from "@/lib/landingPagesData";
import { fetchBlogPosts } from "@/lib/sanity";
import { bouquetProducts } from "@/lib/catalogData";
import { roomDecorPackages } from "@/lib/roomDecorData";
import { useTranslation } from "@/i18n/LanguageContext";

const Sitemap = () => {
  const { t, language } = useTranslation();
  const { data: blogPosts = [] } = useQuery({
    queryKey: ["sitemap-blog-posts", language],
    queryFn: () => fetchBlogPosts(language),
    staleTime: 5 * 60 * 1000,
  });

  // Deduplicate bouquets by shopifyHandle (unique key for the route)
  const uniqueBouquets = Array.from(
    new Map(bouquetProducts.map((p) => [p.shopifyHandle, p])).values()
  );

  const sections = [
    { title: t("sitemap.sections.mainPages"), links: [
      { to: "/", label: t("sitemap.links.home") },
      { to: "/bouquets", label: t("sitemap.links.bouquets") },
      { to: "/bouquets/personalizar", label: t("sitemap.links.customBouquetBuilder") },
      { to: "/room-decors", label: t("sitemap.links.roomDecors") },
      { to: "/delivery", label: t("sitemap.links.delivery") },
      { to: "/about", label: t("sitemap.links.about") },
      { to: "/contact", label: t("sitemap.links.contact") },
      { to: "/faq", label: t("sitemap.links.faq") },
      { to: "/blog", label: t("sitemap.links.blog") },
    ]},
    { title: t("sitemap.sections.bouquets"), links: uniqueBouquets.map(p => ({
      to: `/bouquets/all/${p.shopifyHandle}`, label: p.name,
    }))},
    { title: t("sitemap.sections.roomDecors"), links: roomDecorPackages.map(pkg => ({
      to: `/room-decors/${pkg.id}`, label: pkg.name,
    }))},
    { title: t("sitemap.sections.blogArticles"), links: blogPosts.map(a => ({
      to: `/blog/${a.slug.current}`, label: a.title.split('|')[0].trim(),
    }))},
    { title: t("sitemap.sections.landingPages"), links: landingPages.map(p => ({
      to: `/${p.slug}`, label: p.h1.replace(/ [–—|].*/g, ''),
    }))},
    { title: t("sitemap.sections.legal"), links: [
      { to: "/privacy-policy", label: t("sitemap.links.privacyPolicy") },
      { to: "/terms-of-service", label: t("sitemap.links.termsOfService") },
      { to: "/refund-policy", label: t("sitemap.links.refundPolicy") },
      { to: "/shipping-policy", label: t("sitemap.links.shippingPolicy") },
      { to: "/cookie-policy", label: t("sitemap.links.cookiePolicy") },
    ]},
  ];

  return (
    <div className="min-h-screen bg-background">
      <SeoHead title={t("sitemap.seoTitle")} description={t("sitemap.seoDescription")} path="/sitemap" />
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <h1 className="font-title-retro text-4xl text-primary text-center mb-10">{t("sitemap.title")}</h1>
          <div className="space-y-10">
            {sections.map(section => (
              <div key={section.title}>
                <h2 className="font-display text-lg font-semibold text-foreground mb-4">{section.title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {section.links.map(link => (
                    <Link key={link.to} to={link.to} className="font-body text-sm text-primary hover:underline">{link.label}</Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Sitemap;
