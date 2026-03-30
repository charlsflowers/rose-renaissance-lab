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

  console.log("🔗 [Shopify] URL:", SHOPIFY_STOREFRONT_URL);
  console.log("🔑 [Shopify] Token (first 8 chars):", SHOPIFY_STOREFRONT_TOKEN.substring(0, 8) + "...");
  console.log("📦 [Shopify] Variables:", JSON.stringify(variables));

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

  console.log("📡 [Shopify] Response status:", response.status);

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

const CART_LINES_ADD_MUTATION = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        lines(first: 100) { edges { node { id merchandise { ... on ProductVariant { id } } } } }
      }
      userErrors { field message }
    }
  }
`;

const CART_LINES_UPDATE_MUTATION = `
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart { id }
      userErrors { field message }
    }
  }
`;

const CART_LINES_REMOVE_MUTATION = `
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { id }
      userErrors { field message }
    }
  }
`;

const CART_QUERY = `
  query cart($id: ID!) {
    cart(id: $id) { id totalQuantity }
  }
`;

const CART_CHECKOUT_URL_QUERY = `
  query getCartCheckoutUrl($id: ID!) {
    cart(id: $id) {
      checkoutUrl
    }
  }
`;

const CART_BUYER_IDENTITY_UPDATE_MUTATION = `
  mutation cartBuyerIdentityUpdate($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) {
    cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
      cart { id checkoutUrl }
      userErrors { field message }
    }
  }
`;

const CART_NOTE_UPDATE_MUTATION = `
  mutation cartNoteUpdate($cartId: ID!, $note: String!) {
    cartNoteUpdate(cartId: $cartId, note: $note) {
      cart { id }
      userErrors { field message }
    }
  }
