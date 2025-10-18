// Form-related type definitions
import { z } from "zod";

// Contact form schema and types
export const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  email: z.string().email("Please enter a valid email"),
  message: z.string().min(1, "Message is required").max(5000),
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
  submit: (data: T) => Promise<void>;
  state: FormSubmissionState;
  reset: () => void;
}
