import { storefrontApiRequest } from "@/lib/shopify";

const GET_VARIANTS_BY_HANDLE_QUERY = `
  query getVariants($handle: String!) {
    productByHandle(handle: $handle) {
      variants(first: 20) {
        edges {
          node {
            id
            title
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

  const data = await storefrontApiRequest(GET_VARIANTS_BY_HANDLE_QUERY, { handle });

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

export function findVariantByRoses(
  variants: ShopifyHandleVariant[],
  rosesCount: number
): ShopifyHandleVariant | null {
  const selectedRoses = String(rosesCount);

  const selectedVariant = variants.find((variant) =>
    variant.selectedOptions.some(
      (opt) => opt.name === "Roses" && opt.value === selectedRoses
    )
  );

  if (!selectedVariant) {
    console.log("Full variants array:", variants);
    console.log("Selected roses value:", selectedRoses);
  }

  return selectedVariant ?? null;
}
