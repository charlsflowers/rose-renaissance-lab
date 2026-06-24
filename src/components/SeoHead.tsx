import { Helmet } from "react-helmet-async";
import { useTranslation, stripLangPrefix } from "@/i18n/LanguageContext";

const BASE_URL = "https://www.charlsflowers.com";
const DEFAULT_IMAGE = "https://storage.googleapis.com/gpt-engineer-file-uploads/pPT3n7ZwBuTW9aMFgpnKH957a2Y2/social-images/social-1773180724629-LOGO_charls.webp";

interface SeoHeadProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  noindex?: boolean;
  article?: {
    datePublished: string;
    dateModified?: string;
    author?: string;
  };
}

const SeoHead = ({ title, description, path = "", image, type = "website", noindex = false, article }: SeoHeadProps) => {
  const { language } = useTranslation();
  const ogImage = image || DEFAULT_IMAGE;

  // Normalize the path: callers always pass the EN-style path (e.g. "/bouquets/all/foo").
  // We strip a `/es` prefix defensively in case a caller already includes it.
  const cleanPath = stripLangPrefix(path) || "/";
  const enUrl = `${BASE_URL}${cleanPath === "/" ? "" : cleanPath}`;
  const esUrl = `${BASE_URL}${cleanPath === "/" ? "/es" : `/es${cleanPath}`}`;

  // Canonical: self-referencing per language.
  const canonical = language === "es" ? esUrl : enUrl;
  const ogLocale = language === "es" ? "es_US" : "en_US";

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />

      {/* hreflang — declares both EN and ES versions of this page */}
      <link rel="alternate" hrefLang="en" href={enUrl} />
      <link rel="alternate" hrefLang="es" href={esUrl} />
      <link rel="alternate" hrefLang="x-default" href={enUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content={ogLocale} />
      {language === "es" && <meta property="og:locale:alternate" content="en_US" />}
      {language === "en" && <meta property="og:locale:alternate" content="es_US" />}
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
