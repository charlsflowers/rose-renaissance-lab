# Auditoría SEO — charlsflowers.com — 2026-06-28

> Documento de contexto para **futuras auditorías SEO**. Recoge TODO lo que se revisó
> y se hizo en la auditoría del 28 de junio de 2026, para no repetir trabajo y saber
> de dónde se parte.
>
> **Método:** workflow automatizado **Romuald Fons (agente) + GBrain** (formación
> *Armada SEO 2025 / Armada Digital 3.0*, 2.626 páginas indexadas). 6 rondas de
> "GBrain dice qué falta según la formación → Romuald lo implementa si es técnico /
> lo marca si es contenido". 13 agentes, ~1,19M tokens, 301 tool calls.
>
> **Norma dura aplicada:** el copy/keywords SEO **NUNCA se inventa**; lo valida Romuald
> desde datos reales + formación. Los huecos se marcan, no se rellenan a ojo.

---

## 0. Veredicto general

El SEO **técnico y on-page ya estaba muy sólido** antes de esta auditoría. El bucle,
comparando contra la formación, **completó una capa técnica avanzada** que faltaba.
Lo único que queda es **contenido/datos reales** (trabajo de Romuald, no de código).

**Verificación tras los cambios:** `tsc --noEmit` limpio · vitest **19/20** (el fallo
`example.test.ts > buildCheckoutUrl` es **PREEXISTENTE**, atribución de checkout, ajeno
a esta auditoría) · 4 guards de build OK · `vite build` OK.

---

## 1. Estado inicial — lo que YA estaba hecho (no rehacer)

| Área | Item | Evidencia |
|---|---|---|
| Titles/Meta | Titles keyword-first (keyword+Miami+intención) EN+ES | `src/i18n/translations/en.ts:640-700`; inyectados en `SeoHead.tsx:52` |
| Titles/Meta | Meta description única por página con keyword+CTA | `en.ts:641,645…`; `SeoHead.tsx:53` |
| Titles/Meta | Open Graph + Twitter Card completos | `SeoHead.tsx:62-78` |
| H1 | Un único H1 por página indexable | 24/24 páginas; legales heredan de `ShopifyPolicyPage.tsx:32` |
| Hreflang | en/es/x-default recíproco | `SeoHead.tsx:58-60`; EN-only vía `noAlternateEs` |
| Hreflang | hreflang también en sitemap (xhtml:link) | `public/sitemap.xml:8-10` |
| Lang | `<html lang>` correcto por idioma | `SeoHead.tsx:51`; og:locale en/es_US |
| Canonical | Autorreferenciada por idioma | `SeoHead.tsx:42-46,54` |
| Canonical | Slugs ES nativos (no `/es` del slug EN) | `SeoHead.tsx:16,41,43`; `BouquetProducts.tsx:200` |
| Schema | LocalBusiness/Florist con NAP, horario, areaServed | `JsonLd.tsx:24-53` (GeoCircle 140km) |
| Schema | Product (offer/price/availability) | `JsonLd.tsx:106-122` |
| Schema | BreadcrumbList | `JsonLd.tsx:149-158` |
| Schema | ItemList, FAQPage, Article/BlogPosting, Service, Organization, WebSite | `JsonLd.tsx:55-208`, en 20 páginas |
| Robots | robots.txt con Disallow checkout/cart/account/studio + Sitemap | `public/robots.txt:1-11` |
| Robots | noindex en legales/transaccionales | `ShopifyPolicyPage.tsx:28`; `SeoHead.tsx:55` |
| Sitemap | 338 URLs con lastmod/changefreq/priority, autogenerado en build | `public/sitemap.xml`; `scripts/generate-sitemap.mjs` |
| Arquitectura | URLs keyword-first limpias | `public/_redirects`; sitemap |
| Arquitectura | Location pages por 8 barrios de Miami | `CityShippingPage.tsx`+`CityIndexPage.tsx` |
| Arquitectura | Occasion pages (valentines/quinceañera/mothers-day/gender-reveal) | `OccasionPage.tsx`+`OccasionsIndexPage.tsx` |
| Arquitectura | 301 masivos legacy `/products/*` y `/bouquets/all/*` | `public/_redirects`; `scripts/generate-redirects.mjs` |
| Contenido | Alt text descriptivo keyword+Miami+marca | 68 alt; 6 decorativos vacíos (correcto) |
| Enlazado | Localizado (auto `/es`) + breadcrumbs navegables | `LocalizedRouter.tsx:58-65`; `Breadcrumbs.tsx` |
| Enlazado | Anchor exacto desde el bloque de cola larga | `LongTailSeoBlock.tsx:41-54` |
| Cola larga | Creada por color e intención EN+ES (**NO rehacer**) | `src/lib/longTailSeo.ts` (720 líneas); `getLongTail` :717 |
| Cola larga | Usada en colecciones (intro bajo H1 + body H2/H3) | `BouquetProducts.tsx:244,358`; `MothersDayCollection.tsx:75,152` |
| Velocidad | Prerender SSG real por ruta del sitemap | `scripts/prerender.mjs`; commit `2fd5d53` |

