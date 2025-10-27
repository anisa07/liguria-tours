// Form-related type definitions
import { z } from "zod";

// Contact form schema and types
export const contactFormSchema = z.object({
  name: z.string().min(1, "Введите ваше имя").max(120),
  email: z.string().email("Введите ваш Email"),
  phone: z.string()
    .min(7, "Минимум 7 цифр")
    .max(15, "Максимум 15 цифр")
    .regex(/^[0-9]+$/, "Только цифры"),
  message: z.string().min(10, "Введите сообщение минимум 10 символов").max(5000),
  "h-captcha-response": z.string(),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

// Generic form submission states
export interface FormSubmissionState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

// Form submission hook return type
export interface UseFormSubmissionReturn<T> {
  submit: (_data: T) => Promise<void>;
  state: FormSubmissionState;
  reset: () => void;
}
