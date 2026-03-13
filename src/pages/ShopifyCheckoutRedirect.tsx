import { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";

const ShopifyCheckoutRedirect = () => {
  const { cartId } = useParams();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const params = searchParams.toString();
    const url = `https://charls-flowers.myshopify.com/cart/c/${cartId}${params ? `?${params}` : ""}`;
    window.location.href = url;
  }, [cartId, searchParams]);

  return null;
};

export default ShopifyCheckoutRedirect;
