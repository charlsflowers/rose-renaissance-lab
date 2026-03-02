import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import Navbar from "@/components/Navbar";
import { Trash2, ArrowLeft, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

const Checkout = () => {
  const { items, removeItem, clearCart, cartTotal } = useCart();
  const navigate = useNavigate();

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
            <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
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
                  {/* Addons */}
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

                  {item.accessory !== "none" && (
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

                  {/* Delivery info */}
                  <div className="md:col-span-2 pt-3 border-t border-border mt-2">
                    <p className="text-muted-foreground mb-1">Entrega:</p>
                    <p className="text-foreground">
                      {item.deliveryMethod === "pickup" ? "Recoger en tienda" : `Domicilio — ${item.deliveryAddress}`}
                    </p>
                    {item.deliveryDate && (
                      <p className="text-foreground mt-1">
                        📅 {item.deliveryDate} {item.deliveryHour && `a las ${item.deliveryHour}`}
                      </p>
                    )}
                  </div>

                </div>

                {/* Item price */}
                <div className="flex justify-end mt-4 pt-3 border-t border-border">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground font-body">Subtotal bouquet</p>
                    <p className="font-display text-2xl font-bold text-foreground">${item.price}</p>
                    {item.deliveryCost > 0 && (
                      <p className="text-sm text-muted-foreground font-body">+ ${item.deliveryCost} envío</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Total */}
            <div className="bg-card border-2 border-primary/30 rounded-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-body text-sm text-muted-foreground">{items.length} {items.length === 1 ? "artículo" : "artículos"}</p>
                  <p className="font-display text-3xl font-bold text-foreground">
                    ${cartTotal} <span className="text-sm font-body text-muted-foreground font-normal">USD</span>
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    className="bg-primary text-primary-foreground px-10 py-4 font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors rounded-sm"
                    onClick={() => {
                      // Future: Shopify checkout integration
                      alert("¡Próximamente integración con Shopify para completar el pago!");
                    }}
                  >
                    Completar pedido
                  </button>
                  <button
                    onClick={clearCart}
                    className="text-sm font-body text-muted-foreground hover:text-destructive transition-colors"
                  >
                    Vaciar carrito
                  </button>
                </div>
              </div>
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