---

## 2. Lo que se IMPLEMENTÓ en automático (técnico — verificado, no rehacer)

Cada uno cita el módulo de la formación que lo justifica.

### Velocidad / Imágenes
- **WebP real + compresión <100KB**: `src/assets/glitter-rose.webp` (150→53KB), `public/payment-icons/visa.webp` (163→5.3KB, era PNG mal etiquetado), `apple-pay.webp` (80→1.9KB, ídem). Las 30 imágenes del repo son ahora WebP genuino <100KB. *(Armada SEO Mód.06 Plugins + Directos 05 Imágenes.)*
- **Guard de build** `scripts/check-images.mjs` (NUEVO): falla el build si alguna imagen no es WebP real o pesa >100KB (favicon exento). Wired en `package.json`.

### Enlazado interno
- **Regla direccional en cadena** `src/lib/linkDirection.ts` (NUEVO): única fuente de verdad de la direccionalidad. `pageDifficulty` deriva dificultad del volumen real (color collections) sin inventar números; permite SOLO fácil→difícil, prohíbe difícil→fácil y self-links cross-idioma; `/bouquets` = sink de autoridad. *(Armada SEO Mód.15 / 02 Enlazado en Cadena.)*
- **Interlinking blog→colección afín** `src/lib/blogInterlinks.ts` (NUEVO): desde `categories[]`+`relatedLandings` del artículo (Sanity) mapea a colecciones existentes, ordena low→high y cierra en `/bouquets`. Anchor = keyword/título real (no inventado). Render en `BlogArticle.tsx`. Se activa solo cuando Romuald cree los artículos.
- **Misma pestaña**: auditado — el sitio ya cumple (los `target=_blank` son solo externos). Test de regresión `src/test/internalLinksSameTab.test.ts`.

### Indexación / Cobertura / Crawl budget
- **IndexNow** `scripts/indexnow-submit.mjs` (NUEVO) + clave `public/babbb289b2c2434d8163433109a70015.txt`: empuja indexación en lotes ≤10.000; imprime top-10 para GSC manual (~10/día). *(Mód.19 Avanzado + Mód.07 GSC.)*
- **Auditoría de cobertura** `scripts/coverage-audit.mjs` (NUEVO): verifica que las 10 páginas que NO deben indexarse llevan noindex y no están en el sitemap; imprime queries `site:` del playbook.
- **Crawl-budget guard** `scripts/crawl-budget-check.mjs` (NUEVO, falla el build): detecta cadenas A→B→C, bucles, destinos muertos y URLs en sitemap que además redirigen. *(Mód.32 Web Rango S.)*

### Arquitectura / Navegación / Freshness
- **Clusters dinámicos** `src/lib/dynamicClusters.ts` + `src/components/DynamicClusters.tsx` (NUEVOS): bloques "Novedades" y "Rosas por color" derivados del catálogo en vivo; montados en home y colección → publicar 1 producto refresca decenas de páginas. *(Mód.29 Web Rango A + Mód.12.)*
- **Menú orbital móvil** `src/components/MobileOrbitalNav.tsx` (NUEVO): nav fija inferior solo móvil (Home/Bouquets/Personalizar+carrito). *(Mód.12 clase 01.)*
- **Índice de contenidos** `src/components/TableOfContents.tsx` (NUEVO) en `OccasionPage.tsx` y `CityShippingPage.tsx`: jump-links con productos/CTA primero. *(Mód.16.)*

