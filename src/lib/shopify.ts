import { toast } from "sonner";
import type { PricingTier } from "@/lib/productData";

const SHOPIFY_API_VERSION = "2024-01";
const SHOPIFY_STOREFRONT_DOMAIN = import.meta.env.VITE_SHOPIFY_STOREFRONT_DOMAIN || "charls-flowers.myshopify.com";
const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STOREFRONT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
const SHOPIFY_STOREFRONT_TOKEN =
  import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN ||
  import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN ||
  "4e7516581c2c609bb77d69b5f1786a9b";


export interface ShopifyVariant {
  id: string; // GID
  title: string;
  price: { amount: string; currencyCode: string };
  availableForSale: boolean;
  selectedOptions: Array<{ name: string; value: string }>;
}

export interface ShopifyProductNode {
  id: string;
  title: string;
  handle: string;
  variants: {
    edges: Array<{ node: ShopifyVariant }>;
  };
}

export async function storefrontApiRequest(query: string, variables: Record<string, unknown> = {}) {
  if (!SHOPIFY_STOREFRONT_TOKEN) {
    throw new Error("Missing Shopify Storefront token. Set VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN.");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    signal: controller.signal,
  });

  clearTimeout(timeoutId);

  if (response.status === 402) {
    toast.error("Payment required", {
      description: "The store needs an active billing plan to process orders.",
    });
    return null;
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  if (data.errors) {
    throw new Error(`Shopify error: ${data.errors.map((e: { message: string }) => e.message).join(', ')}`);
  }
  return data;
}

// Cache for resolved variants
const variantCache = new Map<string, ShopifyVariant>();

const TIER_BASE_PRODUCT_TITLES: Record<PricingTier, string> = {
  standard: "Pure White",
  red: "Total Passion",
  painted: "Blue Sky",
  mix2: "Iberian Passion",
  mix2painted: "Night & Day",
  mix3red: "Classic Tricolor",
  painted1: "Blue Sky",
};

const PRICING_TIERS = new Set<PricingTier>([
  "standard",
  "red",
  "painted",
  "mix2",
  "mix2painted",
  "mix3red",
  "painted1",
]);

const PRODUCTS_BY_TITLE_QUERY = `
  query GetProductByTitle($query: String!) {
    products(first: 20, query: $query) {
      edges {
        node {
          id
          title
          handle
          variants(first: 20) {
            edges {
              node {
                id
                title
                price { amount currencyCode }
                availableForSale
                selectedOptions { name value }
              }
            }
          }
        }
      }
    }
  }
`;

const normalize = (value: string) => value.trim().toLowerCase();
const cacheKey = (productName: string, rosesCount: number | string) => `${normalize(productName)}-${rosesCount}`;

