import { useEffect, useState } from "react";
import { getTsgVariant, trackTsgExposure, type TsgVariant } from "@/lib/tsgExperiment";

/**
 * React hook for the TSG morphology A/B test (Romuald, Armada SEO 2025, Módulo 15
 * clase 08 "Estrategia TSG"): assigns a stable 50/50 variant and fires the GA4
 * measurement event once.
 *
 * Returns "A" on the very first render (matches the prerendered HTML so there is
 * no hydration mismatch), then resolves to the visitor's sticky bucket on the
 * client. The exposure event fires only after the client bucket is known.
 */
export const useTsgExperiment = (experimentId: string): TsgVariant => {
  const [variant, setVariant] = useState<TsgVariant>("A");

  useEffect(() => {
    const v = getTsgVariant(experimentId);
    setVariant(v);
    trackTsgExposure(experimentId, v);
  }, [experimentId]);

  return variant;
};
