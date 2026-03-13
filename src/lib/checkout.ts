export function openCheckoutInNewTab(checkoutUrl: string) {
  const link = document.createElement("a");
  link.href = checkoutUrl;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
