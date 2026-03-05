import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import Navbar from "@/components/Navbar";
import DeliveryCalculator from "@/components/DeliveryCalculator";
import { Trash2, ArrowLeft, Truck, Store } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import { motion } from "framer-motion";

const Checkout = () => {
  const { items, removeItem, clearCart, cartTotal } = useCart();
  const navigate = useNavigate();

  const [checkoutDeliveryMethod, setCheckoutDeliveryMethod] = useState<"pickup" | "delivery">(
    items.some((i) => i.deliveryMethod === "delivery") ? "delivery" : "pickup"
  );

  const [deliveryResult, setDeliveryResult] = useState<{
    miles: number;
    cost: number;
    address: string;
    duration?: string;
  } | null>(null);

  const needsAddress = checkoutDeliveryMethod === "delivery";
  const deliveryCost = needsAddress && deliveryResult ? deliveryResult.cost : 0;
  const grandTotal = cartTotal + deliveryCost;
  const canCheckout = !needsAddress || deliveryResult !== null;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto px-6"
          >
            <BrandLogo className="w-20 h-20 mx-auto mb-6" />
            <h1 className="font-display text-3xl font-semibold text-foreground mb-3">Tu carrito está vacío</h1>
            <p className="text-muted-foreground font-body mb-8">
              Añade un bouquet personalizado para continuar.
            </p>
            <Link
              to="/bouquets"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors rounded-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Crear bouquet
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-gold font-body text-sm tracking-[0.3em] uppercase mb-2">Checkout</p>
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground">
              Tu Pedido
            </h1>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {items.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-card border border-border rounded-sm p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-display text-xl font-semibold text-foreground">
                      Bouquet {item.bouquetType === "classic" ? "Clásico" : item.bouquetType === "heart" ? "Corazón" : item.bouquetType === "letters" ? "Con Letras" : "Con Números"}
                    </h3>
                    <p className="text-sm font-body text-muted-foreground mt-1">
                      {item.roses} rosas · {item.color}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors p-1"
                    title="Eliminar"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-body">
                  {item.addons.length > 0 && (
                    <div>
                      <p className="text-muted-foreground mb-1">Extras:</p>
                      <p className="text-foreground">{item.addons.join(", ")}</p>
                    </div>
                  )}

                  {item.specialText && (
                    <div>
                      <p className="text-muted-foreground mb-1">Texto:</p>
                      <p className="text-foreground font-semibold">{item.specialText}</p>
                    </div>
                  )}

                  {item.accessory !== "none" && item.accessory !== "" && (
                    <div>
                      <p className="text-muted-foreground mb-1">Accesorio:</p>
                      <p className="text-foreground">
                        {item.accessory === "note" ? "Nota" : item.accessory === "card" ? "Tarjeta" : "Mariposas"}
                        {item.accessoryText && `: "${item.accessoryText}"`}
                      </p>
                    </div>
                  )}

                  {item.ribbonText && (
                    <div>
                      <p className="text-muted-foreground mb-1">Cinta:</p>
                      <p className="text-foreground">"{item.ribbonText}"</p>
                    </div>
                  )}

                  {/* Delivery method indicator */}
                  <div className="md:col-span-2 pt-3 border-t border-border mt-2">
                    <p className="text-muted-foreground mb-1">Entrega:</p>
                    <p className="text-foreground inline-flex items-center gap-2">
                      {item.deliveryMethod === "pickup" ? (
                        <>
                          <Store className="w-4 h-4" />
                          Recoger en tienda
                        </>
                      ) : (
                        <>
                          <Truck className="w-4 h-4" />
                          Entrega a domicilio
                        </>
                      )}
                    </p>
                  </div>
                </div>

                {/* Item price */}
                <div className="flex justify-end mt-4 pt-3 border-t border-border">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground font-body">Subtotal</p>
                    <p className="font-display text-2xl font-bold text-foreground">${item.price}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Delivery method selector */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border-2 border-primary/20 rounded-sm p-6 space-y-5"
            >
              <p className="font-body font-semibold text-foreground text-sm">Método de entrega</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => { setCheckoutDeliveryMethod("pickup"); setDeliveryResult(null); }}
                  className={`flex flex-col items-center gap-2 p-4 rounded-sm border-2 transition-all font-body text-xs ${
                    checkoutDeliveryMethod === "pickup"
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  <Store className="w-5 h-5" />
                  Recoger en tienda
                </button>
                <button
                  onClick={() => { setCheckoutDeliveryMethod("delivery"); setDeliveryResult(null); }}
                  className={`flex flex-col items-center gap-2 p-4 rounded-sm border-2 transition-all font-body text-xs ${
                    checkoutDeliveryMethod === "delivery"
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  <Truck className="w-5 h-5" />
                  Entrega a domicilio
                </button>
              </div>

              {checkoutDeliveryMethod === "pickup" && (
                <p className="font-body text-sm text-muted-foreground">
                  📍 Recogida en: <span className="font-semibold text-foreground">7255 NW 12th St, Miami, FL 33126</span>
                </p>
              )}

              {checkoutDeliveryMethod === "delivery" && (
                <DeliveryCalculator onResult={setDeliveryResult} />
              )}
            </motion.div>

            {/* Total + CTA */}
            <div className="bg-card border-2 border-primary/30 rounded-sm p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="font-body text-sm text-muted-foreground">
                    {items.length} {items.length === 1 ? "artículo" : "artículos"}
                  </p>
                  <div className="space-y-1">
                    <p className="font-body text-sm text-muted-foreground">
                      Subtotal: <span className="text-foreground font-semibold">${cartTotal}</span>
                    </p>
                    {needsAddress && (
                      <p className="font-body text-sm text-muted-foreground">
                        Envío: <span className="text-foreground font-semibold">
                          {deliveryResult ? `$${deliveryCost}` : "Pendiente"}
                        </span>
                      </p>
                    )}
                    <p className="font-display text-3xl font-bold text-foreground">
                      ${grandTotal} <span className="text-sm font-body text-muted-foreground font-normal">USD</span>
                    </p>
                  </div>
                </div>
                <button
                  disabled={!canCheckout}
                  className="bg-primary text-primary-foreground px-10 py-4 font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => {
                    alert("¡Próximamente integración con Shopify para completar el pago!");
                  }}
                >
                  Completar pedido
                </button>
              </div>

              {!canCheckout && (
                <p className="text-xs font-body text-muted-foreground mt-3">
                  ⚠️ Introduce una dirección de entrega válida para continuar.
                </p>
              )}
            </div>

            {/* Continue shopping */}
            <div className="text-center pt-4">
              <Link
                to="/bouquets"
                className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Seguir comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
