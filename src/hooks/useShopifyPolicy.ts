import { useEffect, useState } from "react";
import { storefrontApiRequest } from "@/lib/shopify";

export type ShopifyPolicyKey =
  | "shippingPolicy"
  | "refundPolicy"
  | "privacyPolicy"
  | "termsOfService"
  | "subscriptionPolicy";

interface PolicyData {
  title: string;
  body: string; // HTML
  url?: string;
}

interface State {
  loading: boolean;
  error: string | null;
  policy: PolicyData | null;
}

// Simple in-memory cache to avoid refetching across navigations.
const cache = new Map<ShopifyPolicyKey, PolicyData>();

const QUERY = (key: ShopifyPolicyKey) => `
  query {
    shop {
      ${key} {
        title
        body
        url
      }
    }
  }
`;

export function useShopifyPolicy(key: ShopifyPolicyKey): State {
  const [state, setState] = useState<State>(() => ({
    loading: !cache.has(key),
    error: null,
    policy: cache.get(key) ?? null,
  }));

  useEffect(() => {
    if (cache.has(key)) {
      setState({ loading: false, error: null, policy: cache.get(key)! });
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const data = await storefrontApiRequest(QUERY(key));
        const node = data?.data?.shop?.[key];
        if (cancelled) return;
        if (node && (node.body || node.title)) {
          cache.set(key, node);
          setState({ loading: false, error: null, policy: node });
        } else {
          setState({ loading: false, error: "Policy not published in Shopify.", policy: null });
        }
      } catch (err) {
        if (!cancelled) {
          setState({ loading: false, error: (err as Error).message || "Error", policy: null });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [key]);

  return state;
}