`;

function formatCheckoutUrl(checkoutUrl: string): string {
  return checkoutUrl;
}

function isCartNotFoundError(userErrors: Array<{ field: string[] | null; message: string }>): boolean {
  return userErrors.some(e => e.message.toLowerCase().includes('cart not found') || e.message.toLowerCase().includes('does not exist'));
}

export async function fetchCartCheckoutUrl(cartId: string): Promise<string | null> {
  try {
    const data = await storefrontApiRequest(CART_CHECKOUT_URL_QUERY, { id: cartId });
    const checkoutUrl = data?.data?.cart?.checkoutUrl;
    if (!checkoutUrl) {
      console.error('No checkoutUrl returned for cart:', cartId);
      return null;
    }
    const formatted = formatCheckoutUrl(checkoutUrl);
    console.log("🛒 [Shopify] checkoutUrl:", formatted);
    return formatted;
  } catch (error) {
    console.error('Failed to fetch cart checkout URL:', error);
    return null;
  }
}

export async function createShopifyCart(variantId: string, quantity: number, lineAttributes?: Array<{ key: string; value: string }>): Promise<{ cartId: string; checkoutUrl: string; lineId: string } | null> {
  const lineInput: Record<string, unknown> = { quantity, merchandiseId: variantId };
  if (lineAttributes && lineAttributes.length > 0) {
    lineInput.attributes = lineAttributes;
  }

  const data = await storefrontApiRequest(CART_CREATE_MUTATION, {
    input: { lines: [lineInput] },
  });

  if (data?.data?.cartCreate?.userErrors?.length > 0) {
    console.error('Cart creation failed:', data.data.cartCreate.userErrors);
    return null;
  }

  const cart = data?.data?.cartCreate?.cart;
  if (!cart?.checkoutUrl) return null;

  const lineId = cart.lines.edges[0]?.node?.id;
  if (!lineId) return null;

  return { cartId: cart.id, checkoutUrl: formatCheckoutUrl(cart.checkoutUrl), lineId };
}

export async function addLineToShopifyCart(cartId: string, variantId: string, quantity: number, lineAttributes?: Array<{ key: string; value: string }>): Promise<{ success: boolean; lineId?: string; cartNotFound?: boolean }> {
  const lineInput: Record<string, unknown> = { quantity, merchandiseId: variantId };
  if (lineAttributes && lineAttributes.length > 0) {
    lineInput.attributes = lineAttributes;
  }

  const data = await storefrontApiRequest(CART_LINES_ADD_MUTATION, {
    cartId,
    lines: [lineInput],
  });

  const userErrors = data?.data?.cartLinesAdd?.userErrors || [];
  if (isCartNotFoundError(userErrors)) return { success: false, cartNotFound: true };
  if (userErrors.length > 0) {
    console.error('Add line failed:', userErrors);
    return { success: false };
  }

  const lines = data?.data?.cartLinesAdd?.cart?.lines?.edges || [];
  const newLine = lines.find((l: { node: { id: string; merchandise: { id: string } } }) => l.node.merchandise.id === variantId);
  return { success: true, lineId: newLine?.node?.id };
}

export async function updateShopifyCartLine(cartId: string, lineId: string, quantity: number): Promise<{ success: boolean; cartNotFound?: boolean }> {
  const data = await storefrontApiRequest(CART_LINES_UPDATE_MUTATION, {
    cartId,
    lines: [{ id: lineId, quantity }],
  });

  const userErrors = data?.data?.cartLinesUpdate?.userErrors || [];
  if (isCartNotFoundError(userErrors)) return { success: false, cartNotFound: true };
  if (userErrors.length > 0) return { success: false };
  return { success: true };
}

export async function removeLineFromShopifyCart(cartId: string, lineId: string): Promise<{ success: boolean; cartNotFound?: boolean }> {
  const data = await storefrontApiRequest(CART_LINES_REMOVE_MUTATION, {
    cartId,
    lineIds: [lineId],
  });

  const userErrors = data?.data?.cartLinesRemove?.userErrors || [];
  if (isCartNotFoundError(userErrors)) return { success: false, cartNotFound: true };
  if (userErrors.length > 0) return { success: false };
  return { success: true };
}

export async function fetchShopifyCart(cartId: string): Promise<{ exists: boolean; totalQuantity: number }> {
  const data = await storefrontApiRequest(CART_QUERY, { id: cartId });
  if (!data) return { exists: false, totalQuantity: 0 };
  const cart = data?.data?.cart;
  if (!cart) return { exists: false, totalQuantity: 0 };
  return { exists: true, totalQuantity: cart.totalQuantity };
}

export interface ShippingAddress {
  address1: string;
  city: string;
  province: string;
  zip: string;
  country: string;
}

export async function updateCartBuyerIdentity(
  cartId: string,
  deliveryAddress: ShippingAddress
): Promise<{ success: boolean; checkoutUrl?: string }> {
  try {
    const data = await storefrontApiRequest(CART_BUYER_IDENTITY_UPDATE_MUTATION, {
      cartId,
      buyerIdentity: {
        deliveryAddressPreferences: [
          {
            deliveryAddress: {
              address1: deliveryAddress.address1,
              city: deliveryAddress.city,
              province: deliveryAddress.province,
              zip: deliveryAddress.zip,
              country: deliveryAddress.country,
            },
          },
        ],
      },
    });

    const userErrors = data?.data?.cartBuyerIdentityUpdate?.userErrors || [];
    if (userErrors.length > 0) {
      console.error('Buyer identity update failed:', userErrors);
      return { success: false };
    }

    const checkoutUrl = data?.data?.cartBuyerIdentityUpdate?.cart?.checkoutUrl;
    return { success: true, checkoutUrl: checkoutUrl ? formatCheckoutUrl(checkoutUrl) : undefined };
  } catch (error) {
    console.error('Failed to update buyer identity:', error);
    return { success: false };
  }
}

export async function updateCartNote(cartId: string, note: string): Promise<boolean> {
  try {
    const data = await storefrontApiRequest(CART_NOTE_UPDATE_MUTATION, {
      cartId,
      note,
    });
    const userErrors = data?.data?.cartNoteUpdate?.userErrors || [];
    if (userErrors.length > 0) {
      console.error('Cart note update failed:', userErrors);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Failed to update cart note:', error);
    return false;
  }
}
