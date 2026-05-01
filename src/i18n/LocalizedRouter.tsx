/**
 * Localized routing primitives.
 *
 * Drop-in replacements for react-router-dom's Link, NavLink, useNavigate, and Navigate
 * that automatically prefix internal paths with `/es` when the active language is ES.
 *
 * Rules:
 *  - External URLs (http://, https://, mailto:, tel:) → unchanged
 *  - Hash-only or query-only links (#foo, ?foo=bar) → unchanged
 *  - Paths already starting with `/es` → unchanged (caller already localized)
 *  - Excluded paths (checkout, studio) → unchanged regardless of language
 *  - Everything else: prefixed with `/es` when language === "es"
 *
 * To opt out for a specific link, pass `noLocalize`.
 */
import { forwardRef, type ComponentProps } from "react";
import {
  Link as RRLink,
  NavLink as RRNavLink,
  Navigate as RRNavigate,
  useNavigate as useRRNavigate,
  type NavigateOptions,
  type To,
} from "react-router-dom";
import { useTranslation, localizePath, type Language } from "./LanguageContext";

const EXCLUDED_PREFIXES = ["/checkout", "/studio", "/cart", "/account"];

const isExternal = (path: string): boolean =>
  /^(https?:|mailto:|tel:|sms:|#|\?)/i.test(path);

const isExcluded = (path: string): boolean =>
  EXCLUDED_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`) || path.startsWith(`${p}?`));

const isAlreadyLocalized = (path: string): boolean =>
  path === "/es" || path.startsWith("/es/") || path.startsWith("/es?");

/** Apply ES prefix to a `to` value when needed. */
export const localizeTo = (to: To, lang: Language): To => {
  if (lang !== "es") return to;
  if (typeof to === "string") {
    if (!to.startsWith("/")) return to; // relative path — leave untouched
    if (isExternal(to)) return to;
    if (isExcluded(to)) return to;
    if (isAlreadyLocalized(to)) return to;
    return localizePath(to, "es");
  }
  // Object form { pathname, search, hash }
  const pathname = to.pathname ?? "";
  if (!pathname.startsWith("/")) return to;
  if (isExcluded(pathname) || isAlreadyLocalized(pathname)) return to;
  return { ...to, pathname: localizePath(pathname, "es") };
};

type LinkProps = ComponentProps<typeof RRLink> & { noLocalize?: boolean };
type NavLinkProps = ComponentProps<typeof RRNavLink> & { noLocalize?: boolean };

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ to, noLocalize, ...rest }, ref) => {
    const { language } = useTranslation();
    const finalTo = noLocalize ? to : localizeTo(to, language);
    return <RRLink ref={ref} to={finalTo} {...rest} />;
  },
);
Link.displayName = "LocalizedLink";

export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ to, noLocalize, ...rest }, ref) => {
    const { language } = useTranslation();
    const finalTo = noLocalize ? to : localizeTo(to, language);
    return <RRNavLink ref={ref} to={finalTo} {...rest} />;
  },
);
NavLink.displayName = "LocalizedNavLink";

export const useNavigate = () => {
  const navigate = useRRNavigate();
  const { language } = useTranslation();
  return (to: To | number, options?: NavigateOptions) => {
    if (typeof to === "number") return navigate(to);
    return navigate(localizeTo(to, language), options);
  };
};

interface LocalizedNavigateProps {
  to: To;
  replace?: boolean;
  state?: unknown;
  noLocalize?: boolean;
}

export const Navigate = ({ to, noLocalize, ...rest }: LocalizedNavigateProps) => {
  const { language } = useTranslation();
  const finalTo = noLocalize ? to : localizeTo(to, language);
  return <RRNavigate to={finalTo} {...(rest as object)} />;
};