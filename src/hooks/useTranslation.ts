import { useState, useEffect } from "react";
import { getT } from "@/i18n/i18n";
import type { Locale } from "@/i18n/config";

/**
 * Custom React hook for translations
 * @param locale - The locale to use for translations
 * @param namespaces - Array of translation namespaces to load
 * @returns Object with translation function, loading state, and error state
 */
export function useTranslation(
  locale: Locale = "en",
  namespaces: string[] = ["common", "ui"]
) {
  const [t, setT] = useState<
    | ((
        key: string,
        fallback: string,
        vars?: Record<string, string | number>
      ) => string)
    | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadTranslations = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const translationFn = await getT(locale, namespaces);

        if (isMounted) {
          setT(() => translationFn);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err
              : new Error("Failed to load translations")
          );
          setIsLoading(false);
        }
      }
    };

    loadTranslations();

    // Cleanup function to prevent state updates if component unmounts
    return () => {
      isMounted = false;
    };
  }, [locale, namespaces.join(",")]); // Join namespaces for dependency array

  return {
    t,
    isLoading,
    error,
  };
}
