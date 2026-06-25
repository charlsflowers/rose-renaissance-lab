import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "@/i18n/LocalizedRouter";
import { Truck, MapPin, Clock, Package, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd, { breadcrumbSchema } from "@/components/JsonLd";
import { findCityBySlug } from "@/lib/cityPagesData";
import { useTranslation } from "@/i18n/LanguageContext";
import NotFound from "@/pages/NotFound";

const CityShippingPage = () => {
  const { city: citySlug } = useParams<{ city: string }>();
  const { language } = useTranslation();
  const city = citySlug ? findCityBySlug(citySlug) : undefined;

  useEffect(() => { window.scrollTo(0, 0); }, [citySlug]);

  if (!city) return <NotFound />;

  const isEs = language === "es";
  const h1 = isEs
    ? `Envío de Flores a ${city.name}, ${city.state}`
    : `Flower Delivery in ${city.name}, ${city.state}`;
  const sub = isEs
    ? `Rosas frescas enviadas desde Miami por FedEx — empacadas en nuestra caja de lujo aislada y entregadas a tu puerta en ${city.name}.`
    : `Fresh roses shipped from Miami via FedEx — packed in our insulated luxury box and delivered to your door in ${city.name}.`;

  const title = isEs
    ? `Envío de Flores a ${city.name} | Rosas Frescas por FedEx | Charls Flowers`
    : `Flower Delivery in ${city.name} ${city.state} | Roses Shipped Nationwide | Charls Flowers`;
  const description = isEs
    ? `Envío de rosas frescas a ${city.name}, ${city.state} por FedEx desde Miami. Hub: ${city.fedexHub.es}. Tránsito: ${city.fedexHub.transitDays}. Caja de lujo aislada.`
    : `Send fresh roses to ${city.name}, ${city.state} via FedEx from Miami. Hub: ${city.fedexHub.en}. Transit: ${city.fedexHub.transitDays}. Insulated luxury box.`;

  const path = `/flower-delivery/${city.slug}`;
  const pathEs = `/envio-de-flores/${city.slugEs}`;
  const enUrl = `https://www.charlsflowers.com${path}`;
  const esUrl = `https://www.charlsflowers.com/es${pathEs}`;

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: isEs ? `Envío de flores a ${city.name}` : `Flower delivery to ${city.name}`,
    serviceType: isEs ? "Envío nacional de flores por FedEx" : "Nationwide flower delivery via FedEx",
    provider: { "@id": "https://www.charlsflowers.com/#localbusiness" },
    areaServed: {
      "@type": "City",
      name: city.name,
      containedInPlace: { "@type": "State", name: city.stateFull },
    },
    description: isEs ? city.intro.es : city.intro.en,
    url: isEs ? esUrl : enUrl,
  };

  const breadcrumbs = breadcrumbSchema([
    { name: isEs ? "Inicio" : "Home", url: isEs ? "https://www.charlsflowers.com/es" : "https://www.charlsflowers.com" },
    { name: isEs ? "Envío de Flores" : "Flower Delivery", url: isEs ? `https://www.charlsflowers.com/es/envio-de-flores` : `https://www.charlsflowers.com/flower-delivery` },
    { name: city.name, url: isEs ? esUrl : enUrl },
  ]);

  return (
    <div className="min-h-screen bg-background">
      <SeoHead title={title} description={description} path={path} pathEs={pathEs} />
      <JsonLd data={[serviceSchema, breadcrumbs]} />
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <Breadcrumbs
            items={[
              { label: isEs ? "Inicio" : "Home", to: "/" },
              { label: isEs ? "Envío de Flores" : "Flower Delivery", to: isEs ? "/envio-de-flores" : "/flower-delivery" },
              { label: city.name },
            ]}
          />
          <h1 className="font-title-retro text-3xl md:text-5xl text-primary mb-4">{h1}</h1>
          <p className="font-body text-base md:text-lg text-muted-foreground leading-relaxed mb-8">{sub}</p>

          <div className="bg-cream rounded-lg p-6 md:p-8 mb-10">
            <p className="font-body text-sm md:text-base text-foreground leading-relaxed whitespace-pre-line">
              {isEs ? city.intro.es : city.intro.en}
            </p>
          </div>

          {/* FedEx logistics */}
          <div className="grid md:grid-cols-3 gap-4 mb-12">
            <div className="bg-white border border-border rounded-lg p-5">
              <Truck className="w-5 h-5 text-primary mb-2" />
              <p className="font-body text-xs uppercase tracking-wider text-muted-foreground mb-1">{isEs ? "Hub FedEx" : "FedEx Hub"}</p>
              <p className="font-body text-sm text-foreground">{isEs ? city.fedexHub.es : city.fedexHub.en}</p>
            </div>
            <div className="bg-white border border-border rounded-lg p-5">
              <Clock className="w-5 h-5 text-primary mb-2" />
              <p className="font-body text-xs uppercase tracking-wider text-muted-foreground mb-1">{isEs ? "Tránsito" : "Transit"}</p>
              <p className="font-body text-sm text-foreground">{city.fedexHub.transitDays}</p>
            </div>
            <div className="bg-white border border-border rounded-lg p-5">
              <Package className="w-5 h-5 text-primary mb-2" />
              <p className="font-body text-xs uppercase tracking-wider text-muted-foreground mb-1">{isEs ? "Empaque" : "Packaging"}</p>
              <p className="font-body text-sm text-foreground">{isEs ? "Caja de lujo aislada con cold packs" : "Insulated luxury box with cold packs"}</p>
            </div>
          </div>

          {/* Local touch */}
          <section className="mb-12">
            <h2 className="font-title-retro text-2xl md:text-3xl text-foreground mb-4">
              {isEs ? `Por qué ${city.name} es distinto` : `Why ${city.name} is different`}
            </h2>
            <p className="font-body text-sm md:text-base text-muted-foreground leading-relaxed">
              {isEs ? city.localTouch.es : city.localTouch.en}
            </p>
          </section>

          {/* Neighborhoods + ZIPs */}
          <section className="mb-12">
            <h2 className="font-title-retro text-2xl md:text-3xl text-foreground mb-4">
              {isEs ? `Barrios que cubrimos en ${city.name}` : `Neighborhoods we cover in ${city.name}`}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {city.neighborhoods.map((n, i) => (
                <div key={n} className="flex items-start gap-2 bg-cream/50 rounded-md px-3 py-2">
                  <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-body text-sm text-foreground">{n}</p>
                    {city.zips[i] && (
                      <p className="font-body text-xs text-muted-foreground">{city.zips[i]}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Occasions */}
          <section className="mb-12">
            <h2 className="font-title-retro text-2xl md:text-3xl text-foreground mb-4">
              {isEs ? `Ocasiones populares en ${city.name}` : `Popular occasions in ${city.name}`}
            </h2>
            <ul className="space-y-2">
              {city.occasions.map((o, i) => (
                <li key={i} className="flex items-start gap-2 font-body text-sm md:text-base text-foreground">
                  <span className="text-primary mt-1">•</span>
                  <span>{isEs ? o.es : o.en}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* CTAs */}
          <section className="bg-primary/5 border border-primary/20 rounded-lg p-6 md:p-8 text-center">
            <h2 className="font-title-retro text-2xl md:text-3xl text-primary mb-4">
              {isEs ? `Pide tus rosas para ${city.name}` : `Order roses to ${city.name}`}
            </h2>
            <p className="font-body text-sm md:text-base text-muted-foreground mb-6">
              {isEs
                ? "Explora la colección completa o filtra por color para encontrar el bouquet perfecto."
                : "Browse the full collection or filter by color to find the perfect bouquet."}
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/bouquets" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md font-body text-sm hover:bg-primary/90 transition-colors">
                {isEs ? "Ver todos los bouquets" : "Shop all bouquets"} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/bouquets/red-roses" className="inline-flex items-center gap-2 bg-white border border-border text-foreground px-6 py-3 rounded-md font-body text-sm hover:border-primary transition-colors">
                {isEs ? "Rosas rojas" : "Red roses"}
              </Link>
              <Link to="/bouquets/personalizar" className="inline-flex items-center gap-2 bg-white border border-border text-foreground px-6 py-3 rounded-md font-body text-sm hover:border-primary transition-colors">
                {isEs ? "Personalizar bouquet" : "Custom bouquet"}
              </Link>
            </div>
          </section>

          {/* Index back-link */}
          <div className="mt-10 text-center">
            <Link
              to={isEs ? "/envio-de-flores" : "/flower-delivery"}
              className="font-body text-sm text-primary hover:underline"
            >
              {isEs ? "← Ver todas las ciudades" : "← See all cities"}
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CityShippingPage;