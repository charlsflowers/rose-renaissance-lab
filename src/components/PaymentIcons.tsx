// Intrinsic dimensions match the resized webp files (see public/payment-icons).
// Explicit width/height keep the browser from reflowing (CLS) before decode.
const icons = [
  { src: "/payment-icons/visa.webp", alt: "Visa", w: 112, h: 36 },
  { src: "/payment-icons/mastercard.webp", alt: "Mastercard", w: 112, h: 67 },
  { src: "/payment-icons/amex.webp", alt: "American Express", w: 112, h: 92 },
  { src: "/payment-icons/shop-pay.webp", alt: "Shop Pay", w: 112, h: 27 },
  { src: "/payment-icons/apple-pay.webp?v=3", alt: "Apple Pay", w: 112, h: 75 },
  { src: "/payment-icons/google-pay.webp", alt: "Google Pay", w: 112, h: 53 },
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
          width={icon.w}
          height={icon.h}
          loading="lazy"
          className="max-h-full max-w-full object-contain opacity-90"
        />
      </div>
    ))}
  </div>
);

export default PaymentIcons;
