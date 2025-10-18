import type { ContactFormValues } from "@/types";
import { FetchService } from "@/services/fetch.service";
import { useFormSubmission } from "./useFormSubmission";

/**
 * To get ACCESS_KEY_HERE visit https://web3forms.com/platforms/react-contact-form
 * set your email and click "Create Access Key".
 * This email will get ACCESS_KEY_HERE
 * @param formValues: ContactFormValues,
 * @param ACCESS_KEY_HERE: string,
 **/
export const useSendEmail = () => {
  const url = "https://api.web3forms.com/submit";
  const { status, message, submit, reset } = useFormSubmission();

  const sendEmail = (
    formValues: ContactFormValues,
    ACCESS_KEY_HERE: string
  ) => {
    return submit(() =>
      FetchService.post(url, {
        ...formValues,
        access_key: ACCESS_KEY_HERE,
      })
    );
  };

  return {
    sendEmail,
    message,
    status,
    reset,
  };
};
