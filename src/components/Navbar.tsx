import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "@/stores/cartStore";
import AnnouncementBar from "@/components/AnnouncementBar";
import BrandLogo from "@/components/BrandLogo";
import charlsLogo from "@/assets/charls-logo.png";
import { Menu, X, ChevronDown, Search as SearchIcon, MapPin, Globe } from "lucide-react";
import { bouquetProducts } from "@/lib/catalogData";
import { roomDecorPackages } from "@/lib/roomDecorData";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation, type Language } from "@/i18n/LanguageContext";

interface PlacePrediction {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
}

const Navbar = () => {
  const { t, language, setLanguage } = useTranslation();
  const totalItems = useCartStore(state => state.items.length);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bouquetDropdownOpen, setBouquetDropdownOpen] = useState(false);
  const [mobileBouquetOpen, setMobileBouquetOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [placePredictions, setPlacePredictions] = useState<PlacePrediction[]>([]);
  const [loadingPlaces, setLoadingPlaces] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const navigate = useNavigate();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const bouquetSubLinks = [
    { to: "/bouquets", label: t("nav.allBouquets"), active: true },
    { to: "/bouquets?filter=un-color", label: t("nav.singleColor"), active: true },
    { to: "/bouquets?filter=mezclas", label: t("nav.mixedBouquets"), active: true },
    { to: "/bouquets?filter=zodiac", label: t("nav.zodiacBouquets"), active: true },
    { label: t("nav.anniversaries"), active: false },
    { label: t("nav.birthdayBouquets"), active: false },
    { label: t("nav.babyShowerBouquets"), active: false },
    { label: t("nav.valentinesDayFlowers"), active: false },
    { label: t("nav.weddingBouquets"), active: false },
  ];

  const navLinks = [
    { to: "/", label: t("nav.home") },
    { to: "/bouquets", label: t("nav.bouquets"), hasDropdown: true },
    { to: "/bouquets/personalizar", label: t("nav.customBouquets") },
    { to: "/room-decors", label: t("nav.roomDecors") },
    { to: "/delivery", label: t("nav.delivery") },
    { to: "/about", label: t("nav.about") },
    { to: "/contact", label: t("nav.contact") },
    { to: "/faq", label: t("nav.faq") },
  ];

  const searchableItems = [
    ...bouquetProducts.map(p => ({ name: p.name, to: `/bouquets/all/${p.shopifyHandle}` })),
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
    setLanguage(language === "en" ? "es" : "en");
  };

  return (
    <>
    <div className="fixed top-0 left-0 right-0 z-[51]">
      <AnnouncementBar />
    </div>
    <nav className="fixed top-[30px] left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 md:px-6 py-3 flex items-center justify-between relative">
        <div className="flex items-center gap-2">
          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden text-foreground hover:text-primary transition-colors">
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <Link to="/" className="hidden lg:flex items-center gap-2">
          <img src={charlsLogo} alt="Charls Flowers Miami – Premium Handcrafted Bouquets" className="h-10 w-auto" width={120} height={40} />
        </Link>

        <Link to="/" className="lg:hidden absolute left-1/2 -translate-x-1/2 flex items-center">
          <img src={charlsLogo} alt="Charls Flowers Miami" className="h-10 w-auto" width={120} height={40} />
        </Link>

        <div className="hidden lg:flex items-center gap-5 font-body text-xs tracking-widest uppercase text-muted-foreground">
          {navLinks.map((link) => (
            link.hasDropdown ? (
              <div key={link.to} className="relative" onMouseEnter={() => setBouquetDropdownOpen(true)} onMouseLeave={() => setBouquetDropdownOpen(false)}>
                <Link to={link.to} className="hover:text-primary transition-colors whitespace-nowrap inline-flex items-center gap-1">
                  {link.label} <ChevronDown className="w-3 h-3" />
                </Link>
                {bouquetDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 bg-background border border-border rounded-lg shadow-lg py-2 min-w-[220px] z-50">
                    {bouquetSubLinks.map((sub, i) => (
                      sub.active ? (
                        <Link key={i} to={sub.to || "#"} className="block px-4 py-2 text-xs tracking-widest uppercase text-muted-foreground hover:text-primary hover:bg-cream/50 transition-colors" onClick={() => setBouquetDropdownOpen(false)}>
                          {sub.label}
                        </Link>
                      ) : (
                        <span key={i} className="block px-4 py-2 text-xs tracking-widest uppercase text-muted-foreground/40 cursor-not-allowed">
                          {sub.label} <span className="text-[9px] normal-case">{t("nav.comingSoon")}</span>
                        </span>
                      )
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link key={link.to} to={link.to!} className="hover:text-primary transition-colors whitespace-nowrap">
                {link.label}
              </Link>
            )
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* Language toggle */}
          <button
            onClick={toggleLang}
            className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors font-body text-xs tracking-wider uppercase"
            title={language === "en" ? "Cambiar a Español" : "Switch to English"}
          >
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline">{language === "en" ? "ES" : "EN"}</span>
          </button>

          {/* Search toggle */}
          <button onClick={() => setSearchOpen(!searchOpen)} className="text-foreground hover:text-primary transition-colors">
            <SearchIcon className="w-5 h-5" />
          </button>

          <Link to="/checkout" className="relative hover:text-primary transition-colors text-foreground">
            <BrandLogo className="w-7 h-7" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-body font-semibold">
                {totalItems}
              </span>
            )}
          </Link>
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

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-md">
          <div className="container mx-auto px-6 py-4 flex flex-col gap-1 font-body text-sm tracking-widest uppercase text-muted-foreground">
            {navLinks.map((link) => (
              link.hasDropdown ? (
                <div key={link.to}>
                  <button
                    onClick={() => setMobileBouquetOpen(!mobileBouquetOpen)}
                    className="w-full flex items-center justify-between hover:text-primary transition-colors py-2 border-b border-border"
                  >
                    {link.label} <ChevronDown className={`w-3 h-3 transition-transform ${mobileBouquetOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {mobileBouquetOpen && (
                    <div className="pl-4 py-1 space-y-1">
                      {bouquetSubLinks.map((sub, i) => (
                        sub.active ? (
                          <Link key={i} to={sub.to || "#"} onClick={() => setMobileOpen(false)} className="block py-1.5 text-xs tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors">
                            {sub.label}
                          </Link>
                        ) : (
                          <span key={i} className="block py-1.5 text-xs tracking-widest uppercase text-muted-foreground/40">
                            {sub.label} <span className="text-[9px] normal-case">{t("nav.comingSoon")}</span>
                          </span>
                        )
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link key={link.to} to={link.to!} onClick={() => setMobileOpen(false)} className="hover:text-primary transition-colors py-2 border-b border-border last:border-b-0">
                  {link.label}
                </Link>
              )
            ))}

            {/* Mobile language toggle */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-2 hover:text-primary transition-colors py-2 mt-1"
            >
              <Globe className="w-4 h-4" />
              {language === "en" ? "Español" : "English"}
            </button>
          </div>
        </div>
      )}
    </nav>
    </>
  );
};

export default Navbar;
