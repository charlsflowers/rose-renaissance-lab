/**
 * TSG A/B testing — split the morphology of a page and measure which wins.
 *
 * Romuald — Armada SEO 2025, Módulo 15 Webs de Rango C, clase 08 "Estrategia TSG":
 *   "Creas dos TSGs distintas, envías el 50% del tráfico a una y 50% a otra y vas
 *    viendo qué funciona mejor."
 *
 * El checklist ya CREA la TSG (item 55) pero no contempla TESTEAR su estructura.
 * Esto es la parte técnica: reparto 50/50 estable por visitante + medición real,
 * para iterar el ORDEN de las franjas de la página (análisis → producto estrella
 * → categorías → informacional) y quedarse con la morfología que segmenta/convierte
 * mejor.
 *
 * Determinista por visitante: el bucket se fija una vez (localStorage) para que un
 * mismo usuario vea siempre la misma versión y la medición no se contamine.
 * El evento de medición va a GA4 (`tsg_experiment`) y respeta Consent Mode v2
 * porque gtag es no-op si no hay consentimiento. NO toca checkout ni los ficheros
 * de tracking (meta-capi / metaPixel); solo emite un evento GA4 propio.
 */

export type TsgVariant = "A" | "B";

/** localStorage key prefix; one bucket per experiment id. */
const STORAGE_PREFIX = "tsg_exp_";

/** Stable 50/50 bucket. Reuses the stored assignment if present. */
export const getTsgVariant = (experimentId: string): TsgVariant => {
  if (typeof window === "undefined") return "A"; // SSR/prerender → deterministic default
  const key = STORAGE_PREFIX + experimentId;
  try {
    const stored = window.localStorage.getItem(key);
    if (stored === "A" || stored === "B") return stored;
    const variant: TsgVariant = Math.random() < 0.5 ? "A" : "B";
    window.localStorage.setItem(key, variant);
    return variant;
  } catch {
    // localStorage blocked → still split, just non-sticky.
    return Math.random() < 0.5 ? "A" : "B";
  }
};

/**
 * Fire the measurement event so each variant's segmentation/conversion can be
 * compared in GA4. Call once per page view, after the variant is resolved.
 */
export const trackTsgExposure = (experimentId: string, variant: TsgVariant): void => {
  if (typeof window === "undefined") return;
  (window as any).gtag?.("event", "tsg_experiment", {
    experiment_id: experimentId,
    variant,
  });
};
