import React, { useState, useRef, useEffect, type ReactNode } from "react";
import type { Locale } from "@/i18n/config";

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
  icon?: ReactNode;
  badge?: string | number;
}

export interface TabsProps {
  items: TabItem[];
  defaultTab?: string;
  activeTab?: string;
  orientation?: "horizontal" | "vertical";
  variant?: "default" | "pills" | "underline" | "bordered";
  size?: "sm" | "md" | "lg";
  centered?: boolean;
  fullWidth?: boolean;
  lazy?: boolean;
  keepMounted?: boolean;
  className?: string;
  tabClassName?: string;
  panelClassName?: string;
  onChange?: (tabId: string) => void;
  renderTab?: (item: TabItem, isActive: boolean) => ReactNode;
  locale?: Locale;
}

const Tabs: React.FC<TabsProps> = ({
  items,
  defaultTab,
  activeTab: controlledActiveTab,
  orientation = "horizontal",
  variant = "default",
  size = "md",
  centered = false,
  fullWidth = false,
  lazy = false,
  keepMounted = true,
  className = "",
  tabClassName = "",
  panelClassName = "",
  onChange,
  renderTab,
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState(
    controlledActiveTab || defaultTab || items[0]?.id || ""
  );
  const [loadedTabs, setLoadedTabs] = useState(new Set([internalActiveTab]));

  const tabListRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  // Use controlled or internal state
  const activeTab =
    controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab;

  // Handle tab change
  const handleTabChange = (tabId: string) => {
    const tab = items.find((item) => item.id === tabId);
    if (tab?.disabled) return;

    if (controlledActiveTab === undefined) {
      setInternalActiveTab(tabId);
    }

    if (lazy) {
      setLoadedTabs((prev) => new Set([...prev, tabId]));
    }

    onChange?.(tabId);
  };

  // Keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent, tabId: string) => {
    const currentIndex = items.findIndex((item) => item.id === tabId);
    let nextIndex = currentIndex;

    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        if (orientation === "horizontal" && event.key === "ArrowDown") break;
        if (orientation === "vertical" && event.key === "ArrowRight") break;
        event.preventDefault();
        nextIndex = (currentIndex + 1) % items.length;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        if (orientation === "horizontal" && event.key === "ArrowUp") break;
        if (orientation === "vertical" && event.key === "ArrowLeft") break;
        event.preventDefault();
        nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        break;
      case "Home":
        event.preventDefault();
        nextIndex = 0;
        break;
      case "End":
        event.preventDefault();
        nextIndex = items.length - 1;
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        handleTabChange(tabId);
        return;
    }

    // Skip disabled tabs
    while (items[nextIndex]?.disabled && nextIndex !== currentIndex) {
      if (
        event.key === "ArrowRight" ||
        event.key === "ArrowDown" ||
        event.key === "End"
      ) {
        nextIndex = (nextIndex + 1) % items.length;
      } else {
        nextIndex = nextIndex > 0 ? nextIndex - 1 : items.length - 1;
      }
    }

    if (nextIndex !== currentIndex) {
      const nextTabId = items[nextIndex].id;
      tabRefs.current[nextTabId]?.focus();
    }
  };

  // Initialize loaded tabs for lazy loading
  useEffect(() => {
    if (lazy && activeTab && !loadedTabs.has(activeTab)) {
      setLoadedTabs((prev) => new Set([...prev, activeTab]));
    }
  }, [lazy, activeTab, loadedTabs]);

  // Get size classes
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return {
          tab: "px-3 py-1.5 text-sm",
          panel: "p-3",
        };
      case "md":
        return {
          tab: "px-4 py-2 text-base",
          panel: "p-4",
        };
      case "lg":
        return {
          tab: "px-6 py-3 text-lg",
          panel: "p-6",
        };
      default:
        return {
          tab: "px-4 py-2 text-base",
          panel: "p-4",
        };
    }
  };

  // Get variant classes
  const getVariantClasses = () => {
    const baseClasses =
      "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2";

    switch (variant) {
      case "pills":
        return {
          tabList: "",
          tab: `${baseClasses} rounded-full font-medium transition-colors duration-200`,
          activeTab: "bg-primary text-primary-foreground shadow-sm",
          inactiveTab:
            "text-muted-foreground hover:text-foreground hover:bg-muted",
          disabledTab: "text-muted-foreground/50 cursor-not-allowed",
        };
      case "underline":
        return {
          tabList: "border-b border-border",
          tab: `${baseClasses} border-b-2 border-transparent font-medium transition-colors duration-200 -mb-px`,
          activeTab: "border-primary text-primary",
          inactiveTab:
            "text-muted-foreground hover:text-foreground hover:border-border",
          disabledTab: "text-muted-foreground/50 cursor-not-allowed",
        };
      case "bordered":
        return {
          tabList: "border border-border rounded-lg bg-muted p-1",
          tab: `${baseClasses} rounded-md font-medium transition-colors duration-200`,
          activeTab: "bg-background text-foreground shadow-sm",
          inactiveTab: "text-muted-foreground hover:text-foreground",
          disabledTab: "text-muted-foreground/50 cursor-not-allowed",
        };
      default:
        return {
          tabList: "border-b border-border",
          tab: `${baseClasses} font-medium transition-colors duration-200`,
          activeTab: "text-primary border-b-2 border-primary -mb-px",
          inactiveTab:
            "text-muted-foreground hover:text-foreground border-b-2 border-transparent -mb-px",
          disabledTab:
            "text-muted-foreground/50 cursor-not-allowed border-b-2 border-transparent -mb-px",
        };
    }
  };

  const sizeClasses = getSizeClasses();
  const variantClasses = getVariantClasses();

  // Get layout classes
  const getLayoutClasses = () => {
    const baseClasses = orientation === "vertical" ? "flex gap-6" : "block";
    return {
      container: baseClasses,
      tabList: `
        ${orientation === "vertical" ? "flex flex-col space-y-1 w-48" : "flex space-x-1"}
        ${centered && orientation === "horizontal" ? "justify-center" : ""}
        ${fullWidth && orientation === "horizontal" ? "w-full" : ""}
        ${variantClasses.tabList}
      `,
      tabButton: fullWidth && orientation === "horizontal" ? "flex-1" : "",
      panelContainer: orientation === "vertical" ? "flex-1" : "mt-4",
    };
  };

  const layoutClasses = getLayoutClasses();

  // Render tab button
  const renderTabButton = (item: TabItem, isActive: boolean) => {
    if (renderTab) {
      return renderTab(item, isActive);
    }

    return (
      <div className="flex items-center gap-2">
        {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
        <span>{item.label}</span>
        {item.badge && (
          <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-primary-foreground bg-primary rounded-full">
            {item.badge}
          </span>
        )}
      </div>
    );
  };

  // Should render panel content
  const shouldRenderPanel = (tabId: string) => {
    if (!lazy) return true;
    if (keepMounted) return loadedTabs.has(tabId);
    return tabId === activeTab;
  };

  return (
    <div className={`${layoutClasses.container} ${className}`}>
      {/* Tab List */}
      <div
        ref={tabListRef}
        className={layoutClasses.tabList}
        role="tablist"
        aria-orientation={orientation}
      >
        {items.map((item) => {
          const isActive = item.id === activeTab;
          const isDisabled = item.disabled;

          return (
            <button
              key={item.id}
              ref={(el) => {
                tabRefs.current[item.id] = el;
              }}
              className={`
                ${sizeClasses.tab}
                ${layoutClasses.tabButton}
                ${variantClasses.tab}
                ${
                  isActive
                    ? variantClasses.activeTab
                    : isDisabled
                      ? variantClasses.disabledTab
                      : variantClasses.inactiveTab
                }
                ${tabClassName}
              `}
              onClick={() => handleTabChange(item.id)}
              onKeyDown={(e) => handleKeyDown(e, item.id)}
              disabled={isDisabled}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${item.id}`}
              id={`tab-${item.id}`}
              tabIndex={isActive ? 0 : -1}
            >
              {renderTabButton(item, isActive)}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className={layoutClasses.panelContainer}>
        {items.map((item) => {
          const isActive = item.id === activeTab;
          const shouldRender = shouldRenderPanel(item.id);

          if (!shouldRender) return null;

          return (
            <div
              key={item.id}
              className={`
                ${sizeClasses.panel}
                ${!isActive ? "hidden" : ""}
                ${panelClassName}
              `}
              role="tabpanel"
              aria-labelledby={`tab-${item.id}`}
              id={`panel-${item.id}`}
              tabIndex={0}
            >
              {item.content}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Tabs;
