// Toast Notification Types
export type ToastType = "success" | "error" | "warning" | "info";

export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export interface Props {
  /** Type of toast notification */
  type?: ToastType;

  /** Title text */
  title?: string;

  /** Message content */
  message?: string;

  /** Auto-dismiss duration in milliseconds */
  duration?: number;

  /** Position on screen */
  position?: ToastPosition;

  /** Whether to show close button */
  showClose?: boolean;

  /** Whether to show icon */
  showIcon?: boolean;

  /** Action button text */
  actionText?: string;

  /** Action button handler */
  actionHandler?: string;

  /** Close callback */
  onClose?: () => void;

  /** Additional CSS classes */
  className?: string;

  /** Toast ID */
  id?: string;

  /** Whether toast persists until manually closed */
  persistent?: boolean;

  /** Whether to show progress bar */
  progress?: boolean;

  /** Other HTML attributes */
  [key: string]: unknown;
}

export interface ToastOptions {
  /** Toast ID */
  id?: string;

  /** Type of toast notification */
  type?: ToastType;

  /** Title text */
  title?: string;

  /** Message content */
  message: string;

  /** Auto-dismiss duration in milliseconds */
  duration?: number;

  /** Position on screen */
  position?: ToastPosition;

  /** Whether to show close button */
  showClose?: boolean;

  /** Whether to show icon */
  showIcon?: boolean;

  /** Action button text */
  actionText?: string;

  /** Action button handler function */
  actionHandler?: () => void;

  /** Close callback function */
  onClose?: () => void;

  /** Whether toast persists until manually closed */
  persistent?: boolean;

  /** Whether to show progress bar */
  progress?: boolean;
}

// Toast Manager API
export interface ToastManager {
  show(options: ToastOptions): string;
  dismiss(id: string): void;
  dismissAll(position?: ToastPosition): void;
  handleAction(id: string): void;
  success(message: string, options?: Partial<ToastOptions>): string;
  error(message: string, options?: Partial<ToastOptions>): string;
  warning(message: string, options?: Partial<ToastOptions>): string;
  info(message: string, options?: Partial<ToastOptions>): string;
}

// Global Toast API
export interface GlobalToastAPI {
  success: (message: string, options?: Partial<ToastOptions>) => string;
  error: (message: string, options?: Partial<ToastOptions>) => string;
  warning: (message: string, options?: Partial<ToastOptions>) => string;
  info: (message: string, options?: Partial<ToastOptions>) => string;
}
