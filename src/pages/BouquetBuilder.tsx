import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import heroBouquet from "@/assets/hero-bouquet.jpg";
import heartBouquet from "@/assets/heart-bouquet.jpg";
import letterBouquet from "@/assets/letter-bouquet.jpg";
import numberBouquet from "@/assets/number-bouquet.jpg";
import {
  colorOptions,
  sizeOptions,
  crownOptions,
  ribbonPresets,
  specialBouquetPrice,
  specialBouquetRoses,
  letterNumberExtraPrice,
  crownPrice,
  ribbonPrice,
  type ColorOption,
  type AccessoryType,
  type BouquetType,
} from "@/lib/productData";
import { Heart, Sparkles, Crown, Type, Hash, Check, Bug } from "lucide-react";

const BouquetBuilder = () => {
  const [bouquetType, setBouquetType] = useState<BouquetType>("classic");
  const [selectedColor, setSelectedColor] = useState<ColorOption>(colorOptions[5]); // Red default
  const [selectedSizeIdx, setSelectedSizeIdx] = useState(0);
  const [accessory, setAccessory] = useState<AccessoryType>("none");
  const [accessoryText, setAccessoryText] = useState("");
  const [addCrown, setAddCrown] = useState(false);
  const [crownSize, setCrownSize] = useState("small");
  const [addRibbon, setAddRibbon] = useState(false);
  const [ribbonType, setRibbonType] = useState<"names" | "congratulations">("names");
  const [ribbonText, setRibbonText] = useState("");
  const [specialText, setSpecialText] = useState("");
  const [heartColor, setHeartColor] = useState<"pink" | "red">("red");

  const isRed = selectedColor.name === "Rojo";
  const isSpecial = bouquetType !== "classic";

  const basePrice = useMemo(() => {
    if (isSpecial) {
      const charCount = specialText.length;
      return specialBouquetPrice + charCount * letterNumberExtraPrice;
    }
    const size = sizeOptions[selectedSizeIdx];
    return isRed ? size.priceRed : size.priceRegular;
  }, [isSpecial, specialText, selectedSizeIdx, isRed]);

  const totalPrice = useMemo(() => {
    let total = basePrice;
    if (addCrown) total += crownPrice;
    if (addRibbon) total += ribbonPrice;
    return total;
  }, [basePrice, addCrown, addRibbon]);

  const rosesCount = isSpecial ? specialBouquetRoses : sizeOptions[selectedSizeIdx].roses;

  const colorCategories = [
    { key: "natural" as const, label: "Naturales" },
    { key: "painted" as const, label: "Pintados" },
    { key: "glitter" as const, label: "Brillos ✨" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <p className="text-gold font-body text-sm tracking-[0.3em] uppercase mb-2">Personaliza</p>
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground">
              Crea tu Bouquet
            </h1>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-10">
            {/* Product Image */}
            <div className="relative overflow-hidden rounded-sm aspect-[16/9] mb-2">
              <img
                src={
                  bouquetType === "heart" ? heartBouquet
                    : bouquetType === "letters" ? letterBouquet
                    : bouquetType === "numbers" ? numberBouquet
                    : heroBouquet
                }
                alt={`Bouquet ${bouquetType}`}
                className="w-full h-full object-cover transition-opacity duration-500"
                key={bouquetType}
              />
            </div>

            {/* 1. Bouquet Type */}
            <Section title="Tipo de Bouquet" step={1}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {([
                  { type: "classic" as const, label: "Clásico", icon: Sparkles },
                  { type: "heart" as const, label: "Corazón", icon: Heart },
                  { type: "letters" as const, label: "Con Letras", icon: Type },
                  { type: "numbers" as const, label: "Con Números", icon: Hash },
                ]).map(({ type, label, icon: Icon }) => (
                  <button
                    key={type}
                    onClick={() => setBouquetType(type)}
                    className={`flex flex-col items-center gap-2 p-5 rounded-sm border-2 transition-all font-body text-sm ${
                      bouquetType === type
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/30"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {label}
                  </button>
                ))}
              </div>

              {/* Heart color */}
              {bouquetType === "heart" && (
                <div className="mt-4 flex gap-3">
                  <p className="text-sm text-muted-foreground font-body mr-2 self-center">Color:</p>
                  {(["red", "pink"] as const).map((c) => (
                    <button
                      key={c}
                      onClick={() => setHeartColor(c)}
                      className={`px-4 py-2 rounded-sm border-2 text-sm font-body transition-all ${
                        heartColor === c ? "border-primary bg-primary/5" : "border-border"
                      }`}
                    >
                      {c === "red" ? "Rojo" : "Rosa"}
                    </button>
                  ))}
                </div>
              )}

              {/* Letters/Numbers input */}
              {(bouquetType === "letters" || bouquetType === "numbers") && (
                <div className="mt-4">
                  <label className="text-sm text-muted-foreground font-body block mb-2">
                    {bouquetType === "letters" ? "Escribe las letras" : "Escribe los números"}{" "}
                    <span className="text-primary">(+${letterNumberExtraPrice} c/u)</span>
                  </label>
                  <input
                    type={bouquetType === "numbers" ? "text" : "text"}
                    value={specialText}
                    onChange={(e) => setSpecialText(
                      bouquetType === "numbers"
                        ? e.target.value.replace(/[^0-9]/g, "")
                        : e.target.value.toUpperCase().replace(/[^A-Z]/g, "")
                    )}
                    placeholder={bouquetType === "letters" ? "Ej: LOVE" : "Ej: 25"}
                    className="w-full max-w-xs bg-card border border-border rounded-sm px-4 py-3 font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    maxLength={10}
                  />
                </div>
              )}
            </Section>

            {/* 2. Color (only for classic) */}
            {!isSpecial && (
              <Section key="color-section" title="Color de las Rosas" step={2}>
                {colorCategories.map(({ key, label }) => {
                  const colors = colorOptions.filter((c) => c.category === key);
                  return (
                    <div key={key} className="mb-5">
                      <p className="text-xs uppercase tracking-widest text-muted-foreground font-body mb-3">
                        {label}
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {colors.map((color) => (
                          <button
                            key={color.name}
                            onClick={() => setSelectedColor(color)}
                            className={`relative w-12 h-12 rounded-full border-2 transition-all ${
                              selectedColor.name === color.name
                                ? "border-primary scale-110 shadow-lg"
                                : "border-border hover:scale-105"
                            } ${color.category === "glitter" ? "overflow-hidden" : ""}`}
                            style={{ backgroundColor: color.hex }}
                            title={color.name}
                          >
                            {color.category === "glitter" && (
                              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/40 to-transparent animate-pulse" />
                            )}
                            {selectedColor.name === color.name && (
                              <Check className={`w-4 h-4 absolute inset-0 m-auto ${
                                ["Negro", "Azul", "Morado", "Morado Brillos"].includes(color.name) ? "text-primary-foreground" : "text-foreground"
                              }`} />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
                <p className="text-sm font-body text-muted-foreground">
                  Seleccionado: <span className="text-foreground font-semibold">{selectedColor.name}</span>
                  {isRed && <span className="text-primary ml-2">(Precio especial rojo)</span>}
                </p>
              </Section>
            )}

            {/* 3. Size (only classic) */}
            {!isSpecial && (
              <Section key="size-section" title="Cantidad de Rosas" step={3}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {sizeOptions.map((size, idx) => (
                    <button
                      key={size.roses}
                      onClick={() => setSelectedSizeIdx(idx)}
                      className={`p-4 rounded-sm border-2 text-center transition-all ${
                        selectedSizeIdx === idx
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/30"
                      }`}
                    >
                      <p className="font-display text-2xl font-semibold text-foreground">{size.roses}</p>
                      <p className="text-xs text-muted-foreground font-body">rosas</p>
                      <p className="text-sm font-body font-semibold text-primary mt-1">
                        ${isRed ? size.priceRed : size.priceRegular}
                      </p>
                    </button>
                  ))}
                </div>
              </Section>
            )}

            {/* Special info */}
            {isSpecial && (
              <Section key="special-section" title="Detalles" step={2}>
                <div className="bg-card border border-border rounded-sm p-5">
                  <p className="font-body text-sm text-muted-foreground">
                    <span className="text-foreground font-semibold">{specialBouquetRoses} rosas</span> · Precio base:{" "}
                    <span className="text-primary font-semibold">${specialBouquetPrice}</span>
                    {specialText.length > 0 && (
                      <>
                        {" "}+ {specialText.length} {bouquetType === "letters" ? "letras" : "números"} × ${letterNumberExtraPrice} ={" "}
                        <span className="text-primary font-semibold">
                          ${specialBouquetPrice + specialText.length * letterNumberExtraPrice}
                        </span>
                      </>
                    )}
                  </p>
                </div>
              </Section>
            )}

            {/* 4. Accessories */}
            <Section title="Accesorios" step={isSpecial ? 3 : 4} subtitle="Gratis">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {([
                  { type: "none" as const, label: "Sin accesorio", icon: null },
                  { type: "note" as const, label: "Nota", icon: Type },
                  { type: "card" as const, label: "Tarjeta", icon: Sparkles },
                  { type: "butterfly" as const, label: "Mariposas", icon: Bug },
                ] as const).map(({ type, label, icon: Icon }) => (
                  <button
                    key={type}
                    onClick={() => setAccessory(type)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-sm border-2 transition-all font-body text-sm ${
                      accessory === type
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/30"
                    }`}
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    {label}
                    <span className="text-xs text-secondary">Gratis</span>
                  </button>
                ))}
              </div>
              {(accessory === "note" || accessory === "card") && (
                <textarea
                  value={accessoryText}
                  onChange={(e) => setAccessoryText(e.target.value)}
                  placeholder={`Escribe tu ${accessory === "note" ? "nota" : "tarjeta"}...`}
                  className="w-full mt-4 bg-card border border-border rounded-sm px-4 py-3 font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[100px] resize-none"
                  maxLength={200}
                />
              )}
            </Section>

            {/* 5. Upsells */}
            <Section title="Extras" step={isSpecial ? 4 : 5}>
              {/* Crown */}
              <div className={`p-5 rounded-sm border-2 transition-all mb-4 ${
                addCrown ? "border-primary bg-primary/5" : "border-border"
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Crown className="w-5 h-5 text-gold" />
                    <div>
                      <p className="font-body font-semibold text-foreground">Corona</p>
                      <p className="text-xs text-muted-foreground font-body">+${crownPrice}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setAddCrown(!addCrown)}
                    className={`w-12 h-7 rounded-full transition-all relative ${
                      addCrown ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-primary-foreground absolute top-1 transition-all ${
                      addCrown ? "left-6" : "left-1"
                    }`} />
                  </button>
                </div>
                {addCrown && (
                  <div className="mt-4 flex gap-3">
                    {crownOptions.map((c) => (
                      <button
                        key={c.size}
                        onClick={() => setCrownSize(c.size)}
                        className={`px-4 py-2 rounded-sm border-2 text-sm font-body transition-all ${
                          crownSize === c.size ? "border-primary bg-primary/5" : "border-border"
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Ribbon */}
              <div className={`p-5 rounded-sm border-2 transition-all ${
                addRibbon ? "border-primary bg-primary/5" : "border-border"
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-gold" />
                    <div>
                      <p className="font-body font-semibold text-foreground">Cinta Personalizada</p>
                      <p className="text-xs text-muted-foreground font-body">+${ribbonPrice}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setAddRibbon(!addRibbon)}
                    className={`w-12 h-7 rounded-full transition-all relative ${
                      addRibbon ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-primary-foreground absolute top-1 transition-all ${
                      addRibbon ? "left-6" : "left-1"
                    }`} />
                  </button>
                </div>
                {addRibbon && (
                  <div className="mt-4 space-y-4">
                    <div className="flex gap-3">
                      {(["names", "congratulations"] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => setRibbonType(t)}
                          className={`px-4 py-2 rounded-sm border-2 text-sm font-body transition-all ${
                            ribbonType === t ? "border-primary bg-primary/5" : "border-border"
                          }`}
                        >
                          {t === "names" ? "Nombres" : "Felicitaciones"}
                        </button>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {ribbonPresets.map((preset) => (
                        <button
                          key={preset}
                          onClick={() => setRibbonText(preset)}
                          className={`px-3 py-1.5 rounded-full text-xs font-body transition-all ${
                            ribbonText === preset
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground hover:bg-primary/10"
                          }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={ribbonText}
                      onChange={(e) => setRibbonText(e.target.value)}
                      placeholder="O escribe tu texto personalizado..."
                      className="w-full bg-card border border-border rounded-sm px-4 py-3 font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      maxLength={50}
                    />
                  </div>
                )}
              </div>
            </Section>

            {/* Summary */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="sticky bottom-0 bg-card/95 backdrop-blur-md border border-border rounded-sm p-6 shadow-xl"
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <p className="font-body text-sm text-muted-foreground">
                    {rosesCount} rosas · {isSpecial ? (bouquetType === "heart" ? "Corazón" : bouquetType === "letters" ? "Letras" : "Números") : selectedColor.name}
                    {addCrown && " · Corona"}
                    {addRibbon && " · Cinta"}
                    {accessory !== "none" && ` · ${accessory === "note" ? "Nota" : accessory === "card" ? "Tarjeta" : "Mariposas"}`}
                  </p>
                  <p className="font-display text-3xl font-bold text-foreground">
                    ${totalPrice} <span className="text-sm font-body text-muted-foreground font-normal">USD</span>
                  </p>
                </div>
                <button className="w-full md:w-auto bg-primary text-primary-foreground px-10 py-4 font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors rounded-sm">
                  Añadir al carrito
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Section = ({
  title,
  step,
  subtitle,
  children,
}: {
  title: string;
  step: number;
  subtitle?: string;
  children: React.ReactNode;
}) => (
  <div>
    <div className="flex items-center gap-3 mb-4">
      <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-display text-sm font-semibold">
        {step}
      </span>
      <h2 className="font-display text-xl font-semibold text-foreground">{title}</h2>
      {subtitle && (
        <span className="bg-secondary text-secondary-foreground text-xs px-2 py-0.5 rounded-full font-body">
          {subtitle}
        </span>
      )}
    </div>
    {children}
  </div>
);

export default BouquetBuilder;
