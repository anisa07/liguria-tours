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
import { AlertCircle, CheckCircle2, Edit3, Mail, Phone } from "lucide-react";
import { toast } from "sonner";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import CustomPhoneInput from "./ui/custom-phone-input";
import "react-phone-number-input/style.css";
import "./ui/phone-input.css";

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
  initialSubject?: string;
  initialMessage?: string;
}

const ContactForm = ({
  locale,
  emailApiAccessKey,
  capthaKey,
  initialSubject,
  initialMessage,
}: ContactFormProps) => {
  // Check if we're running on localhost
  const isLocalhost = () => {
    if (typeof window === 'undefined') return false;
    return window.location.hostname === 'localhost' || 
          window.location.hostname === '127.0.0.1' ||
          window.location.hostname === '::1';
  };

  const isOnLocalhost = isLocalhost();

  // Load saved user data from localStorage
  const loadSavedUserData = () => {
    try {
      const savedData = localStorage.getItem("liguria-tours-user-data");
      if (savedData) {
        return JSON.parse(savedData);
      }
    } catch {
      // Silently handle localStorage errors
    }
    return {};
  };

  const savedUserData = loadSavedUserData();

  // Get URL parameters for pre-filled values
  const getUrlParameters = () => {
    if (typeof window === 'undefined') return {};
    const urlParams = new URLSearchParams(window.location.search);
    return {
      subject: urlParams.get('subject') || '',
      message: urlParams.get('message') || '',
    };
  };

  const urlParams = getUrlParameters();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: savedUserData.name || "",
      email: savedUserData.email || "",
      phone: savedUserData.phone || "",
      subject: initialSubject || urlParams.subject || "",
      message: initialMessage || urlParams.message || "",
      "h-captcha-response": "",
    },
  });
  const { t, isLoading, error } = useTranslation(locale, ["common", "ui"]);
  const { sendEmail, status, message, reset } = useSendEmail();
  const hcaptchaRef = useRef<HCaptcha>(null);
  const [showCaptcha, setShowCaptcha] = useState(false);

  // Clear URL parameters after form is initialized
  useEffect(() => {
    if (typeof window !== 'undefined' && (urlParams.subject || urlParams.message)) {
      const url = new URL(window.location.href);
      url.searchParams.delete('subject');
      url.searchParams.delete('message');
      window.history.replaceState({}, '', url.toString());
    }
  }, [urlParams.subject, urlParams.message]);

  const onHCaptchaChange = (token: string) => {
    form.setValue("h-captcha-response", token);
  };

  // Watch form values and show captcha when all required fields are valid
  const watchedValues = form.watch();
  
  useEffect(() => {
    // Check if all required fields are filled and valid
    const { name, email, phone, subject, message } = watchedValues;
    
    if (name && email && phone && subject && message) {
      // Validate the current form state
      const result = contactFormSchema.safeParse({
        name,
        email,
        phone,
        subject,
        message,
        "h-captcha-response": ""
      });
      
      // Show captcha only when all required fields are valid and not on localhost
      if (result.success && !showCaptcha && !isOnLocalhost) {
        setShowCaptcha(true);
      }
    } else if (showCaptcha && (!name || !email || !phone || !subject || !message)) {
      // Hide captcha if user clears required fields
      setShowCaptcha(false);
      if (hcaptchaRef.current && !isOnLocalhost) {
        hcaptchaRef.current.resetCaptcha();
      }
      form.setValue("h-captcha-response", "");
    }
  }, [watchedValues, showCaptcha, form, isOnLocalhost]);

  const onSubmit = async (values: ContactFormValues) => {
    const botField = (
      document.querySelector('[name="botcheck"]') as HTMLInputElement
    )?.checked;
    if (botField) return;

    if (!values["h-captcha-response"] && !isOnLocalhost) {
      toast.error(
        t?.(
          "forms.captcha_required",
          "Пожалуйста, подтвердите, что вы не робот"
        ) || "Пожалуйста, подтвердите, что вы не робот"
      );
      return;
    }

    // Save user data to localStorage for future use
    const userDataToSave = {
      name: values.name,
      email: values.email,
      phone: values.phone,
    };
    
    try {
      localStorage.setItem("liguria-tours-user-data", JSON.stringify(userDataToSave));
    } catch {
      // Silently handle localStorage errors (e.g., storage quota exceeded)
    }

    await sendEmail(values, emailApiAccessKey);
    toast.success(
      t?.("forms.message_sent", "Сообщение отправлено") ||
        "Сообщение отправлено"
    );
    reset();
    form.reset();

    if (hcaptchaRef.current && !isOnLocalhost) {
      hcaptchaRef.current.resetCaptcha();
    }

    form.setValue("h-captcha-response", "");
    setShowCaptcha(false);
    
    // Restore user data after form reset
    form.setValue("name", userDataToSave.name);
    form.setValue("email", userDataToSave.email);
    form.setValue("phone", userDataToSave.phone);
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
              <FormControl>
                <div className="relative">
                  <Edit3 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder={t("forms.name_placeholder", "Введите ваше имя")}
                    className="pl-10"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder={t(
                        "forms.email_placeholder",
                        "example@email.com"
                      )}
                      className="pl-10"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <CustomPhoneInput
                      defaultCountry="IT"
                      placeholder={t("forms.phone_placeholder", "123 456 7890")}
                      value={field.value}
                      onChange={field.onChange}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-1 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
                  rows={6}
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

        {/* Conditional hCaptcha Loading */}
        {showCaptcha && !isOnLocalhost && (
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
        )}

        <Button
          disabled={status === "loading"}
          type="submit"
          className="rounded-full"
        >
          {t("buttons.submit", "Отправить")}
        </Button>

        {message && (
          (() => {
            let icon;
            if (status === "success") {
              icon = <CheckCircle2 />;
            } else if (status === "error") {
              icon = <AlertCircle />;
            }
            
            return (
              <Message
                type={status === "error" ? "error" : "default"}
                title={message}
                icon={icon}
              />
            );
          })()
        )}
      </form>
    </Form>
  );
};

export default ContactForm;