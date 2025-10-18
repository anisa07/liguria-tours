import { useState, useCallback } from "react";

export function useFormSubmission<T>() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState<string | null>(null);

  const submit = useCallback(async (submitFunc: () => Promise<T>) => {
    setStatus("loading");
    setMessage(null);
    try {
      await submitFunc();
      setStatus("success");
      return { success: true };
    } catch (err: any) {
      const isDev = import.meta.env.DEV;
      // Log details for debugging but do not expose internals to users
      // eslint-disable-next-line no-console
      isDev && console.error("submit error", err);
      setStatus("error");

      // Generic error message for end users, detailed only in DEV
      const userMessage = isDev
        ? err?.payload?.error || err?.message || "Submission failed"
        : "There was an error sending your message. Please try again later.";
      setMessage(userMessage);

      return { success: false, error: err };
    }
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setMessage(null);
  }, []);

  return { status, message, submit, reset };
}
