import { Helmet } from "react-helmet-async";

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
  const url = `${BASE_URL}${path}`;
  const ogImage = image || DEFAULT_IMAGE;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />

      {/* hreflang */}
      <link rel="alternate" hrefLang="en" href={url} />
      <link rel="alternate" hrefLang="en-US" href={url} />
      <link rel="alternate" hrefLang="x-default" href={url} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content="en_US" />
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
