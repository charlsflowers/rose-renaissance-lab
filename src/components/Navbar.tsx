import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate as useRRNavigate } from "react-router-dom";
import { Link, useNavigate } from "@/i18n/LocalizedRouter";
import { localizePath, stripLangPrefix } from "@/i18n/LanguageContext";
import { useCartStore } from "@/stores/cartStore";
import AnnouncementBar from "@/components/AnnouncementBar";
import BrandLogo from "@/components/BrandLogo";
import charlsLogo from "@/assets/charls-logo.webp";
import { Menu, X, ChevronDown, Search as SearchIcon, MapPin, Globe } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { bouquetProducts } from "@/lib/catalogData";
import { slugForHandle } from "@/lib/bouquetSlugs";
import { COLOR_COLLECTIONS } from "@/lib/colorCollections";
import { roomDecorPackages } from "@/lib/roomDecorData";
import { occasionsByTier } from "@/lib/occasionPagesData";
import { flowerTypesByTier } from "@/lib/flowerTypePagesData";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation, type Language } from "@/i18n/LanguageContext";
import { isMothersDayPromoActive } from "@/lib/mothersDayPromo";

interface PlacePrediction {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
}

const Navbar = () => {
  const { t, language, setLanguage } = useTranslation();
  const promoActive = isMothersDayPromoActive();
  const totalItems = useCartStore(state => state.items.length);
  const setCartOpen = useCartStore(state => state.setOpen);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bouquetDropdownOpen, setBouquetDropdownOpen] = useState(false);
  const [mobileBouquetOpen, setMobileBouquetOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [placePredictions, setPlacePredictions] = useState<PlacePrediction[]>([]);
  const [loadingPlaces, setLoadingPlaces] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const navigate = useNavigate();
  const rrNavigate = useRRNavigate();
  const location = useLocation();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  // Close timer for the Bouquets hover dropdown: ~250 ms grace so the cursor
  // can travel from the trigger to the panel (or between sub-links) without
  // accidentally closing the menu.
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openBouquetDropdown = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setBouquetDropdownOpen(true);
  };
  const scheduleCloseBouquetDropdown = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => setBouquetDropdownOpen(false), 250);
  };

  // Color collection links use the NATIVE ES slug (not a /es prefix), resolved per language.
  const colorLinkTo = (slug: string, slugEs: string) =>
    language === "es" ? `/es/bouquets/${slugEs}` : `/bouquets/${slug}`;

  // Occasion collection links use NATIVE ES slugs (different per language).
  const occasionLinkTo = (slug: string, slugEs: string) =>
    language === "es" ? `/es/collections/${slugEs}` : `/collections/${slug}`;
  const occasionsIndexPath = language === "es" ? "/es/collections/ocasiones" : "/collections/occasions";
  // Flower-type collection links use NATIVE ES slugs (different per language).
  const flowerTypeLinkTo = (slug: string, slugEs: string) =>
    language === "es" ? `/es/collections/${slugEs}` : `/collections/${slug}`;
  const flowerTypesIndexPath = language === "es" ? "/es/collections/flores" : "/collections/flowers";

  // Mega-menu grouped by intent. URLs are preserved (no SEO/301 changes).
  // Only include items whose collection/products actually exist — no empty "coming soon" pages.
  const redColor = COLOR_COLLECTIONS.find((c) => c.color === "red");
  const whiteColor = COLOR_COLLECTIONS.find((c) => c.color === "white");
  const bouquetGroups: Array<{
    title: string;
    titleTo?: string;
    items: Array<{ to: string; label: string }>;
  }> = [
    {
      title: t("nav.byColor"),
      titleTo: "/bouquets",
      items: [
        { to: "/bouquets", label: t("nav.allColors") },
        // List every indexable color collection so the user can reach all of
        // them from the mega-menu (not only red + white).
        ...COLOR_COLLECTIONS.map((c) => ({
          to: colorLinkTo(c.slug, c.slugEs),
          label: t(`nav.${c.color}Roses`),
        })),
        // Bicolor (2-color bouquets) lives next to the colors as its own filter.
        { to: "/bouquets/bicolor", label: t("nav.bicolorBouquets") },
      ],
    },
    {
      title: t("nav.byType"),
      items: [
        { to: "/bouquets/single-color", label: t("nav.singleColor") },
        { to: "/bouquets/mixed-color", label: t("nav.mixedBouquets") },
        { to: "/bouquets/zodiac", label: t("nav.zodiacBouquets") },
      ],
    },
    {
      title: t("nav.byOccasion"),
      titleTo: occasionsIndexPath,
      items: [
        // Mother's Day is the only occasion with a live product collection — keep it first.
        { to: "/bouquets/mothers-day", label: t("nav.mothersDayBouquets") },
        // Tier-1 occasion landing pages (indexable, content-rich, no products yet).
        ...occasionsByTier(1).map((o) => ({
          to: occasionLinkTo(o.slug, o.slugEs),
          label: language === "es" ? o.h1.es.replace(" en Miami", "") : o.h1.en.replace(" in Miami", ""),
        })),
        { to: occasionsIndexPath, label: t("nav.allOccasions") },
      ],
    },
    {
      title: t("nav.byFlower"),
      titleTo: flowerTypesIndexPath,
      items: [
        // Tier-1 flower-type landing pages (Tulips, Peonies, Sunflowers, Lilies,
        // Orchids, Ramo Buchón, Bridal Bouquets). Roses live in the "By Color"
        // group already, no need to duplicate here.
        ...flowerTypesByTier(1).map((f) => ({
          to: flowerTypeLinkTo(f.slug, f.slugEs),
          label: language === "es"
            ? f.h1.es.replace(/ en Miami$/, "")
            : f.h1.en.replace(/( —)? Miami( Delivery)?$/, "").replace(/ Miami$/, ""),
        })),
        { to: flowerTypesIndexPath, label: t("nav.allFlowers") },
      ],
    },
  ];

  const navLinks = [
    { to: "/", label: t("nav.home") },
    { to: "/bouquets", label: t("nav.bouquets"), hasDropdown: true },
    { to: "/bouquets/personalizar", label: t("nav.customBouquets") },
    { to: "/room-decors", label: t("nav.roomDecors") },
    { to: "/delivery", label: t("nav.sameDayDelivery") },
  ];

  const searchableItems = [
    ...bouquetProducts.map(p => ({ name: p.name, to: `/bouquets/${slugForHandle(p.shopifyHandle)}` })),
    ...roomDecorPackages.map(p => ({ name: p.name, to: `/room-decors/${p.id}` })),
    { name: t("nav.customBouquetBuilder"), to: "/bouquets/personalizar" },
    { name: t("nav.delivery"), to: "/delivery" },
    { name: t("nav.about"), to: "/about" },
    { name: t("nav.contact"), to: "/contact" },
    { name: t("nav.faq"), to: "/faq" },
    { name: t("nav.blog"), to: "/blog" },
  ];

  const searchResults = searchQuery.length >= 2
    ? searchableItems.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 6)
    : [];

  const fetchPlaces = useCallback(async (input: string) => {
    if (input.length < 3) { setPlacePredictions([]); return; }
    setLoadingPlaces(true);
    try {
      const { data, error } = await supabase.functions.invoke("places-autocomplete", { body: { input } });
      if (!error && data?.predictions) setPlacePredictions(data.predictions);
      else setPlacePredictions([]);
    } catch { setPlacePredictions([]); }
    setLoadingPlaces(false);
  }, []);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchPlaces(val), 350);
  };

  const handlePlaceClick = (prediction: PlacePrediction) => {
    setSearchOpen(false);
    setSearchQuery("");
    setPlacePredictions([]);
    navigate(`/delivery?address=${encodeURIComponent(prediction.description)}`);
  };

  const toggleLang = () => {
    const nextLang = language === "en" ? "es" : "en";
    const cleanPath = stripLangPrefix(location.pathname);
    const target = localizePath(cleanPath, nextLang) + location.search + location.hash;
    rrNavigate(target);
  };

  return (
    <>
    <div className="fixed top-0 left-0 right-0 z-[51]">
      <AnnouncementBar />
    </div>
    <nav className="fixed top-[30px] left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 md:px-6 py-3 flex items-center justify-between relative">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? t("nav.aria.closeMenu") : t("nav.aria.openMenu")}
            aria-expanded={mobileOpen}
            className="lg:hidden text-foreground hover:text-primary transition-colors"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <Link to="/" className="hidden lg:flex items-center gap-2">
          <img src={charlsLogo} alt="Charls Flowers Miami – Premium Handcrafted Bouquets" className="h-10 w-auto" width={90} height={40} />
        </Link>

        <Link to="/" className="lg:hidden absolute left-1/2 -translate-x-1/2 flex items-center">
          <img src={charlsLogo} alt="Charls Flowers Miami" className="h-10 w-auto" width={90} height={40} />
        </Link>

        <div className="hidden lg:flex items-center gap-5 font-body text-xs tracking-widest uppercase text-muted-foreground">
          {navLinks.map((link) => (
            link.hasDropdown ? (
              <div
                key={link.to}
                className="relative"
                onMouseEnter={openBouquetDropdown}
                onMouseLeave={scheduleCloseBouquetDropdown}
              >
                {promoActive ? (
                  <span
                    aria-disabled="true"
                    title="Available May 13"
                    className="opacity-50 cursor-not-allowed whitespace-nowrap inline-flex items-center gap-1 uppercase"
                  >
                    {link.label} <ChevronDown className="w-3 h-3" />
                  </span>
                ) : (
                  <Link to={link.to} className="hover:text-primary transition-colors whitespace-nowrap inline-flex items-center gap-1 uppercase">
                    {link.label} <ChevronDown className="w-3 h-3" />
                  </Link>
                )}
                {bouquetDropdownOpen && (
                  // pt-2 (instead of an mt-1 gap) keeps the panel attached to
                  // the trigger as one continuous hover surface — no dead zone
                  // between the button and the menu.
                  <div
                    onMouseEnter={openBouquetDropdown}
                    onMouseLeave={scheduleCloseBouquetDropdown}
                    className="absolute top-full left-0 pt-2 z-50"
                  >
                    <div className="bg-background border border-border rounded-lg shadow-xl p-5 grid grid-cols-4 gap-6 min-w-[740px]">
                    {bouquetGroups.map((group, gi) => (
                      <div key={gi} className="flex flex-col gap-2 min-w-[150px]">
                        {group.titleTo && !promoActive ? (
                          <Link
                            to={group.titleTo}
                            onClick={() => setBouquetDropdownOpen(false)}
                            className="text-[11px] tracking-widest uppercase font-semibold text-foreground hover:text-primary transition-colors pb-1.5 border-b border-border"
                          >
                            {group.title}
                          </Link>
                        ) : (
                          <span className="text-[11px] tracking-widest uppercase font-semibold text-foreground pb-1.5 border-b border-border">
                            {group.title}
                          </span>
                        )}
                        <div className="flex flex-col">
                          {group.items.map((sub, i) => (
                            promoActive ? (
                              <span key={i} aria-disabled="true" title="Available May 13" className="block py-1.5 text-xs tracking-widest uppercase text-muted-foreground/50 cursor-not-allowed">
                                {sub.label}
                              </span>
                            ) : (
                              <Link key={i} to={sub.to} onClick={() => setBouquetDropdownOpen(false)} className="block py-1.5 text-xs tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors">
                                {sub.label}
                              </Link>
                            )
                          ))}
                        </div>
                      </div>
                    ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              promoActive && (link.to === "/room-decors" || link.to === "/bouquets/personalizar") ? (
                <span
                  key={link.to}
                  aria-disabled="true"
                  title="Available May 13"
                  className="opacity-50 cursor-not-allowed whitespace-nowrap uppercase"
                >
                  {link.label}
                </span>
              ) : (
                <Link key={link.to} to={link.to!} className="hover:text-primary transition-colors whitespace-nowrap uppercase">
                  {link.label}
                </Link>
              )
            )
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* Language toggle */}
          <button
            onClick={toggleLang}
            aria-label={t("nav.aria.changeLanguage")}
            className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors font-body text-xs tracking-wider uppercase"
            title={language === "en" ? "Cambiar a Español" : "Switch to English"}
          >
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline">{language === "en" ? "ES" : "EN"}</span>
          </button>

          {/* Search toggle */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label={t("nav.aria.search")}
            aria-expanded={searchOpen}
            className="text-foreground hover:text-primary transition-colors"
          >
            <SearchIcon className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => setCartOpen(true)}
            aria-label={t("nav.aria.openCart")}
            className="relative hover:text-primary transition-colors text-foreground"
          >
            <BrandLogo className="w-7 h-7" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-body font-semibold">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Search bar */}
      {searchOpen && (
        <div className="border-t border-border bg-background/95 backdrop-blur-md">
          <div className="container mx-auto px-6 py-3 relative">
            <div className="relative max-w-md mx-auto">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder={t("nav.searchPlaceholder")}
                autoFocus
                className="w-full bg-muted border border-border rounded-lg pl-10 pr-4 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            {(searchResults.length > 0 || placePredictions.length > 0) && (
              <div className="absolute left-1/2 -translate-x-1/2 w-full max-w-md mt-1 bg-background border border-border rounded-lg shadow-lg z-50 max-h-72 overflow-y-auto">
                {searchResults.map((item, i) => (
                  <Link
                    key={`s-${i}`}
                    to={item.to}
                    onClick={() => { setSearchOpen(false); setSearchQuery(""); setPlacePredictions([]); }}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-body text-foreground hover:bg-cream/50 hover:text-primary transition-colors border-b border-border last:border-b-0"
                  >
                    <SearchIcon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    {item.name}
                  </Link>
                ))}
                {placePredictions.length > 0 && searchResults.length > 0 && (
                  <div className="px-4 py-1.5 bg-muted/50">
                    <span className="font-body text-[10px] tracking-widest uppercase text-muted-foreground">{t("nav.deliveryAddresses")}</span>
                  </div>
                )}
                {placePredictions.map((p, i) => (
                  <button
                    key={`p-${i}`}
                    onClick={() => handlePlaceClick(p)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-body text-foreground hover:bg-cream/50 hover:text-primary transition-colors border-b border-border last:border-b-0 text-left"
                  >
                    <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                    <div>
                      <span className="font-semibold">{p.mainText}</span>
                      <span className="text-muted-foreground text-xs ml-1">{p.secondaryText}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile menu - side sheet from left */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[80vw] max-w-sm p-0 z-[52]">
          <div className="flex flex-col h-full bg-background/95 backdrop-blur-md">
            <div className="px-6 py-4 border-b border-border">
              <SheetTitle className="text-left text-sm font-body tracking-widest uppercase text-muted-foreground">
                {t("nav.menu")}
              </SheetTitle>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-1 font-body text-sm tracking-widest uppercase text-muted-foreground">
              {navLinks.map((link) => (
                link.hasDropdown ? (
                  <div key={link.to}>
                    <button
                      onClick={() => setMobileBouquetOpen(!mobileBouquetOpen)}
                      className={`w-full flex items-center justify-between transition-colors py-2 border-b border-border ${promoActive ? "opacity-50 cursor-not-allowed" : "hover:text-primary"}`}
                    >
                      {link.label} <ChevronDown className={`w-3 h-3 transition-transform ${mobileBouquetOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {mobileBouquetOpen && (
                      <div className="pl-4 py-2 space-y-3">
                        {bouquetGroups.map((group, gi) => (
                          <div key={gi} className="flex flex-col">
                            {group.titleTo && !promoActive ? (
                              <Link
                                to={group.titleTo}
                                onClick={() => setMobileOpen(false)}
                                className="block py-1 text-[11px] tracking-widest uppercase font-semibold text-foreground hover:text-primary transition-colors"
                              >
                                {group.title}
                              </Link>
                            ) : (
                              <span className="block py-1 text-[11px] tracking-widest uppercase font-semibold text-foreground">
                                {group.title}
                              </span>
                            )}
                            <div className="pl-3 flex flex-col">
                              {group.items.map((sub, i) => (
                                promoActive ? (
                                  <span key={i} aria-disabled="true" className="block py-1.5 text-xs tracking-widest uppercase text-muted-foreground/50 cursor-not-allowed">
                                    {sub.label}
                                  </span>
                                ) : (
                                  <Link key={i} to={sub.to} onClick={() => setMobileOpen(false)} className="block py-1.5 text-xs tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors">
                                    {sub.label}
                                  </Link>
                                )
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  promoActive && (link.to === "/room-decors" || link.to === "/bouquets/personalizar") ? (
                    <span key={link.to} aria-disabled="true" className="opacity-50 cursor-not-allowed py-2 border-b border-border last:border-b-0">
                      {link.label} <span className="text-[9px] normal-case">— Available May 13</span>
                    </span>
                  ) : (
                    <Link key={link.to} to={link.to!} onClick={() => setMobileOpen(false)} className="hover:text-primary transition-colors py-2 border-b border-border last:border-b-0">
                      {link.label}
                    </Link>
                  )
                )
              ))}

              {/* Mobile language toggle */}
              <button
                onClick={() => { toggleLang(); setMobileOpen(false); }}
                aria-label={t("nav.aria.changeLanguage")}
                className="flex items-center gap-2 hover:text-primary transition-colors py-2 mt-1"
              >
                <Globe className="w-4 h-4" />
                {language === "en" ? "English" : "Español"}
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </nav>
    </>
  );
};

export default Navbar;
