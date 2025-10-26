import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/hooks/useTranslation";
import { useSendEmail } from "@/hooks/useSendEmail";
import { Loading } from "./ui/loading";
import { Message } from "./ui/message";
import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react";
import { toast } from "sonner";
import HCaptcha from "@hcaptcha/react-hcaptcha";

// Import types from separate files
import type { ContactFormValues } from "@/types";
import { contactFormSchema } from "@/types/forms";
import type { Locale } from "@/i18n/config";

// Declare hcaptcha on window
declare global {
  interface Window {
    hcaptcha: {
      getResponse(): string;
      reset(): void;
    };
  }
}

// Define props interface locally
interface ContactFormProps {
  locale: Locale;
  emailApiAccessKey: string;
  capthaKey: string;
}

export const ContactForm = ({
  locale,
  emailApiAccessKey,
  capthaKey,
}: ContactFormProps) => {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      "h-captcha-response": "",
    },
  });
  const { t, isLoading, error } = useTranslation(locale, ["common", "ui"]);
  const { sendEmail, status, message, reset } = useSendEmail();
  const hcaptchaRef = useRef<HCaptcha>(null);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  const onHCaptchaChange = (token: string) => {
    form.setValue("h-captcha-response", token);
  };

  // Add event listeners for form interaction
  useEffect(() => {
    const handleFormInteraction = () => {
      if (!userInteracted) {
        setUserInteracted(true);
        setShowCaptcha(true);
      }
    };

    const formElement = document.querySelector("form");
    if (formElement && !userInteracted) {
      const handleFocus = () => handleFormInteraction();
      const handleInput = () => handleFormInteraction();

      formElement.addEventListener("focusin", handleFocus);
      formElement.addEventListener("input", handleInput);

      return () => {
        formElement.removeEventListener("focusin", handleFocus);
        formElement.removeEventListener("input", handleInput);
      };
    }
  }, [userInteracted]);

  const onSubmit = async (values: ContactFormValues) => {
    const botField = (
      document.querySelector('[name="botcheck"]') as HTMLInputElement
    )?.checked;
    if (botField) return;

    // Show captcha if not already shown
    if (!showCaptcha) {
      setShowCaptcha(true);
      toast.info(
        t?.("forms.captcha_loading", "Загружается проверка безопасности...") ||
          "Загружается проверка безопасности..."
      );
      return;
    }

    if (!values["h-captcha-response"]) {
      toast.error(
        t?.(
          "forms.captcha_required",
          "Пожалуйста, подтвердите, что вы не робот"
        )
      );
      return;
    }

    await sendEmail(values, emailApiAccessKey);
    toast.success(
      t?.("forms.message_sent", "Сообщение отправлено") ||
        "Сообщение отправлено"
    );
    reset();
    form.reset();

    if (hcaptchaRef.current) {
      hcaptchaRef.current.resetCaptcha();
    }

    form.setValue("h-captcha-response", "");
  };

  if (error) {
    return <Message title={error.message} type="error" />;
  }

  if (isLoading || !t) {
    return <Loading />;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        aria-live="polite"
      >
        <input
          type="checkbox"
          name="botcheck"
          tabIndex={-1}
          aria-hidden="true"
          className="hidden"
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("forms.name", "Ваше Имя")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("forms.name_placeholder", "Введите ваше имя")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("forms.email", "Ваш E-mail")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t(
                    "forms.email_placeholder",
                    "example@email.com"
                  )}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("forms.subject", "Тема")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("forms.subject_placeholder", "Тема сообщения")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("forms.message", "Сообщение")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t(
                    "forms.message_placeholder",
                    "Напишите ваше сообщение"
                  )}
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Privacy Notice for hCaptcha */}
        <div className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg border border-border/50">
          <p className="text-xs leading-relaxed">
            {t(
              "forms.captcha_privacy_notice",
              "Для защиты от спама используется hCaptcha. При отправке формы будут загружены ресурсы hCaptcha, которые могут установить cookies. Это необходимо для проверки безопасности."
            )}{" "}
            <a
              href="/privacy-policy"
              className="underline hover:no-underline text-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("common.privacy_policy", "Политика конфиденциальности")}
            </a>
          </p>
          {!showCaptcha && (
            <p className="text-xs mt-2 text-muted-foreground/80">
              {t(
                "forms.captcha_delayed_loading",
                "Проверка безопасности загрузится при взаимодействии с формой для минимизации использования cookies."
              )}
            </p>
          )}
        </div>

        {/* Conditional hCaptcha Loading */}
        {showCaptcha ? (
          <HCaptcha
            ref={hcaptchaRef}
            sitekey={capthaKey}
            reCaptchaCompat={false}
            onVerify={onHCaptchaChange}
            languageOverride="ru"
            size="normal"
            theme="light"
            tabIndex={0}
            onLoad={() => {
              // hCaptcha loaded successfully - helps with third-party cookie management
            }}
            onError={() => {
              // Handle hCaptcha loading errors gracefully
              toast.error(
                t(
                  "forms.captcha_error",
                  "Ошибка загрузки проверки безопасности"
                )
              );
            }}
          />
        ) : (
          <div className="p-4 bg-muted/30 rounded-lg border border-dashed border-muted-foreground/30 text-center">
            <p className="text-sm text-muted-foreground">
              {t(
                "forms.captcha_placeholder",
                "Проверка безопасности загрузится при заполнении формы"
              )}
            </p>
          </div>
        )}

        <Button
          disabled={status === "loading"}
          type="submit"
          className="rounded-full"
        >
          {t("buttons.submit", "Отправить")}
        </Button>

        {message && (
          <Message
            type={status === "error" ? "error" : "default"}
            title={message}
            icon={
              status === "success" ? (
                <CheckCircle2Icon />
              ) : status === "error" ? (
                <AlertCircleIcon />
              ) : undefined
            }
          />
        )}
      </form>
    </Form>
  );
};
