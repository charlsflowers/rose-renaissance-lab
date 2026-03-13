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

  return edges.map((edge: { node: ShopifyHandleVariant }) => edge.node);
}

function parseNumericValue(value: string): number | null {
  const match = value.match(/\d+/);
  if (!match) return null;
  const parsed = Number(match[0]);
  return Number.isFinite(parsed) ? parsed : null;
}

export function findVariantByRoses(
  variants: ShopifyHandleVariant[],
  rosesCount: number
): ShopifyHandleVariant | null {
  const bySelectedOptions = variants.find((variant) => {
    const roseOption = variant.selectedOptions.find((option) =>
      option.name.toLowerCase().includes("rose")
    );

    if (roseOption) {
      return parseNumericValue(roseOption.value) === rosesCount;
    }

    return variant.selectedOptions.some((option) => parseNumericValue(option.value) === rosesCount);
  });

  if (bySelectedOptions) return bySelectedOptions;

  return variants.find((variant) => parseNumericValue(variant.title) === rosesCount) ?? null;
}
