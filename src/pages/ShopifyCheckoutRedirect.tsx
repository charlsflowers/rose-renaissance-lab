import { useEffect } from "react";
import { useParams } from "react-router-dom";

const ShopifyCheckoutRedirect = () => {
  const { cartId } = useParams();

  useEffect(() => {
    if (!cartId) return;

    const params = new URLSearchParams(window.location.search);
    const key = params.get("key");

    window.location.replace(`https://charls-flowers.myshopify.com/cart/c/${cartId}?key=${key}`);
  }, [cartId]);

  return null;
};

export default ShopifyCheckoutRedirect;
