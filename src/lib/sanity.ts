import { createClient, type SanityClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import type { PortableTextBlock } from "@portabletext/react";

export const sanityClient: SanityClient = createClient({
  projectId: "8326wvly",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: true,
  perspective: "published",
});

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// ── Types ──────────────────────────────────────────────────────────────

export interface SanityImage {
  _type: "image";
  asset: { _ref: string; _type: "reference" };
  alt?: string;
  hotspot?: { x: number; y: number };
}

export interface SanityCategory {
  _id: string;
  title: string;
  slug: { current: string };
}

export interface BlogPostListItem {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  excerpt: string;
  language: "en" | "es";
  mainImage: SanityImage;
  categories?: SanityCategory[];
}

export interface BlogPostFull extends BlogPostListItem {
  updatedAt?: string;
  body: PortableTextBlock[];
  seoTitle?: string;
  seoDescription?: string;
  author?: string;
  relatedLandings?: string[];
}

// ── Queries ────────────────────────────────────────────────────────────

const POST_LIST_PROJECTION = `
  _id,
  title,
  "slug": slug,
  publishedAt,
  excerpt,
  language,
  mainImage,
  "categories": categories[]->{ _id, title, slug }
`;

const POST_FULL_PROJECTION = `
  ${POST_LIST_PROJECTION},
  updatedAt,
  body,
  seoTitle,
  seoDescription,
  author,
  relatedLandings
`;

export async function fetchBlogPosts(language: "en" | "es" = "en"): Promise<BlogPostListItem[]> {
  return sanityClient.fetch(
    `*[_type == "post" && language == $language && defined(slug.current)] | order(publishedAt desc) {
      ${POST_LIST_PROJECTION}
    }`,
    { language },
  );
}

export async function fetchBlogPost(slug: string): Promise<BlogPostFull | null> {
  return sanityClient.fetch(
    `*[_type == "post" && slug.current == $slug][0] {
      ${POST_FULL_PROJECTION}
    }`,
    { slug },
  );
}

export async function fetchBlogSlugs(): Promise<string[]> {
  return sanityClient.fetch(
    `*[_type == "post" && defined(slug.current)].slug.current`,
  );
}
