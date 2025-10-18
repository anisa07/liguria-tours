import React, { useState, useRef, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import type { Locale } from "@/i18n/config";

export interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
  disabled?: boolean;
  icon?: ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  type?: "single" | "multiple";
  collapsible?: boolean;
  defaultValue?: string | string[];
  value?: string | string[];
  variant?: "default" | "bordered" | "filled" | "flush";
  size?: "sm" | "md" | "lg";
  animated?: boolean;
  className?: string;
  itemClassName?: string;
  headerClassName?: string;
  contentClassName?: string;
  onChange?: (value: string | string[] | null) => void;
  renderHeader?: (item: AccordionItem, isOpen: boolean) => ReactNode;
  locale?: Locale;
}

const Accordion: React.FC<AccordionProps> = ({
  items,
  type = "single",
  collapsible = true,
  defaultValue,
  value: controlledValue,
  variant = "default",
  size = "md",
  animated = true,
  className = "",
  itemClassName = "",
  headerClassName = "",
  contentClassName = "",
  onChange,
  renderHeader,
}) => {
  const [internalValue, setInternalValue] = useState<string | string[]>(() => {
    if (controlledValue !== undefined) return controlledValue;
    if (defaultValue !== undefined) return defaultValue;
    return type === "multiple" ? [] : "";
  });

  const contentRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Use controlled or internal state
  const value = controlledValue !== undefined ? controlledValue : internalValue;

  // Check if item is open
  const isItemOpen = (itemId: string): boolean => {
    if (type === "multiple" && Array.isArray(value)) {
      return value.includes(itemId);
    }
    return value === itemId;
  };

  // Handle item toggle
  const handleToggle = (itemId: string) => {
    const item = items.find((i) => i.id === itemId);
    if (item?.disabled) return;

    let newValue: string | string[] | null;

    if (type === "multiple") {
      const currentArray = Array.isArray(value) ? value : [];
      if (currentArray.includes(itemId)) {
        newValue = currentArray.filter((id) => id !== itemId);
      } else {
        newValue = [...currentArray, itemId];
      }
    } else {
      // Single type
      const isCurrentlyOpen = value === itemId;
      if (isCurrentlyOpen && collapsible) {
        newValue = null;
      } else {
        newValue = itemId;
      }
    }

    if (controlledValue === undefined) {
      setInternalValue(newValue || (type === "multiple" ? [] : ""));
    }

    onChange?.(newValue);
  };

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent, itemId: string) => {
    const currentIndex = items.findIndex((item) => item.id === itemId);

    switch (event.key) {
      case "ArrowDown": {
        event.preventDefault();
        const nextIndex = (currentIndex + 1) % items.length;
        const nextItem = items[nextIndex];
        if (nextItem && !nextItem.disabled) {
          const nextButton = document.getElementById(
            `accordion-header-${nextItem.id}`
          );
          nextButton?.focus();
        }
        break;
      }
      case "ArrowUp": {
        event.preventDefault();
        const prevIndex =
          currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        const prevItem = items[prevIndex];
        if (prevItem && !prevItem.disabled) {
          const prevButton = document.getElementById(
            `accordion-header-${prevItem.id}`
          );
          prevButton?.focus();
        }
        break;
      }
      case "Home": {
        event.preventDefault();
        const firstItem = items.find((item) => !item.disabled);
        if (firstItem) {
          const firstButton = document.getElementById(
            `accordion-header-${firstItem.id}`
          );
          firstButton?.focus();
        }
        break;
      }
      case "End": {
        event.preventDefault();
        const lastItem = [...items].reverse().find((item) => !item.disabled);
        if (lastItem) {
          const lastButton = document.getElementById(
            `accordion-header-${lastItem.id}`
          );
          lastButton?.focus();
        }
        break;
      }
      case "Enter":
      case " ": {
        event.preventDefault();
        handleToggle(itemId);
        break;
      }
    }
  };

  // Get size classes
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return {
          header: "px-3 py-2 text-sm",
          content: "px-3 py-2 text-sm",
        };
      case "md":
        return {
          header: "px-4 py-3 text-base",
          content: "px-4 py-3 text-base",
        };
      case "lg":
        return {
          header: "px-6 py-4 text-lg",
          content: "px-6 py-4 text-lg",
        };
      default:
        return {
          header: "px-4 py-3 text-base",
          content: "px-4 py-3 text-base",
        };
    }
  };

  // Get variant classes
  const getVariantClasses = () => {
    switch (variant) {
      case "bordered":
        return {
          container: "border border-border rounded-lg",
          item: "border-b border-border last:border-b-0",
          header: "hover:bg-muted/50 focus:bg-muted/50",
          content: "bg-background",
        };
      case "filled":
        return {
          container: "",
          item: "",
          header: "bg-muted hover:bg-muted/80 focus:bg-muted/80 rounded-t-lg",
          content: "bg-background border border-t-0 border-border rounded-b-lg",
        };
      case "flush":
        return {
          container: "",
          item: "border-b border-border last:border-b-0",
          header: "hover:bg-muted/50 focus:bg-muted/50",
          content: "bg-transparent",
        };
      default:
        return {
          container: "border border-border rounded-lg divide-y divide-border",
          item: "",
          header: "hover:bg-muted/50 focus:bg-muted/50",
          content: "bg-background",
        };
    }
  };

  const sizeClasses = getSizeClasses();
  const variantClasses = getVariantClasses();

  // Render header content
  const renderHeaderContent = (item: AccordionItem, isOpen: boolean) => {
    if (renderHeader) {
      return renderHeader(item, isOpen);
    }

    return (
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
          <span className="font-medium text-left">{item.title}</span>
        </div>

        <ChevronDown
          className={`h-5 w-5 text-muted-foreground transition-transform duration-200 flex-shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>
    );
  };

  return (
    <div className={`${variantClasses.container} ${className}`}>
      {items.map((item) => {
        const isOpen = isItemOpen(item.id);
        const isDisabled = item.disabled;

        return (
          <div
            key={item.id}
            className={`${variantClasses.item} ${itemClassName}`}
          >
            {/* Header */}
            <button
              id={`accordion-header-${item.id}`}
              className={`
                w-full text-left focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                transition-colors duration-200
                ${sizeClasses.header}
                ${variantClasses.header}
                ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
                ${headerClassName}
              `}
              onClick={() => handleToggle(item.id)}
              onKeyDown={(e) => handleKeyDown(e, item.id)}
              disabled={isDisabled}
              aria-expanded={isOpen}
              aria-controls={`accordion-content-${item.id}`}
              type="button"
            >
              {renderHeaderContent(item, isOpen)}
            </button>

            {/* Content */}
            <div
              id={`accordion-content-${item.id}`}
              ref={(el) => {
                contentRefs.current[item.id] = el;
              }}
              className={`
                overflow-hidden
                ${animated ? "transition-all duration-300 ease-in-out" : ""}
                ${isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"}
              `}
              role="region"
              aria-labelledby={`accordion-header-${item.id}`}
              style={{
                maxHeight: isOpen
                  ? contentRefs.current[item.id]?.scrollHeight || "auto"
                  : 0,
              }}
            >
              <div
                className={`
                  ${sizeClasses.content}
                  ${variantClasses.content}
                  ${contentClassName}
                `}
              >
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;
