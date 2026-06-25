import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import LegalDisclaimer from "@/components/LegalDisclaimer";
import { useShopifyPolicy, type ShopifyPolicyKey } from "@/hooks/useShopifyPolicy";
import { Loader2 } from "lucide-react";

interface Props {
  policyKey: ShopifyPolicyKey;
  fallbackTitle: string;
  seoTitle: string;
  seoDescription: string;
  path: string;
}

/**
 * Generic legal page that pulls its body straight from the Shopify Storefront
 * API (shop.<policyKey>). Body is HTML; rendered with prose-like styling that
 * matches the rest of the site (font-body, primary headings) without touching
 * brand tokens.
 */
const ShopifyPolicyPage = ({ policyKey, fallbackTitle, seoTitle, seoDescription, path }: Props) => {
  const { loading, error, policy } = useShopifyPolicy(policyKey);
  const title = policy?.title || fallbackTitle;

  return (
    <div className="min-h-screen bg-background">
      <SeoHead title={seoTitle} description={seoDescription} path={path} noindex />
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <h1 className="font-title-retro text-4xl text-primary text-center mb-8">{title}</h1>
          <div className="font-body text-sm text-muted-foreground leading-relaxed">
            {loading && (
              <div className="flex items-center justify-center py-12 text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
            )}
            {!loading && error && (
              <p className="text-destructive">Could not load this policy from Shopify. Please try again later.</p>
            )}
            {!loading && policy?.body && (
              <div
                className="shopify-policy-body space-y-4 [&_h1]:font-display [&_h1]:text-lg [&_h1]:font-semibold [&_h1]:text-foreground [&_h1]:pt-4 [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:pt-4 [&_h3]:font-display [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:pt-3 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-2 [&_a]:text-primary [&_a:hover]:underline [&_strong]:text-foreground"
                // Body comes straight from Shopify admin (merchant-controlled HTML).
                dangerouslySetInnerHTML={{ __html: policy.body }}
              />
            )}
            <LegalDisclaimer />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ShopifyPolicyPage;