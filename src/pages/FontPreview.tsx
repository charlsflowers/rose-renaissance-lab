import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

// Load all candidate fonts
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href =
  "https://fonts.googleapis.com/css2?family=Bungee+Shade&family=Righteous&family=Passion+One:wght@400;700&family=Pacifico&family=Lobster&family=Satisfy&family=Great+Vibes&family=Rouge+Script&family=Dancing+Script:wght@400;700&family=Luxurious+Script&display=swap";
document.head.appendChild(fontLink);

const titleFonts = [
  { name: "Righteous", css: "'Righteous', cursive", desc: "Retro redondeada, muy legible, estilo años 70" },
  { name: "Passion One", css: "'Passion One', cursive", desc: "Bold condensada, impacto retro fuerte" },
  { name: "Bungee Shade", css: "'Bungee Shade', cursive", desc: "Retro con sombra 3D, muy llamativa" },
  { name: "Lobster", css: "'Lobster', cursive", desc: "Script bold con toque retro, muy popular" },
  { name: "Pacifico", css: "'Pacifico', cursive", desc: "Retro californiana, amigable y memorable" },
];

const subtitleFonts = [
  { name: "Great Vibes", css: "'Great Vibes', cursive", desc: "Script elegante y fluida, estilo caligrafía formal" },
  { name: "Dancing Script", css: "'Dancing Script', cursive", desc: "Script casual elegante, muy legible" },
  { name: "Satisfy", css: "'Satisfy', cursive", desc: "Script suave y elegante, estilo beauty" },
  { name: "Rouge Script", css: "'Rouge Script', cursive", desc: "Script refinada, estilo salón vintage" },
  { name: "Luxurious Script", css: "'Luxurious Script', cursive", desc: "Script lujosa y ornamental" },
];

const FontPreview = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground font-body text-sm hover:text-primary transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <h1 className="font-display text-3xl font-bold text-foreground mb-2">Font Preview</h1>
        <p className="text-muted-foreground font-body mb-12">Elige la combinación que mejor represente tu marca.</p>

        {/* TITLE FONTS */}
        <div className="mb-16">
          <h2 className="font-display text-xl font-semibold text-foreground mb-1 border-b border-border pb-3">
            🔤 TÍTULOS PRINCIPALES
          </h2>
          <p className="text-muted-foreground font-body text-sm mb-6 mt-3">
            Alternativas a "Bright Retro" — para "Single Color Bouquets", "Mixed Bouquets", etc.
          </p>

          <div className="space-y-8">
            {titleFonts.map((font) => (
              <div key={font.name} className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-body text-xs tracking-widest uppercase text-gold">{font.name}</span>
                  <span className="font-body text-xs text-muted-foreground">{font.desc}</span>
                </div>
                <p style={{ fontFamily: font.css, fontSize: "2.5rem", lineHeight: 1.2 }} className="text-foreground">
                  Single Color Bouquets
                </p>
                <p style={{ fontFamily: font.css, fontSize: "2rem", lineHeight: 1.3 }} className="text-foreground mt-2">
                  Mixed Bouquets
                </p>
                <p style={{ fontFamily: font.css, fontSize: "1.5rem", lineHeight: 1.3 }} className="text-muted-foreground mt-2">
                  Room Decors
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* SUBTITLE FONTS */}
        <div className="mb-16">
          <h2 className="font-display text-xl font-semibold text-foreground mb-1 border-b border-border pb-3">
            ✍️ SUBTÍTULOS DE SECCIONES
          </h2>
          <p className="text-muted-foreground font-body text-sm mb-6 mt-3">
            Alternativas a "Beauty Salon Script" — para "Handcrafted Bouquets", "Transform any space", etc.
          </p>

          <div className="space-y-8">
            {subtitleFonts.map((font) => (
              <div key={font.name} className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-body text-xs tracking-widest uppercase text-gold">{font.name}</span>
                  <span className="font-body text-xs text-muted-foreground">{font.desc}</span>
                </div>
                <p style={{ fontFamily: font.css, fontSize: "2rem", lineHeight: 1.4 }} className="text-foreground">
                  Handcrafted Bouquets
                </p>
                <p style={{ fontFamily: font.css, fontSize: "1.5rem", lineHeight: 1.4 }} className="text-foreground mt-2">
                  Transform any space
                </p>
                <p style={{ fontFamily: font.css, fontSize: "1.25rem", lineHeight: 1.4 }} className="text-muted-foreground mt-2">
                  Create unforgettable moments
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* COMBINED PREVIEW */}
        <div>
          <h2 className="font-display text-xl font-semibold text-foreground mb-1 border-b border-border pb-3">
            🎨 COMBINACIONES SUGERIDAS
          </h2>
          <p className="text-muted-foreground font-body text-sm mb-6 mt-3">
            Así se verían juntas en una sección real.
          </p>

          {[
            { title: "Righteous", titleCss: "'Righteous', cursive", sub: "Great Vibes", subCss: "'Great Vibes', cursive" },
            { title: "Passion One", titleCss: "'Passion One', cursive", sub: "Satisfy", subCss: "'Satisfy', cursive" },
            { title: "Lobster", titleCss: "'Lobster', cursive", sub: "Dancing Script", subCss: "'Dancing Script', cursive" },
            { title: "Pacifico", titleCss: "'Pacifico', cursive", sub: "Rouge Script", subCss: "'Rouge Script', cursive" },
          ].map((combo) => (
            <div key={combo.title + combo.sub} className="bg-card border border-border rounded-lg p-8 mb-6 text-center">
              <span className="font-body text-[10px] tracking-widest uppercase text-gold mb-4 block">
                {combo.title} + {combo.sub}
              </span>
              <p style={{ fontFamily: combo.subCss, fontSize: "1.25rem" }} className="text-gold mb-2">
                Handcrafted Bouquets
              </p>
              <p style={{ fontFamily: combo.titleCss, fontSize: "2.5rem", lineHeight: 1.2 }} className="text-foreground">
                Single Color Bouquets
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FontPreview;
