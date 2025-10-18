/**
 * Helper functions for i18n
 * The layout handles the main translation setup, these are utilities for pages
 */
import { locales, defaultLocale, type Locale } from "@/i18n/config";
import { createT, type Dict } from "@/i18n/t";

/**
 * Simple function to get translation data for pages
 * This is the same logic as in IntlBaseLayout, so you can use it
 * if you need translations outside of the layout context
 */
export async function getPageTranslations(
  locale: Locale = defaultLocale,
  pageNS: string[] = []
) {
  // Validate locale; fallback to default if unknown
  const activeLocale: Locale = locales.includes(locale)
    ? locale
    : defaultLocale;

  // RTL support
  const dir = ["ar", "he", "fa", "ur"].includes(activeLocale) ? "rtl" : "ltr";

  // Always include "common" + requested page namespaces
  const wantedNS = Array.from(new Set(["common", ...pageNS]));

  // Load dicts with graceful fallbacks
  const dicts: Dict[] = [];

  for (const ns of wantedNS) {
    // default-locale dict
    try {
      const translation = await import(
        `./messages/${defaultLocale}/${ns}.json`
      );
      dicts.push(translation.default);
    } catch {
      /* optional: no-op if missing */
    }

    // active-locale dict (overrides)
    if (activeLocale !== defaultLocale) {
      try {
        const translation = await import(
          `./messages/${activeLocale}/${ns}.json`
        );
        dicts.push(translation.default);
      } catch {
        /* optional: no-op if missing */
      }
    }
  }

  const t = createT(dicts);

  return {
    t,
    locale: activeLocale,
    dir,
  };
}

/**
 * Quick helper to get just the translation function
 * when you know the locale and namespaces
 */
export async function getT(
  locale: Locale = defaultLocale,
  pageNS: string[] = []
) {
  const { t } = await getPageTranslations(locale, pageNS);
  return t;
}

export const getLocaleStaticPaths = () =>
  locales.map((locale) => ({
    params: { locale },
  }));