const escapeShopifySearchValue = (value: string) => value.replace(/["\\]/g, "\\$&");

function getTierFromInput(value?: string): PricingTier | null {
  if (!value) return null;
  const normalized = normalize(value);
  return PRICING_TIERS.has(normalized as PricingTier) ? (normalized as PricingTier) : null;
}

function buildProductCandidates(productName: string, fallbackTier?: PricingTier): string[] {
  const candidates = new Set<string>();
  const trimmedName = productName.trim();
  if (trimmedName) candidates.add(trimmedName);

  const inputTier = getTierFromInput(productName);
  if (inputTier) candidates.add(TIER_BASE_PRODUCT_TITLES[inputTier]);

  if (fallbackTier) candidates.add(TIER_BASE_PRODUCT_TITLES[fallbackTier]);

  return Array.from(candidates);
}

function findVariantByRoses(product: ShopifyProductNode, rosesCount: number): ShopifyVariant | null {
  return (
    product.variants.edges.find(
      (v) =>
        v.node.title === String(rosesCount) ||
        v.node.selectedOptions.some((o) => o.name === "Roses" && o.value === String(rosesCount))
    )?.node ?? null
  );
}

/**
 * Resolve the Shopify variant GID for a given product name and roses count.
 */
export async function resolveVariantId(
  productName: string,
  rosesCount: number,
  fallbackTier?: PricingTier
): Promise<ShopifyVariant | null> {
  const candidates = buildProductCandidates(productName, fallbackTier);

  for (const candidate of candidates) {
    const cached = variantCache.get(cacheKey(candidate, rosesCount));
    if (cached) return cached;
  }

  if (candidates.length === 0) return null;

  try {
    const searchQuery = candidates
      .map((candidate) => `title:"${escapeShopifySearchValue(candidate)}"`)
      .join(" OR ");

    const data = await storefrontApiRequest(PRODUCTS_BY_TITLE_QUERY, {
      query: searchQuery,
    });

    if (!data) return null;

    const products = (data.data?.products?.edges || []).map(
      (edge: { node: ShopifyProductNode }) => edge.node
    ) as ShopifyProductNode[];

    if (products.length === 0) {
      console.error(`No Shopify product found for candidates: ${candidates.join(", ")}`);
      return null;
    }

    const selectedProduct =
      candidates
        .map((candidate) => products.find((product) => normalize(product.title) === normalize(candidate)))
        .find(Boolean) || products[0];

    const variant = findVariantByRoses(selectedProduct, rosesCount);

    if (!variant) {
      console.error(`No variant found for ${rosesCount} roses in product "${selectedProduct.title}"`);
      return null;
    }

    const aliases = new Set<string>([selectedProduct.title, ...candidates]);

    selectedProduct.variants.edges.forEach((v) => {
      const roses = v.node.selectedOptions.find((o) => o.name === "Roses")?.value || v.node.title;
      aliases.forEach((alias) => {
        variantCache.set(cacheKey(alias, roses), v.node);
      });
    });

    return variant;
  } catch (error) {
    console.error("Error resolving Shopify variant:", error);
    return null;
  }
}

// Cart mutations
const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        lines(first: 100) { edges { node { id merchandise { ... on ProductVariant { id } } } } }
      }
      userErrors { field message }
    }
  }
`;

function formatCheckoutUrl(checkoutUrl: string): string {
  try {
    const url = new URL(checkoutUrl);
    url.searchParams.set('channel', 'online_store');
    return url.toString();
  } catch {
    return checkoutUrl;
  }
}

export interface ShippingAddress {
  address1: string;
  city: string;
  province: string;
  zip: string;
  country: string;
}

/**
 * Create a Shopify cart in a SINGLE call with everything baked in:
 *   - all line items (products + accessories + delivery fee + service fee)
 *   - cart note (formatted order details for merchant)
 *   - buyer identity (shipping address) when applicable
 *
 * This is the ONLY way carts are created in the app. It guarantees that any
 * checkoutUrl handed off to Shopify (express checkouts, abandoned-cart emails,
 * Shop Pay, etc.) already contains the full set of fees and notes — there is
 * no "lightweight" cart that can leak.
 */
export interface CartFullLine {
  merchandiseId: string;
  quantity: number;
}

export async function createShopifyCartFull(input: {
  lines: CartFullLine[];
  note?: string;
  deliveryAddress?: ShippingAddress;
  attributes?: Array<{ key: string; value: string }>;
}): Promise<{ cartId: string; checkoutUrl: string } | null> {
  if (input.lines.length === 0) {
    console.error('createShopifyCartFull called with no lines');
    return null;
  }

  const cartInput: Record<string, unknown> = {
    lines: input.lines.map((l) => ({
      quantity: l.quantity,
      merchandiseId: l.merchandiseId,
    })),
  };

  if (input.note) {
    cartInput.note = input.note;
  }

  if (input.attributes && input.attributes.length > 0) {
    cartInput.attributes = input.attributes;
  }

  if (input.deliveryAddress && input.deliveryAddress.address1) {
    cartInput.buyerIdentity = {
      deliveryAddressPreferences: [
        {
          deliveryAddress: {
            address1: input.deliveryAddress.address1,
            city: input.deliveryAddress.city,
            province: input.deliveryAddress.province,
            zip: input.deliveryAddress.zip,
            country: input.deliveryAddress.country,
          },
        },
      ],
    };
  }

  const data = await storefrontApiRequest(CART_CREATE_MUTATION, { input: cartInput });

  const userErrors = data?.data?.cartCreate?.userErrors || [];
  if (userErrors.length > 0) {
    console.error('Cart creation failed:', userErrors);
    return null;
  }

  const cart = data?.data?.cartCreate?.cart;
  if (!cart?.checkoutUrl) return null;

  return { cartId: cart.id, checkoutUrl: formatCheckoutUrl(cart.checkoutUrl) };
}
