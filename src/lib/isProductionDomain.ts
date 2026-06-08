export const isProductionDomain = (): boolean => {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  return host === "charlsflowers.com" || host === "www.charlsflowers.com";
};
