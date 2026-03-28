import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd, { articleSchema } from "@/components/JsonLd";
import { getBlogArticle } from "@/lib/blogData";

const BlogArticle = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? getBlogArticle(slug) : undefined;

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  if (!article) {
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

  const { Content } = article;

  return (
    <div className="min-h-screen bg-background">
      <SeoHead title={article.seoTitle} description={article.seoDescription} path={`/blog/${article.slug}`} image={article.image} type="article" article={{ datePublished: article.datePublished }} />
      <JsonLd data={articleSchema(article.title, article.slug, article.datePublished, article.image)} />
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Blog", to: "/blog" }, { label: article.title }]} />

          <article className="max-w-3xl mx-auto">
            <div className="mb-8">
              <p className="font-body text-xs text-muted-foreground mb-2">{new Date(article.datePublished).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <h1 className="font-title-retro text-3xl md:text-4xl text-foreground mb-4">{article.title}</h1>
            </div>

            <div className="relative overflow-hidden rounded-sm mb-10 aspect-video bg-muted">
              <img src={article.image} alt={`${article.title} – Charls Flowers Miami`} loading="lazy" width={800} height={450} className="w-full h-full object-cover" />
            </div>

            <div className="prose prose-lg max-w-none font-body text-foreground
              [&>h2]:font-display [&>h2]:text-2xl [&>h2]:font-semibold [&>h2]:text-foreground [&>h2]:mt-10 [&>h2]:mb-4
              [&>p]:text-muted-foreground [&>p]:leading-relaxed [&>p]:mb-5
              [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-5 [&>ul>li]:text-muted-foreground [&>ul>li]:mb-2
              [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-5 [&>ol>li]:text-muted-foreground [&>ol>li]:mb-2
            ">
              <Content />
            </div>
          </article>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BlogArticle;
