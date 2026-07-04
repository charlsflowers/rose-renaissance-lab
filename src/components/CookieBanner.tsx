import { useEffect, useState } from "react";
import { Link } from "@/i18n/LocalizedRouter";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useTranslation } from "@/i18n/LanguageContext";
import { COOKIE_PREFS_EVENT, useCookieConsent } from "@/hooks/useCookieConsent";

const CookieBanner = () => {
  const { t } = useTranslation();
  const { consent, hasResponded, ready, acceptAll, rejectAll, updateConsent } = useCookieConsent();
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [analyticsOn, setAnalyticsOn] = useState(false);
  const [marketingOn, setMarketingOn] = useState(false);
  const [visible, setVisible] = useState(false);

  // Trigger fade-in once we know there's no stored consent
  useEffect(() => {
    if (ready && !hasResponded) {
      const id = window.setTimeout(() => setVisible(true), 50);
      return () => window.clearTimeout(id);
    }
    setVisible(false);
  }, [ready, hasResponded]);

  // Sync toggles with stored consent whenever the modal opens
  useEffect(() => {
    if (customizeOpen) {
      setAnalyticsOn(consent?.analytics ?? false);
      setMarketingOn(consent?.marketing ?? false);
    }
  }, [customizeOpen, consent]);

  // Allow Footer (or any caller) to reopen the preferences dialog
  useEffect(() => {
    const handler = () => setCustomizeOpen(true);
    window.addEventListener(COOKIE_PREFS_EVENT, handler as EventListener);
    return () => window.removeEventListener(COOKIE_PREFS_EVENT, handler as EventListener);
  }, []);

  const handleSave = () => {
    updateConsent(analyticsOn, marketingOn);
    setCustomizeOpen(false);
  };

  const showBanner = ready && !hasResponded;

  return (
    <>
      {showBanner && (
        <div
          role="dialog"
          aria-label={t("cookies.title")}
          className={`fixed inset-x-0 bottom-20 md:bottom-0 z-[60] border-t border-border bg-background shadow-lg transition-all duration-300 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <div className="container mx-auto px-6 py-4 md:py-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="md:max-w-2xl">
                <p className="font-display text-sm font-semibold text-foreground">{t("cookies.title")}</p>
                <p className="font-body text-xs text-muted-foreground mt-1">
                  {t("cookies.description")}{" "}
                  <Link
                    to="/cookie-policy"
                    className="text-primary underline underline-offset-2"
                    aria-label={t("cookies.learnMoreAriaLabel")}
                  >
                    {t("cookies.learnMore")}
                  </Link>
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 md:flex-nowrap md:shrink-0">
                <Button variant="outline" size="sm" onClick={rejectAll}>{t("cookies.rejectAll")}</Button>
                <Button variant="ghost" size="sm" onClick={() => setCustomizeOpen(true)}>{t("cookies.customize")}</Button>
                <Button size="sm" onClick={acceptAll}>{t("cookies.acceptAll")}</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Dialog open={customizeOpen} onOpenChange={setCustomizeOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("cookies.preferencesTitle")}</DialogTitle>
            <DialogDescription>{t("cookies.description")}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="flex items-start justify-between gap-4 rounded-md border border-border p-3">
              <div>
                <p className="font-display text-sm font-semibold text-foreground">{t("cookies.necessary")}</p>
                <p className="font-body text-xs text-muted-foreground mt-1">{t("cookies.necessaryDesc")}</p>
              </div>
              <Switch checked disabled aria-label={t("cookies.necessary")} />
            </div>

            <div className="flex items-start justify-between gap-4 rounded-md border border-border p-3">
              <div>
                <p className="font-display text-sm font-semibold text-foreground">{t("cookies.analytics")}</p>
                <p className="font-body text-xs text-muted-foreground mt-1">{t("cookies.analyticsDesc")}</p>
              </div>
              <Switch checked={analyticsOn} onCheckedChange={setAnalyticsOn} aria-label={t("cookies.analytics")} />
            </div>

            <div className="flex items-start justify-between gap-4 rounded-md border border-border p-3">
              <div>
                <p className="font-display text-sm font-semibold text-foreground">{t("cookies.marketing")}</p>
                <p className="font-body text-xs text-muted-foreground mt-1">{t("cookies.marketingDesc")}</p>
              </div>
              <Switch checked={marketingOn} onCheckedChange={setMarketingOn} aria-label={t("cookies.marketing")} />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" onClick={rejectAll}>{t("cookies.rejectAll")}</Button>
            <Button onClick={handleSave}>{t("cookies.save")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CookieBanner;