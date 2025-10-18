import React, { type ReactNode, type ErrorInfo } from "react";
import {
  ErrorBoundary as ReactErrorBoundary,
  type FallbackProps,
} from "react-error-boundary";
import { AlertTriangle, RefreshCw, Bug, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import type { Locale } from "@/i18n/config";

interface Props {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, errorInfo: ErrorInfo) => ReactNode);
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetKeys?: Array<string | number>;
  locale?: Locale;
  mode?: "development" | "production";
}

interface DefaultErrorFallbackProps {
  className?: string;
  locale?: Locale;
  mode?: "development" | "production";
}

// Default error fallback component
function DefaultErrorFallback({
  error,
  resetErrorBoundary,
  className,
  locale = "en",
  mode = "production",
}: FallbackProps & DefaultErrorFallbackProps) {
  const { t, isLoading } = useTranslation(locale, ["ui", "errors"]);
  const [copied, setCopied] = React.useState(false);
  const errorId = `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const reportError = React.useCallback((error: Error) => {
    // Simple error handling for static site - no external tracking needed
    void error; // Acknowledge error parameter
  }, []);

  // Copy error details to clipboard
  const copyError = React.useCallback(async () => {
    const errorDetails = `Error: ${error.message}\nStack: ${error.stack}\nError ID: ${errorId}`;

    if (typeof window === "undefined" || !window.navigator?.clipboard) {
      // Browser doesn't support clipboard API
      return;
    }

    try {
      await window.navigator.clipboard.writeText(errorDetails);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard write failed - silently ignore
    }
  }, [error.message, error.stack, errorId]);

  // Report error when component mounts
  React.useEffect(() => {
    reportError(error);
  }, [error, reportError]);

  // Show loading state while translations load
  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center p-8", className)}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-destructive"></div>
      </div>
    );
  }

  return (
    <div
      role="alert"
      className={cn(
        "p-8 m-4 border-2 border-destructive rounded-lg bg-destructive/10 text-destructive font-sans max-w-2xl mx-auto",
        className
      )}
    >
      <div className="flex items-center gap-3 mb-4">
        <AlertTriangle className="h-6 w-6 text-destructive" />
        <h2 className="text-lg font-semibold text-foreground">
          {t?.("errors.boundary.title", "Something went wrong")}
        </h2>
      </div>

      <button
        onClick={resetErrorBoundary}
        className="mb-4 px-4 py-2 bg-destructive text-destructive-foreground border-none rounded cursor-pointer text-sm font-medium hover:bg-destructive/90 transition-colors flex items-center gap-2"
      >
        <RefreshCw className="h-4 w-4" />
        {t?.("errors.boundary.tryAgain", "Try Again")}
      </button>

      <div className="mt-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
          <Bug className="h-4 w-4" />
          {t?.("errors.boundary.details", "Error Details")}
        </h3>

        <details className="p-3 bg-background border border-destructive/30 rounded">
          <summary className="cursor-pointer font-medium mb-2">
            {error.message}
          </summary>
          <div className="text-sm font-mono whitespace-pre-wrap text-destructive/80 mt-2">
            {error.stack}
          </div>

          {mode === "development" && (
            <div className="flex items-center justify-between mt-3 p-2 bg-muted/50 rounded text-xs">
              <span className="text-muted-foreground mr-2">
                {t?.("errors.boundary.errorId", "Error ID")}:
              </span>
              <code className="bg-background px-2 py-1 rounded text-foreground flex-1 mr-2">
                {errorId}
              </code>
              <button
                onClick={copyError}
                className="p-1 hover:bg-background rounded transition-colors"
                title={t?.("errors.boundary.copyError", "Copy error details")}
              >
                {copied ? (
                  <Check className="h-3 w-3 text-success" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </button>
            </div>
          )}
        </details>
      </div>
    </div>
  );
}

// Main ErrorBoundary component using react-error-boundary
function ErrorBoundary({
  children,
  fallback,
  onError,
  resetKeys,
  locale = "en",
  mode = "production",
}: Props) {
  // Handle error reporting and development logging
  const handleError = (error: Error, errorInfo: ErrorInfo) => {
    // Call custom error handler
    if (onError) {
      onError(error, errorInfo);
    }

    // Log error in development (you can enable console for debugging)
    if (mode === "development") {
      // eslint-disable-next-line no-console
      console.group("🚨 Error Boundary Caught An Error");
      // eslint-disable-next-line no-console
      console.error("Error:", error);
      // eslint-disable-next-line no-console
      console.error("Error Info:", errorInfo);
      // eslint-disable-next-line no-console
      console.groupEnd();
    }
  };

  // Create fallback renderer
  const fallbackRender = (props: FallbackProps) => {
    if (typeof fallback === "function") {
      return fallback(props.error, { componentStack: "" } as ErrorInfo);
    }
    if (fallback) {
      return fallback;
    }
    return <DefaultErrorFallback {...props} locale={locale} mode={mode} />;
  };

  return (
    <ReactErrorBoundary
      FallbackComponent={fallbackRender}
      onError={handleError}
      resetKeys={resetKeys}
    >
      {children}
    </ReactErrorBoundary>
  );
}

/**
 * Usage in Astro components:
 *
 * ---
 * import ErrorBoundary from "@/components/state/ErrorBoundary";
 *
 * const mode = import.meta.env.MODE as "development" | "production";
 * const locale = "en"; // or from props/params
 * ---
 *
 * <ErrorBoundary
 *   client:load
 *   locale={locale}
 *   mode={mode}
 * >
 *   <YourReactComponent client:load />
 * </ErrorBoundary>
 */

export default ErrorBoundary;
