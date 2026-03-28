import { Navigate, useParams } from "react-router-dom";
import { bouquetProducts } from "@/lib/catalogData";

/** Redirects old /bouquets/all/bq-round-XX URLs to new /bouquets/all/[shopifyHandle] */
const BouquetRedirect = () => {
  const { type, productId } = useParams<{ type: string; productId: string }>();
  
  // If productId starts with "bq-", it's an old URL — redirect to shopifyHandle
  if (productId && productId.startsWith("bq-")) {
    const product = bouquetProducts.find(p => p.id === productId);
    if (product) {
      return <Navigate to={`/bouquets/${type}/${product.shopifyHandle}`} replace />;
    }
  }
  
  return null;
};

export default BouquetRedirect;
