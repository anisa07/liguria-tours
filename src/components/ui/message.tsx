import { Alert, AlertDescription, AlertTitle } from "./alert";
import type { ReactNode } from "react";

// Define props interface locally
interface MessageProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  type: "default" | "destructive" | "error";
}

export const Message = ({ title, description, icon, type }: MessageProps) => {
  return (
    <Alert variant={type === "default" ? "default" : "destructive"}>
      {icon && <>{icon}</>}
      <AlertTitle>{title}</AlertTitle>
      {description && <AlertDescription>{description}</AlertDescription>}
    </Alert>
  );
};
