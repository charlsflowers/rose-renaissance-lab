import { storefrontApiRequest } from "@/lib/shopify";

const GET_VARIANTS_BY_HANDLE_QUERY = `
  query getVariants($handle: String!) {
    productByHandle(handle: $handle) {
      metafield(namespace: "custom", key: "paper_color") {
        value
      }
      variants(first: 20) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            selectedOptions {
              name
              value
            }
          }
        }
      }
    }
  }
`;

export interface ShopifyHandleVariant {
  id: string;
  title: string;
  price?: { amount: string; currencyCode: string };
  selectedOptions: Array<{ name: string; value: string }>;
}

export function toShopifyHandle(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function fetchVariantsByHandle(handle: string): Promise<ShopifyHandleVariant[]> {
  if (!handle) return [];

  console.group(`🔍 [ShopifyVariants] fetchVariantsByHandle("${handle}")`);
  console.log("Handle sent to Storefront API:", handle);

  console.log("HANDLE FINAL:", handle);
  const data = await storefrontApiRequest(GET_VARIANTS_BY_HANDLE_QUERY, { handle });
  console.log("RESPUESTA API:", JSON.stringify(data));

  console.log("Raw API response:", JSON.stringify(data, null, 2));

  const product = data?.data?.productByHandle;
  if (!product) {
    console.warn("⚠️ productByHandle returned null — handle not found in Shopify");
    console.groupEnd();
    return [];
  }

  const edges = product?.variants?.edges ?? [];
  const variants = edges.map((edge: { node: ShopifyHandleVariant }) => edge.node);

  console.log(`✅ Found ${variants.length} variants:`);
  variants.forEach((v: ShopifyHandleVariant, i: number) => {
    console.log(`  [${i}] id=${v.id} title="${v.title}" options=${JSON.stringify(v.selectedOptions)}`);
  });
  console.groupEnd();

  return variants;
}

/** Get the price (as a number) from a Shopify variant matching a given roses count. */
export function getShopifyPrice(
  variants: ShopifyHandleVariant[],
  rosesCount: number
): number | null {
  const variant = findVariantByRoses(variants, rosesCount);
  if (!variant?.price?.amount) return null;
  return parseFloat(variant.price.amount);
}

/** Build dynamic size options from Shopify variants (roses count + price). */
export function buildShopifySizeOptions(
  variants: ShopifyHandleVariant[]
): Array<{ roses: number; price: number }> {
  return variants
    .map((v) => {
      const rosesOpt = v.selectedOptions.find((o) => o.name === "Roses");
      const rosesStr = rosesOpt?.value ?? v.title;
      const rosesNum = parseInt(rosesStr.replace(/\D/g, ""), 10);
      const price = v.price?.amount ? parseFloat(v.price.amount) : 0;
      return isNaN(rosesNum) ? null : { roses: rosesNum, price };
    })
    .filter(Boolean) as Array<{ roses: number; price: number }>;
}

export function findVariantByRoses(
  variants: ShopifyHandleVariant[],
  rosesCount: number
): ShopifyHandleVariant | null {
  const selectedRoses = String(rosesCount);

  console.group(`🔎 [ShopifyVariants] findVariantByRoses(${rosesCount})`);
  console.log("selectedRoses value:", selectedRoses, "| type:", typeof selectedRoses);
  console.log("Total variants to search:", variants.length);

  // First try matching by option named "Roses"
  let selectedVariant = variants.find((variant) =>
    variant.selectedOptions.some(
      (opt) => opt.name === "Roses" && opt.value === selectedRoses
    )
  );

  // Fallback: try matching by any option value equal to the roses count
  if (!selectedVariant) {
    selectedVariant = variants.find((variant) =>
      variant.selectedOptions.some((opt) => opt.value === selectedRoses)
    );
  }

  // Fallback: try matching by title containing the roses count
  if (!selectedVariant) {
    selectedVariant = variants.find((variant) =>
      variant.title.includes(selectedRoses)
    );
  }

  if (selectedVariant) {
    console.log("✅ Match found:", JSON.stringify(selectedVariant, null, 2));
    console.log("🆔 variantId for checkoutCreate:", selectedVariant.id);
  } else {
    console.warn("❌ No variant matched! Dumping all option values:");
    variants.forEach((v, i) => {
      const rosesOpt = v.selectedOptions.find(o => o.name === "Roses");
      console.log(`  [${i}] title="${v.title}" Roses option=${rosesOpt ? `"${rosesOpt.value}"` : "NOT FOUND"} allOptions=${JSON.stringify(v.selectedOptions)}`);
    });
    console.log("Was looking for selectedOptions.name='Roses' with value='" + selectedRoses + "'");
  }
  console.groupEnd();

  return selectedVariant ?? null;
}
