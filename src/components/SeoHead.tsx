import { Helmet } from "react-helmet-async";
import { useTranslation, stripLangPrefix } from "@/i18n/LanguageContext";

const BASE_URL = "https://charlsflowers.com";
const DEFAULT_IMAGE = "https://storage.googleapis.com/gpt-engineer-file-uploads/pPT3n7ZwBuTW9aMFgpnKH957a2Y2/social-images/social-1773180724629-LOGO_charls.webp";

interface SeoHeadProps {
  title: string;
  description: string;
  path?: string;
  /**
   * Optional ES-specific path (EN-style, no /es prefix) when the ES URL slug
   * differs from the EN one (e.g. localized product slugs). When omitted, the
   * ES URL is derived from `path` with a `/es` prefix.
   */
  pathEs?: string;
  image?: string;
  type?: "website" | "article";
  noindex?: boolean;
  /**
   * EN-only pages (e.g. Sanity blog posts without an ES translation) should
   * NOT emit an ES `hreflang` alternate — otherwise crawlers follow a link
   * that 301s back to EN and the cluster is broken. When true we emit only
   * the self-referencing EN alternate.
   */
  noAlternateEs?: boolean;
  /**
   * English-only pages that are ALSO reachable under `/es` but have NO Spanish
   * translation (e.g. the local landing pages, whose copy is EN-only and must
   * NOT be machine-translated — it's validated marketing copy). When true the
   * page always declares English (`<html lang="en">`), canonicals to the EN URL
   * even when served at `/es/...`, and emits no ES `hreflang`. This consolidates
   * the `/es` duplicate onto the EN original instead of shipping a page marked
   * Spanish while its body is English.
   */
  enOnly?: boolean;
  article?: {
    datePublished: string;
    dateModified?: string;
    author?: string;
  };
}

const SeoHead = ({ title, description, path = "", pathEs, image, type = "website", noindex = false, noAlternateEs = false, enOnly = false, article }: SeoHeadProps) => {
  const { language } = useTranslation();
  const ogImage = image || DEFAULT_IMAGE;

  // Normalize the path: callers always pass the EN-style path (e.g. "/bouquets/foo").
  // We strip a `/es` prefix defensively in case a caller already includes it.
  const cleanPath = stripLangPrefix(path) || "/";
  const cleanPathEs = stripLangPrefix(pathEs || path) || "/";
  const enUrl = `${BASE_URL}${cleanPath === "/" ? "" : cleanPath}`;
  const esUrl = `${BASE_URL}${cleanPathEs === "/" ? "/es" : `/es${cleanPathEs}`}`;

  // enOnly pages always behave as English regardless of the active /es route.
  const effLang = enOnly ? "en" : language;
  const suppressEs = noAlternateEs || enOnly;
  // Canonical: self-referencing per language (EN for enOnly pages).
  const canonical = effLang === "es" ? esUrl : enUrl;
  const ogLocale = effLang === "es" ? "es_US" : "en_US";

  return (
    <Helmet>
      <html lang={effLang === "es" ? "es" : "en"} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />

      {/* hreflang — declares both EN and ES versions of this page */}
      <link rel="alternate" hrefLang="en" href={enUrl} />
      {!suppressEs && <link rel="alternate" hrefLang="es" href={esUrl} />}
      {!suppressEs && <link rel="alternate" hrefLang="x-default" href={enUrl} />}

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content={ogLocale} />
      {!suppressEs && effLang === "es" && <meta property="og:locale:alternate" content="en_US" />}
      {!suppressEs && effLang === "en" && <meta property="og:locale:alternate" content="es_US" />}
      <meta property="og:site_name" content="Charls Flowers" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@charlsflowers" />

      {/* Article meta */}
      {article && <meta property="article:published_time" content={article.datePublished} />}
      {article?.dateModified && <meta property="article:modified_time" content={article.dateModified} />}
    </Helmet>
  );
};

export default SeoHead;
