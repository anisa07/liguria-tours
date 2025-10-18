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
      message: "",
    },
  });
  const { t, isLoading, error } = useTranslation(locale, ["common", "ui"]);
  const { sendEmail, status, message, reset } = useSendEmail();

  const onSubmit = async (values: ContactFormValues) => {
    await sendEmail(values, emailApiAccessKey);
    toast("Message sent");
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
              <FormLabel>{t("forms.name", "Username")}</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
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
              <FormLabel>{t("forms.email", "Email")}</FormLabel>
              <FormControl>
                <Input placeholder="john_doe@gmail.com" {...field} />
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
              <FormLabel>{t("forms.message", "Message")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Your message"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={status === "loading"} type="submit">
          {t("buttons.submit", "Submit")}
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
