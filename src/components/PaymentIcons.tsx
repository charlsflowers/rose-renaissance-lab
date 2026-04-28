const icons = [
  { src: "/payment-icons/visa.svg", alt: "Visa" },
  { src: "/payment-icons/mastercard.svg", alt: "Mastercard" },
  { src: "/payment-icons/amex.svg", alt: "American Express" },
  { src: "/payment-icons/apple-pay.svg", alt: "Apple Pay" },
  { src: "/payment-icons/google-pay.svg", alt: "Google Pay" },
  { src: "/payment-icons/zelle.svg", alt: "Zelle" },
];

interface Props {
  className?: string;
  size?: number;
}

const PaymentIcons = ({ className = "", size = 24 }: Props) => (
  <div
    className={`flex items-center justify-center flex-wrap gap-2 ${className}`}
    aria-label="Accepted payment methods"
  >
    {icons.map((icon) => (
      <img
        key={icon.alt}
        src={icon.src}
        alt={icon.alt}
        loading="lazy"
        style={{ height: size, width: "auto" }}
        className="object-contain opacity-90"
      />
    ))}
  </div>
);

export default PaymentIcons;
