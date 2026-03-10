import { toast } from "sonner";
import type { PricingTier } from "@/lib/productData";

const SHOPIFY_API_VERSION = '2025-07';
const SHOPIFY_STORE_PERMANENT_DOMAIN = 'ztdjk5-wn.myshopify.com';
const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
const SHOPIFY_STOREFRONT_TOKEN = '4e7516581c2c609bb77d69b5f1786a9b';

// Map pricing tiers to Shopify product tags
const TIER_TAG_MAP: Record<PricingTier, string> = {
  standard: 'bouquet, standard',
  red: 'bouquet, red',
  painted: 'bouquet, painted',
  mix2: 'bouquet, mix2',
  mix2painted: 'bouquet, mix2painted',
  mix3red: 'bouquet, mix3red',
};

// Shopify product titles by tier (for tag-based lookup)
const TIER_PRODUCT_TITLE: Record<PricingTier, string> = {
  standard: 'Standard Bouquet',
  red: 'Red Rose Bouquet',
  painted: 'Painted Rose Bouquet',
  mix2: 'Two-Color Mix Bouquet',
  mix2painted: 'Painted Mix Bouquet',
  mix3red: 'Three-Color Red Mix Bouquet',
};

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
  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

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

const PRODUCTS_BY_TITLE_QUERY = `
  query GetProductByTitle($query: String!) {
    products(first: 1, query: $query) {
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

/**
 * Resolve the Shopify variant GID for a given pricing tier and roses count.
 */
export async function resolveVariantId(
  tier: PricingTier,
  rosesCount: number
): Promise<ShopifyVariant | null> {
  const cacheKey = `${tier}-${rosesCount}`;
  if (variantCache.has(cacheKey)) {
    return variantCache.get(cacheKey)!;
  }

  try {
    const productTitle = TIER_PRODUCT_TITLE[tier];
    const data = await storefrontApiRequest(PRODUCTS_BY_TITLE_QUERY, {
      query: `title:"${productTitle}"`,
    });

    if (!data) return null;

    const product = data.data?.products?.edges?.[0]?.node as ShopifyProductNode | undefined;
    if (!product) {
      console.error(`No Shopify product found for tier "${tier}" (title: "${productTitle}")`);
      return null;
    }

    // Find variant matching roses count
    const variant = product.variants.edges.find(
      (v) => v.node.title === String(rosesCount) || 
             v.node.selectedOptions.some(o => o.name === 'Roses' && o.value === String(rosesCount))
    )?.node;

    if (!variant) {
      console.error(`No variant found for ${rosesCount} roses in product "${productTitle}"`);
      return null;
    }

    // Cache all variants from this product
    product.variants.edges.forEach((v) => {
      const roses = v.node.selectedOptions.find(o => o.name === 'Roses')?.value || v.node.title;
      variantCache.set(`${tier}-${roses}`, v.node);
    });

    return variant;
  } catch (error) {
    console.error('Error resolving Shopify variant:', error);
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

function formatCheckoutUrl(checkoutUrl: string): string {
  try {
    const url = new URL(checkoutUrl);
    url.searchParams.set('channel', 'online_store');
    return url.toString();
  } catch {
    return checkoutUrl;
  }
}

function isCartNotFoundError(userErrors: Array<{ field: string[] | null; message: string }>): boolean {
  return userErrors.some(e => e.message.toLowerCase().includes('cart not found') || e.message.toLowerCase().includes('does not exist'));
}

export async function createShopifyCart(variantId: string, quantity: number): Promise<{ cartId: string; checkoutUrl: string; lineId: string } | null> {
  const data = await storefrontApiRequest(CART_CREATE_MUTATION, {
    input: { lines: [{ quantity, merchandiseId: variantId }] },
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

export async function addLineToShopifyCart(cartId: string, variantId: string, quantity: number): Promise<{ success: boolean; lineId?: string; cartNotFound?: boolean }> {
  const data = await storefrontApiRequest(CART_LINES_ADD_MUTATION, {
    cartId,
    lines: [{ quantity, merchandiseId: variantId }],
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
