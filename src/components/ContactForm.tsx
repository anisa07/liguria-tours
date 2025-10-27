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
import { AlertCircle, CheckCircle2, Edit3, Mail } from "lucide-react";
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
    if (globalThis.window === undefined) return false;
    return globalThis.window.location.hostname === 'localhost' || 
          globalThis.window.location.hostname === '127.0.0.1' ||
          globalThis.window.location.hostname === '::1';
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
    if (globalThis.window === undefined) return {};
    const urlParams = new URLSearchParams(globalThis.window.location.search);
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
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedUserName, setSubmittedUserName] = useState("");
  const [selectedDialCode, setSelectedDialCode] = useState("39");

  // Clear URL parameters after form is initialized
  useEffect(() => {
    if (globalThis.window !== undefined && (urlParams.subject || urlParams.message)) {
      const url = new URL(globalThis.window.location.href);
      url.searchParams.delete('subject');
      url.searchParams.delete('message');
      globalThis.window.history.replaceState({}, '', url.toString());
    }
  }, [urlParams.subject, urlParams.message]);

  const onHCaptchaChange = (token: string) => {
    form.setValue("h-captcha-response", token);
  };

  // Simple validation function for visual feedback
  const isValidPhone = (phone: string): boolean => {
    return /^\d{7,10}$/.test(phone);
  };

  // Handle country selection change
  const handleCountryChange = (dialCode: string) => {
    setSelectedDialCode(dialCode);
  };

  // Watch form values and show captcha when all required fields are valid
  const formValues = form.watch();
  
  useEffect(() => {
    // Check if all required fields are filled
    const { name, email, phone, subject, message } = formValues;
    
    // Simple check: all fields must have content
    const allFieldsFilled = !!(
      name && name.trim().length > 0 &&
      email && email.trim().length > 0 && email.includes('@') &&
      isValidPhone(phone) &&
      subject && subject.trim().length > 0 &&
      message && message.trim().length > 0
    );
    
    if (allFieldsFilled && !showCaptcha && !isOnLocalhost) {
      setShowCaptcha(true);
    } else if (!allFieldsFilled && showCaptcha) {
      // Hide captcha if user clears required fields
      setShowCaptcha(false);
      if (hcaptchaRef.current && !isOnLocalhost) {
        hcaptchaRef.current.resetCaptcha();
      }
      form.setValue("h-captcha-response", "");
    }
  }, [formValues, showCaptcha, form, isOnLocalhost]);

  const onSubmit = async (values: ContactFormValues) => {
    const botField = (
      document.querySelector('[name="botcheck"]') as HTMLInputElement
    )?.checked;
    if (botField) return;

    // Enhanced captcha validation
    if (!isOnLocalhost) {
      if (!values["h-captcha-response"] || values["h-captcha-response"].trim() === "") {
        toast.error(
          t?.(
            "forms.captcha_required",
            "Пожалуйста, подтвердите, что вы не робот"
          ) || "Пожалуйста, подтвердите, что вы не робот"
        );
        
        // Scroll to captcha if it exists
        const captchaElement = document.querySelector('.h-captcha');
        if (captchaElement) {
          captchaElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }
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

    // Add country code to phone number for submission
    const formDataWithCountryCode = {
      ...values,
      phone: `+${selectedDialCode}${values.phone}`,
    };

    await sendEmail(formDataWithCountryCode, emailApiAccessKey);
    
    // Store user name and set submitted state for thank you message
    setSubmittedUserName(values.name);
    setIsSubmitted(true);
    
    reset();
    form.reset();

    if (hcaptchaRef.current && !isOnLocalhost) {
      hcaptchaRef.current.resetCaptcha();
    }

    form.setValue("h-captcha-response", "");
    setShowCaptcha(false);
  };

  if (error) {
    return <Message title={error.message} type="error" />;
  }

  if (isLoading || !t) {
    return <Loading />;
  }

  // Show thank you message if form was submitted successfully
  if (isSubmitted && submittedUserName) {
    return (
      <div className="relative">
        {/* Enhanced backdrop with glassmorphism effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/95 to-white/90 backdrop-blur-sm rounded-2xl border border-primary/20 shadow-2xl"></div>
        
        {/* Decorative elements */}
        <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-xl"></div>
        <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-gradient-to-br from-secondary/20 to-tertiary/20 rounded-full blur-xl"></div>
        
        <div className="relative z-10 p-8">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <CheckCircle2 className="w-16 h-16 text-green-500" />
            </div>
            
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-foreground">
                Спасибо, {submittedUserName}!
              </h3>
              <p className="text-lg text-muted-foreground">
                Ваше сообщение получено. Я свяжусь с вами в ближайшее время!
              </p>
            </div>
            
            <Button
              onClick={() => {
                setIsSubmitted(false);
                setSubmittedUserName("");
                // Reset form but keep user's personal data (name, email, phone)
                const savedData = loadSavedUserData();
                form.reset({
                  name: savedData.name || "",
                  email: savedData.email || "",
                  phone: savedData.phone || "",
                  subject: "",
                  message: "",
                  "h-captcha-response": "",
                });
                setShowCaptcha(false);
                form.setValue("h-captcha-response", "");
                if (hcaptchaRef.current && !isOnLocalhost) {
                  hcaptchaRef.current.resetCaptcha();
                }
              }}
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
            >
              Отправить ещё сообщение
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Enhanced backdrop with glassmorphism effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/95 to-white/90 backdrop-blur-sm rounded-2xl border border-primary/20 shadow-2xl"></div>
      
      {/* Decorative elements */}
      <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-xl"></div>
      <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-gradient-to-br from-secondary/20 to-tertiary/20 rounded-full blur-xl"></div>
      
      <div className="relative z-10 p-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
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
            <FormItem className="space-y-2">
              <FormControl>
                <div className="relative group">
                  <Edit3 className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 transition-colors group-focus-within:text-primary z-10 pointer-events-none" />
                  <Input
                    placeholder={t("forms.name_placeholder", "Введите ваше имя")}
                    className="pl-12 pr-12 h-12 rounded-xl border-2 border-primary/20 bg-white/70 backdrop-blur-sm transition-all duration-300 focus:border-primary focus:bg-white focus:shadow-lg hover:border-primary/40 hover:bg-white/80"
                    {...field}
                  />
                  {field.value && field.value.trim().length > 0 && (
                    <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 h-5 w-5 z-10" />
                  )}
                </div>
              </FormControl>
              <FormMessage className="text-sm text-red-600" />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormControl>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 transition-colors group-focus-within:text-primary z-10 pointer-events-none" />
                    <Input
                      type="email"
                      placeholder={t(
                        "forms.email_placeholder",
                        "example@email.com"
                      )}
                      className="pl-12 pr-12 h-12 rounded-xl border-2 border-primary/20 bg-white/70 backdrop-blur-sm transition-all duration-300 focus:border-primary focus:bg-white focus:shadow-lg hover:border-primary/40 hover:bg-white/80"
                      {...field}
                    />
                    {field.value && field.value.includes('@') && field.value.includes('.') && (
                      <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 h-5 w-5 z-10" />
                    )}
                  </div>
                </FormControl>
                <FormMessage className="text-sm text-red-600" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormControl>
                  <div className="relative group">
                    <CustomPhoneInput
                      defaultCountry="IT"
                      placeholder={t("forms.phone_placeholder", "123 456 7890")}
                      value={field.value}
                      onChange={field.onChange}
                      onCountryChange={handleCountryChange}
                      className="flex h-12 w-full rounded-xl border-2 border-primary/20 bg-white/70 backdrop-blur-sm px-4 py-3 text-base shadow-sm transition-all duration-300 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary focus-visible:bg-white focus-visible:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 hover:border-primary/40 hover:bg-white/80 md:text-sm pr-12"
                    />
                    {field.value && isValidPhone(field.value) && (
                      <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 h-5 w-5 z-20" />
                    )}
                  </div>
                </FormControl>
                <FormMessage className="text-sm text-red-600" />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium text-foreground/80">
                {t("forms.subject", "Тема")} <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <div className="relative group">
                  <Input
                    placeholder={t("forms.subject_placeholder", "Тема сообщения")}
                    className="h-12 rounded-xl border-2 border-primary/20 bg-white/70 backdrop-blur-sm transition-all duration-300 focus:border-primary focus:bg-white focus:shadow-lg hover:border-primary/40 hover:bg-white/80 pl-4"
                    {...field}
                  />
                  {field.value && field.value.trim().length > 0 && (
                    <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 h-5 w-5" />
                  )}
                </div>
              </FormControl>
              <FormMessage className="text-sm text-red-600" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium text-foreground/80">
                {t("forms.message", "Сообщение")} <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <div className="relative group">
                  <Textarea
                    rows={6}
                    placeholder={t(
                      "forms.message_placeholder",
                      "Расскажите о ваших интересах, предпочтениях и пожеланиях для идеального тура по Лигурии..."
                    )}
                    className="resize-none rounded-xl border-2 border-primary/20 bg-white/70 backdrop-blur-sm transition-all duration-300 focus:border-primary focus:bg-white focus:shadow-lg hover:border-primary/40 hover:bg-white/80 min-h-[140px] p-4"
                    {...field}
                  />
                  {field.value && field.value.trim().length > 10 && (
                    <CheckCircle2 className="absolute right-3 top-4 text-green-500 h-5 w-5" />
                  )}
                </div>
              </FormControl>
              <FormMessage className="text-sm text-red-600" />
            </FormItem>
          )}
        />

        {/* Conditional hCaptcha Loading */}
        {showCaptcha && !isOnLocalhost && (
          <div className="space-y-4 pt-6 border-t border-primary/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                {t("forms.security_check", "Проверка безопасности")}
              </h3>
            </div>
            
            <div className="flex justify-center p-6 bg-white/60 rounded-xl border-2 border-primary/20 shadow-lg">
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
                  // hCaptcha loaded successfully
                }}
                onError={(_error) => {
                  // Handle hCaptcha loading errors gracefully
                  toast.error(
                    t?.(
                      "forms.captcha_error",
                      "Ошибка загрузки проверки безопасности"
                    ) || "Ошибка загрузки проверки безопасности"
                  );
                }}
              />
            </div>
            
            <p className="text-sm text-muted-foreground text-center">
              {t("forms.captcha_note", "Подтвердите, что вы не робот, чтобы отправить сообщение")}
            </p>
          </div>
        )}

        <div className="pt-6 border-t border-primary/10">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Button
              disabled={status === "loading"}
              type="submit"
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none disabled:opacity-60 min-h-[48px]"
            >
              {status === "loading" ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  {t("buttons.sending", "Отправляется...")}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {t("buttons.submit", "Отправить сообщение")}
                </div>
              )}
            </Button>
            
            <p className="text-sm text-muted-foreground text-center sm:text-left">
              {t("forms.privacy_note", "Ваши данные защищены и не будут переданы третьим лицам")}
            </p>
          </div>
        </div>

        {message && (
          <div className="pt-4">
            {(() => {
              let icon;
              let bgColor;
              let textColor;
              let borderColor;
              
              if (status === "success") {
                icon = <CheckCircle2 className="w-5 h-5" />;
                bgColor = "bg-green-50";
                textColor = "text-green-800";
                borderColor = "border-green-200";
              } else if (status === "error") {
                icon = <AlertCircle className="w-5 h-5" />;
                bgColor = "bg-red-50";
                textColor = "text-red-800";
                borderColor = "border-red-200";
              }
              
              return (
                <div className={`${bgColor} ${textColor} ${borderColor} p-4 rounded-xl border-l-4 ${status === "success" ? "border-l-green-400" : "border-l-red-400"} flex items-center gap-3 shadow-sm`}>
                  {icon}
                  <span className="font-medium">{message}</span>
                </div>
              );
            })()}
          </div>
        )}
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ContactForm;