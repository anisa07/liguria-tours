// Type definitions for Astro i18n
declare namespace App {
  interface Locals {
    t?: (
      key: string,
      vars?: Record<string, string | number>,
      fallback?: string
    ) => string;
    locale?: string;
    dir?: "ltr" | "rtl";
  }
}

// Module declarations for Astro components
declare module "*.astro" {
  import type { AstroComponentFactory } from "astro/runtime/server/index.js";
  const Component: AstroComponentFactory;
  export default Component;
}

// Global type for translation function
export type TranslationFunction = (
  key: string,
  vars?: Record<string, string | number>,
  fallback?: string
) => string;

// Props that layouts can provide to pages
export interface I18nLayoutProps {
  t: TranslationFunction;
  locale: string;
  dir: "ltr" | "rtl";
}
