import React, { useState, useRef, useEffect, type ReactNode } from "react";
import type { Locale } from "../../types";

export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  trigger?: "hover" | "click" | "focus";
  delay?: number;
  offset?: number;
  arrow?: boolean;
  disabled?: boolean;
  className?: string;
  contentClassName?: string;
  locale?: Locale;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = "top",
  trigger = "hover",
  delay = 300,
  offset = 8,
  arrow = true,
  disabled = false,
  className = "",
  contentClassName = "",
}) => {
  // Safe translation functio
  const [isVisible, setIsVisible] = useState(false);
  const [actualPosition, setActualPosition] = useState(position);
  const timeoutRef = useRef<number | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Calculate position
  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      let newPosition = position;

      // Check if tooltip fits in the desired position
      switch (position) {
        case "top":
          if (triggerRect.top - tooltipRect.height - offset < 0) {
            newPosition = "bottom";
          }
          break;
        case "bottom":
          if (
            triggerRect.bottom + tooltipRect.height + offset >
            viewport.height
          ) {
            newPosition = "top";
          }
          break;
        case "left":
          if (triggerRect.left - tooltipRect.width - offset < 0) {
            newPosition = "right";
          }
          break;
        case "right":
          if (triggerRect.right + tooltipRect.width + offset > viewport.width) {
            newPosition = "left";
          }
          break;
      }

      setActualPosition(newPosition);
    }
  }, [isVisible, position, offset]);

  // Show tooltip
  const showTooltip = () => {
    if (disabled) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  // Hide tooltip
  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setIsVisible(false);
  };

  // Handle click
  const handleClick = () => {
    if (trigger === "click") {
      if (isVisible) {
        hideTooltip();
      } else {
        showTooltip();
      }
    }
  };

  // Handle focus
  const handleFocus = () => {
    if (trigger === "focus" || trigger === "hover") {
      showTooltip();
    }
  };

  // Handle blur
  const handleBlur = () => {
    if (trigger === "focus" || trigger === "hover") {
      hideTooltip();
    }
  };

  // Handle mouse events
  const handleMouseEnter = () => {
    if (trigger === "hover") {
      showTooltip();
    }
  };

  const handleMouseLeave = () => {
    if (trigger === "hover") {
      hideTooltip();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape" && isVisible) {
        hideTooltip();
      }
    };

    if (isVisible) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isVisible]);

  // Handle click outside
  useEffect(() => {
    if (trigger !== "click") return;

    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (
        triggerRef.current &&
        tooltipRef.current &&
        !triggerRef.current.contains(event.target as globalThis.Node) &&
        !tooltipRef.current.contains(event.target as globalThis.Node)
      ) {
        hideTooltip();
      }
    };

    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isVisible, trigger]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Get position styles
  const getPositionStyles = () => {
    const styles: React.CSSProperties = {
      position: "absolute",
      zIndex: 50,
    };

    switch (actualPosition) {
      case "top":
        styles.bottom = `calc(100% + ${offset}px)`;
        styles.left = "50%";
        styles.transform = "translateX(-50%)";
        break;
      case "bottom":
        styles.top = `calc(100% + ${offset}px)`;
        styles.left = "50%";
        styles.transform = "translateX(-50%)";
        break;
      case "left":
        styles.right = `calc(100% + ${offset}px)`;
        styles.top = "50%";
        styles.transform = "translateY(-50%)";
        break;
      case "right":
        styles.left = `calc(100% + ${offset}px)`;
        styles.top = "50%";
        styles.transform = "translateY(-50%)";
        break;
    }

    return styles;
  };

  // Get arrow classes
  const getArrowClasses = () => {
    const baseClasses = "absolute w-2 h-2 bg-popover transform rotate-45";

    switch (actualPosition) {
      case "top":
        return `${baseClasses} -bottom-1 left-1/2 -translate-x-1/2`;
      case "bottom":
        return `${baseClasses} -top-1 left-1/2 -translate-x-1/2`;
      case "left":
        return `${baseClasses} -right-1 top-1/2 -translate-y-1/2`;
      case "right":
        return `${baseClasses} -left-1 top-1/2 -translate-y-1/2`;
      default:
        return baseClasses;
    }
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Trigger */}
      <div
        ref={triggerRef}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
          }
        }}
        tabIndex={trigger === "click" ? 0 : -1}
        role={trigger === "click" ? "button" : undefined}
        aria-describedby={isVisible ? "tooltip" : undefined}
      >
        {children}
      </div>

      {/* Tooltip */}
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`
            px-3 py-2 text-sm text-popover-foreground bg-popover rounded-md shadow-lg border border-border
            max-w-xs break-words z-50
            animate-in fade-in-0 zoom-in-95 duration-200
            ${contentClassName}
          `}
          style={getPositionStyles()}
          role="tooltip"
          aria-hidden="false"
        >
          {content}

          {/* Arrow */}
          {arrow && <div className={getArrowClasses()} />}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
