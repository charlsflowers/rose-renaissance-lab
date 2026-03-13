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

  const data = await storefrontApiRequest(GET_VARIANTS_BY_HANDLE_QUERY, { handle });
  const edges = data?.data?.productByHandle?.variants?.edges ?? [];
  const variants = edges.map((edge: { node: ShopifyHandleVariant }) => edge.node);

  console.log("Full variants array:", variants);

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
