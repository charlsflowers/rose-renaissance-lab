import { useEffect } from "react";
import { Link } from "@/i18n/LocalizedRouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd, { breadcrumbSchema, itemListSchema } from "@/components/JsonLd";
import { cityPages } from "@/lib/cityPagesData";
import { useTranslation } from "@/i18n/LanguageContext";
import { MapPin } from "lucide-react";

const CityIndexPage = () => {
  const { language } = useTranslation();
  const isEs = language === "es";

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const title = isEs
    ? "Envío de Flores a Todo EE.UU. | Rosas por FedEx | Charls Flowers"
    : "Nationwide Flower Delivery | Roses Shipped via FedEx | Charls Flowers";
  const description = isEs
    ? "Enviamos rosas frescas a 35 ciudades de EE.UU. por FedEx desde Miami. Caja de lujo aislada, llegada en 1–2 días hábiles."
    : "We ship fresh roses to 35 US cities via FedEx from Miami. Insulated luxury box, arrival in 1–2 business days.";

  const sorted = [...cityPages].sort((a, b) => a.name.localeCompare(b.name));

  const itemList = itemListSchema(
    sorted.map((c) => ({
      name: isEs ? `Envío de flores a ${c.name}` : `Flower delivery to ${c.name}`,
      url: isEs
        ? `https://www.charlsflowers.com/es/envio-de-flores/${c.slugEs}`
        : `https://www.charlsflowers.com/flower-delivery/${c.slug}`,
    })),
    isEs ? "Ciudades de envío" : "Shipping cities",
  );

  const breadcrumbs = breadcrumbSchema([
    { name: isEs ? "Inicio" : "Home", url: isEs ? "https://www.charlsflowers.com/es" : "https://www.charlsflowers.com" },
    {
      name: isEs ? "Envío de Flores" : "Flower Delivery",
      url: isEs ? "https://www.charlsflowers.com/es/envio-de-flores" : "https://www.charlsflowers.com/flower-delivery",
    },
  ]);

  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title={title}
        description={description}
        path="/flower-delivery"
        pathEs="/envio-de-flores"
      />
      <JsonLd data={[itemList, breadcrumbs]} />
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-5xl">
          <Breadcrumbs
            items={[
              { label: isEs ? "Inicio" : "Home", to: "/" },
              { label: isEs ? "Envío de Flores" : "Flower Delivery" },
            ]}
          />
          <h1 className="font-title-retro text-3xl md:text-5xl text-primary mb-4">
            {isEs ? "Envío de Flores a Todo EE.UU." : "Nationwide Flower Delivery"}
          </h1>
          <p className="font-body text-base md:text-lg text-muted-foreground leading-relaxed mb-10 max-w-3xl">
            {isEs
              ? "Enviamos rosas frescas desde Miami a 35 ciudades en EE.UU. por FedEx, en nuestra caja de lujo aislada con cold packs. Elige tu ciudad para ver tránsito, hub FedEx y barrios cubiertos."
              : "We ship fresh roses from Miami to 35 US cities via FedEx, in our insulated luxury box with cold packs. Pick your city to see transit, FedEx hub and neighborhoods covered."}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {sorted.map((c) => (
              <Link
                key={c.slug}
                to={isEs ? `/envio-de-flores/${c.slugEs}` : `/flower-delivery/${c.slug}`}
                className="group flex items-start gap-2 bg-cream/50 hover:bg-cream rounded-md px-3 py-3 transition-colors"
              >
                <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="font-body text-sm text-foreground group-hover:text-primary transition-colors">{c.name}</p>
                  <p className="font-body text-xs text-muted-foreground">{c.state}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CityIndexPage;