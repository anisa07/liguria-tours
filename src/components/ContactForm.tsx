import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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

// Import types from separate files
import type { ContactFormValues } from "@/types";
import { contactFormSchema } from "@/types/forms";
import type { Locale } from "@/i18n/config";

// Define props interface locally
interface ContactFormProps {
  locale: Locale;
  emailApiAccessKey: string;
}

export const ContactForm = ({
  locale,
  emailApiAccessKey,
}: ContactFormProps) => {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });
  const { t, isLoading, error } = useTranslation(locale, ["common", "ui"]);
  const { sendEmail, status, message, reset } = useSendEmail();

  const onSubmit = async (values: ContactFormValues) => {
    await sendEmail(values, emailApiAccessKey);
    toast(
      t?.("forms.message_sent", "Сообщение отправлено") ||
        "Сообщение отправлено"
    );
    reset();
    form.reset();
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
