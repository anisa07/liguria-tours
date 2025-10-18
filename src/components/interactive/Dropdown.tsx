import React, { useState, useRef, useEffect, type ReactNode } from "react";
import { ChevronDown, X, Search, Check } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import type { Locale } from "@/i18n/config";

export interface DropdownOption {
  label: string;
  value: string | number;
  disabled?: boolean;
  icon?: ReactNode;
  description?: string;
}

export interface DropdownProps {
  options: DropdownOption[];
  value?: string | number;
  placeholder?: string;
  disabled?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  multiple?: boolean;
  size?: "sm" | "md" | "lg";
  position?: "bottom" | "top" | "auto";
  align?: "left" | "right" | "center";
  maxHeight?: number;
  className?: string;
  optionClassName?: string;
  onChange?: (value: string | number | (string | number)[] | null) => void;
  onSearch?: (query: string) => void;
  renderOption?: (option: DropdownOption) => ReactNode;
  renderValue?: (option: DropdownOption | DropdownOption[]) => ReactNode;
  locale?: Locale;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  placeholder,
  disabled = false,
  searchable = false,
  clearable = false,
  multiple = false,
  size = "md",
  position = "auto",
  align = "left",
  maxHeight = 200,
  className = "",
  optionClassName = "",
  onChange,
  onSearch,
  renderOption,
  renderValue,
  locale = "en",
}) => {
  const { t } = useTranslation(locale, ["common"]);

  // Safe translation function
  const safeT = (key: string, fallback: string) => {
    return t ? t(key, fallback) : fallback;
  };

  // Get localized placeholder
  const localizedPlaceholder =
    placeholder || safeT("selectOption", "Select an option");
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [dropdownPosition, setDropdownPosition] = useState<"bottom" | "top">(
    "bottom"
  );

  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  // Get selected options
  const selectedOptions = multiple
    ? options.filter(
        (option) => Array.isArray(value) && value.includes(option.value)
      )
    : options.find((option) => option.value === value);

  // Filter options based on search
  const filteredOptions = searchQuery
    ? options.filter((option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  // Handle position calculation
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - triggerRect.bottom;
      const spaceAbove = triggerRect.top;

      if (position === "auto") {
        setDropdownPosition(
          spaceBelow < 200 && spaceAbove > spaceBelow ? "top" : "bottom"
        );
      } else {
        setDropdownPosition(position);
      }
    }
  }, [isOpen, position]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as globalThis.Node)
      ) {
        setIsOpen(false);
        setSearchQuery("");
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
        }
        break;
      case "ArrowUp":
        event.preventDefault();
        if (isOpen) {
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
        }
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (isOpen && highlightedIndex >= 0) {
          handleOptionSelect(filteredOptions[highlightedIndex]);
        } else {
          setIsOpen(!isOpen);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setSearchQuery("");
        setHighlightedIndex(-1);
        triggerRef.current?.focus();
        break;
      case "Tab":
        setIsOpen(false);
        break;
    }
  };

  // Handle option selection
  const handleOptionSelect = (option: DropdownOption) => {
    if (option.disabled) return;

    if (multiple) {
      const currentValues = Array.isArray(value)
        ? value
        : ([] as (string | number)[]);
      const newValues = currentValues.includes(option.value)
        ? currentValues.filter((v) => v !== option.value)
        : [...currentValues, option.value];
      onChange?.(newValues);
    } else {
      onChange?.(option.value);
      setIsOpen(false);
    }

    setSearchQuery("");
    setHighlightedIndex(-1);
  };

  // Handle clear
  const handleClear = (event: React.MouseEvent) => {
    event.stopPropagation();
    onChange?.(multiple ? [] : null);
    setSearchQuery("");
  };

  // Handle search
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    setHighlightedIndex(-1);
    onSearch?.(query);
  };

  // Get size classes
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return {
          trigger: "px-3 py-1.5 text-sm",
          option: "px-3 py-1.5 text-sm",
          search: "px-3 py-1.5 text-sm",
        };
      case "md":
        return {
          trigger: "px-4 py-2 text-base",
          option: "px-4 py-2 text-base",
          search: "px-4 py-2 text-base",
        };
      case "lg":
        return {
          trigger: "px-5 py-3 text-lg",
          option: "px-5 py-3 text-lg",
          search: "px-5 py-3 text-lg",
        };
      default:
        return {
          trigger: "px-4 py-2 text-base",
          option: "px-4 py-2 text-base",
          search: "px-4 py-2 text-base",
        };
    }
  };

  const sizeClasses = getSizeClasses();

  // Get alignment classes
  const getAlignmentClasses = () => {
    switch (align) {
      case "left":
        return "left-0";
      case "right":
        return "right-0";
      case "center":
        return "left-1/2 transform -translate-x-1/2";
      default:
        return "left-0";
    }
  };

  // Render display value
  const renderDisplayValue = () => {
    if (
      multiple &&
      Array.isArray(selectedOptions) &&
      selectedOptions.length > 0
    ) {
      if (renderValue) {
        return renderValue(selectedOptions);
      }
      return selectedOptions.length === 1
        ? selectedOptions[0].label
        : safeT("itemsSelected", `${selectedOptions.length} selected`);
    }

    if (!multiple && selectedOptions && !Array.isArray(selectedOptions)) {
      if (renderValue) {
        return renderValue(selectedOptions);
      }
      return selectedOptions.label;
    }

    return localizedPlaceholder;
  };

  return (
    <div
      ref={dropdownRef}
      className={`relative inline-block text-left ${className}`}
    >
      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        className={`
          relative w-full cursor-default rounded-md border border-border bg-background
          text-left shadow-sm focus:border-primary focus:outline-none focus:ring-1 
          focus:ring-primary/20 ${sizeClasses.trigger}
          ${disabled ? "bg-muted text-muted-foreground cursor-not-allowed" : "hover:border-border/80"}
        `}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="block truncate">{renderDisplayValue()}</span>

        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          {clearable &&
            (multiple ? Array.isArray(value) && value.length > 0 : value) && (
              <button
                type="button"
                className="pointer-events-auto p-1 text-muted-foreground hover:text-foreground focus:outline-none"
                onClick={handleClear}
                aria-label={safeT("clear", "Clear selection")}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          <ChevronDown
            className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className={`
            absolute z-10 mt-1 w-full rounded-md bg-popover shadow-lg ring-1 ring-border
            ${dropdownPosition === "top" ? "bottom-full mb-1 mt-0" : ""}
            ${getAlignmentClasses()}
          `}
        >
          {/* Search */}
          {searchable && (
            <div className="p-2 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  ref={searchRef}
                  type="text"
                  className={`w-full pl-9 rounded border border-border bg-background focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 ${sizeClasses.search}`}
                  placeholder={safeT("searchOptions", "Search options...")}
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
          )}

          {/* Options */}
          <div
            ref={optionsRef}
            className="max-h-60 overflow-auto py-1"
            style={{ maxHeight: `${maxHeight}px` }}
            role="listbox"
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => {
                const isSelected = multiple
                  ? Array.isArray(value) && value.includes(option.value)
                  : value === option.value;
                const isHighlighted = index === highlightedIndex;

                return (
                  <div
                    key={option.value}
                    className={`
                      cursor-pointer select-none relative ${sizeClasses.option}
                      ${isHighlighted ? "bg-accent text-accent-foreground" : "text-foreground"}
                      ${isSelected ? "bg-accent/50 font-medium" : ""}
                      ${option.disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-accent/50"}
                      ${optionClassName}
                    `}
                    onClick={() => handleOptionSelect(option)}
                    onKeyDown={(e) =>
                      (e.key === "Enter" || e.key === " ") &&
                      handleOptionSelect(option)
                    }
                    role="option"
                    aria-selected={isSelected}
                    tabIndex={0}
                  >
                    {renderOption ? (
                      renderOption(option)
                    ) : (
                      <div className="flex items-center">
                        {option.icon && (
                          <span className="mr-3 flex-shrink-0">
                            {option.icon}
                          </span>
                        )}
                        <div className="flex-1">
                          <div className="font-normal">{option.label}</div>
                          {option.description && (
                            <div className="text-sm text-muted-foreground">
                              {option.description}
                            </div>
                          )}
                        </div>
                        {isSelected && (
                          <span className="text-primary absolute inset-y-0 right-0 flex items-center pr-4">
                            <Check className="h-5 w-5" />
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className={`text-muted-foreground ${sizeClasses.option}`}>
                {safeT("noOptionsFound", "No options found")}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
