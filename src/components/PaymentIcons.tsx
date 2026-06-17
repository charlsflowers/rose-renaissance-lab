import shopPayAsset from "@/assets/shop-pay.webp.asset.json";

const icons = [
  { src: "/payment-icons/visa.webp", alt: "Visa" },
  { src: "/payment-icons/mastercard.webp", alt: "Mastercard" },
  { src: "/payment-icons/amex.webp", alt: "American Express" },
  { src: shopPayAsset.url, alt: "Shop Pay" },
  { src: "/payment-icons/apple-pay.webp?v=3", alt: "Apple Pay" },
  { src: "/payment-icons/google-pay.webp", alt: "Google Pay" },
];

interface Props {
  className?: string;
  size?: number;
}

const PaymentIcons = ({ className = "", size = 24 }: Props) => (
  <div
    className={`flex items-center justify-center flex-wrap gap-3 ${className}`}
    aria-label="Accepted payment methods"
  >
    {icons.map((icon) => (
      <div
        key={icon.alt}
        style={{ height: size, width: size * 1.6 }}
        className="flex items-center justify-center"
      >
        <img
          src={icon.src}
          alt={icon.alt}
          loading="lazy"
          className="max-h-full max-w-full object-contain opacity-90"
        />
      </div>
    ))}
  </div>
);

export default PaymentIcons;