### Experimentación
- **A/B testing TSG** `src/lib/tsgExperiment.ts` + `src/hooks/useTsgExperiment.ts` (NUEVOS): split 50/50 sticky por visitante + evento GA4 `tsg_experiment` (respeta Consent Mode, no toca meta-capi/pixel). Aplicado al orden de franjas de la home en `Index.tsx`. *(Mód.15 clase 08.)*

### i18n
- Claves `clusters: { newest, byColor, quickNav }` añadidas en `en.ts`/`es.ts`.

---

## 3. PENDIENTE — solo Romuald, con DATOS REALES (no se inventa)

> El mecanismo técnico para casi todo esto ya está listo en el repo; falta el
> contenido/los datos reales que Romuald debe aportar/validar.

**Contenido (copy/keywords reales por idioma):**
1. Capa de **contenido informacional** (blog "mejores X", "cuánto cuesta X", comparativas, guías por ocasión) → se redacta en **Sanity** (el blog se sirve desde Sanity, `blogArticles` vacío en código). El interlinking se activa solo al crearlos.
2. **Featured snippets**: respuestas directas 3-4 líneas (el schema FAQ ya está; falta el texto).
3. **LSI / enriquecimiento semántico** por página (distinto de la cola larga).
4. **Long tail transaccional por PRODUCTO** (morfología TSR: comprar/precio/opiniones+nombre+Miami).
5. **Limpieza de densidad** (quitar relleno) — editar copy real, lo valida Romuald.
6. **Misspells con volumen real** (grafías erróneas con demanda).
7. **Freshness** en titles/H1 (año, refresco) — decisión de copy.
8. **Acortar titles de color a <60 chars** (algunos a 63-65 truncan en SERP; p.ej. quitar "– Charls Flowers"). *Es retoque de copy → decisión de Romuald.*

**Datos reales (GSC / Keyword Planner / SERP):**
9. **Bucle GSC**: keywords pos 5-10 con impresiones y pocos clics → inyectar escalonado (texto/alt→H3→H2, nunca H1).
10. **CTR en SERP**: title+description persuasivos una vez en pág 1-2.
11. **Intención de búsqueda**: validar mirando top-10 real de Google por keyword/URL.
12. **Canibalización**: detectar URLs con misma intención (misma SERP) y unificar.
13. **TSG por franjas** (modelo IKEA): segmentar colecciones por marca/tipo/color/ocasión desde KW research + catálogo real.
14. **Estacionalidad**: meses pico/valle con demanda anual del Keyword Planner.
15. **Ratio** páginas transaccionales vs informacionales (salud del proyecto).

**Off-page / prueba social / conversión:**
16. **Linkbuilding** (foros/sector, cadena entre webs de la flota) — Mód.17, último recurso tras on-page.
17. **Enlaces salientes** dofollow a fuentes de autoridad del sector.
18. **Reseñas** (estrellas/aggregateRating) — fuentes reales, sin duplicar.
19. **Autor real E-A-T** (nombre/foto/bio) en blog — foto en `~/Fotos-CRM`.
20. **CRO**: 3 precios (barata/media/cara) + subir CTA/precio/reseñas — precios y reseñas reales (Romuald/Carlos).
21. **Retención/UX** (dwell time, pogo-sticking) — validar con GA4/GSC.

---

## 4. Nota de limpieza del repo (importante para futuras sesiones)

Durante la auditoría se encontró que 3 edge functions de **tracking/facturación**
tenían marcas de conflicto `<<<<<<< / >>>>>>>` pegadas dentro del código (restos de un
`git stash` a medias, ajeno al SEO): `supabase/functions/meta-capi/index.ts`,
`shopify-invoice-preview/index.ts`, `shopify-invoice-print/index.ts`. Estaban **rotas**.
Se **restauraron a la versión commiteada (HEAD = origin/main, la desplegada)** sin tocar
la lógica. Si vuelven a aparecer marcas `<<<<<<<` en `supabase/functions`, es ese stash.

---

*Fuente completa del run: workflow `auditoria-seo-charls` (run wf_f4661ae1-e10), 2026-06-28.*
