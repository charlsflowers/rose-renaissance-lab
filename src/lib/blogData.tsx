import React from "react";

export interface BlogArticleData {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  datePublished: string;
  image: string;
  excerpt: string;
  Content: React.FC;
}

/**
 * Slugs of blog posts that have been retired.
 * Used by App.tsx to issue 301-equivalent redirects to /blog.
 */
export const retiredBlogSlugs: string[] = [
  "custom-bouquets-miami",
  "best-flowers-quinceaneras-miami",
  "glitter-vs-natural-bouquets",
  "how-to-choose-roses-quantity",
  "same-day-flower-delivery-miami",
];

export const blogArticles: BlogArticleData[] = [];

export const getBlogArticle = (slug: string) =>
  blogArticles.find((a) => a.slug === slug);
