import React, { useState, useRef, useEffect } from "react";
import { type Country, getCountryCallingCode } from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import { ChevronDown, Search } from "lucide-react";

interface CustomPhoneInputProps {
  value?: string;
  onChange: (value: string | undefined) => void;
  onCountryChange?: (countryCode: Country, dialCode: string) => void;
  placeholder?: string;
  className?: string;
  defaultCountry?: Country;
}

// Define common countries for tours
const COUNTRIES_DATA: Array<{ code: Country; name: string; nameRu: string; dialCode: string }> = [
  { code: "IT", name: "Italy", nameRu: "Италия", dialCode: getCountryCallingCode("IT") },
  { code: "RU", name: "Russia", nameRu: "Россия", dialCode: getCountryCallingCode("RU") },
  { code: "US", name: "United States", nameRu: "США", dialCode: getCountryCallingCode("US") },
  { code: "GB", name: "United Kingdom", nameRu: "Великобритания", dialCode: getCountryCallingCode("GB") },
  { code: "FR", name: "France", nameRu: "Франция", dialCode: getCountryCallingCode("FR") },
  { code: "DE", name: "Germany", nameRu: "Германия", dialCode: getCountryCallingCode("DE") },
  { code: "ES", name: "Spain", nameRu: "Испания", dialCode: getCountryCallingCode("ES") },
  { code: "CH", name: "Switzerland", nameRu: "Швейцария", dialCode: getCountryCallingCode("CH") },
  { code: "AT", name: "Austria", nameRu: "Австрия", dialCode: getCountryCallingCode("AT") },
  { code: "NL", name: "Netherlands", nameRu: "Нидерланды", dialCode: getCountryCallingCode("NL") },
  { code: "BE", name: "Belgium", nameRu: "Бельгия", dialCode: getCountryCallingCode("BE") },
  { code: "SE", name: "Sweden", nameRu: "Швеция", dialCode: getCountryCallingCode("SE") },
  { code: "NO", name: "Norway", nameRu: "Норвегия", dialCode: getCountryCallingCode("NO") },
  { code: "DK", name: "Denmark", nameRu: "Дания", dialCode: getCountryCallingCode("DK") },
  { code: "FI", name: "Finland", nameRu: "Финляндия", dialCode: getCountryCallingCode("FI") },
  { code: "PL", name: "Poland", nameRu: "Польша", dialCode: getCountryCallingCode("PL") },
  { code: "CZ", name: "Czech Republic", nameRu: "Чехия", dialCode: getCountryCallingCode("CZ") },
  { code: "HU", name: "Hungary", nameRu: "Венгрия", dialCode: getCountryCallingCode("HU") },
  { code: "GR", name: "Greece", nameRu: "Греция", dialCode: getCountryCallingCode("GR") },
  { code: "PT", name: "Portugal", nameRu: "Португалия", dialCode: getCountryCallingCode("PT") },
  { code: "AU", name: "Australia", nameRu: "Австралия", dialCode: getCountryCallingCode("AU") },
  { code: "CA", name: "Canada", nameRu: "Канада", dialCode: getCountryCallingCode("CA") },
  { code: "JP", name: "Japan", nameRu: "Япония", dialCode: getCountryCallingCode("JP") },
  { code: "CN", name: "China", nameRu: "Китай", dialCode: getCountryCallingCode("CN") },
  { code: "IN", name: "India", nameRu: "Индия", dialCode: getCountryCallingCode("IN") },
  { code: "BR", name: "Brazil", nameRu: "Бразилия", dialCode: getCountryCallingCode("BR") },
  { code: "AR", name: "Argentina", nameRu: "Аргентина", dialCode: getCountryCallingCode("AR") },
  { code: "MX", name: "Mexico", nameRu: "Мексика", dialCode: getCountryCallingCode("MX") },
];

const CustomPhoneInput: React.FC<CustomPhoneInputProps> = ({
  value,
  onChange,
  onCountryChange,
  placeholder,
  className,
  defaultCountry = "IT",
}) => {
  const [selectedCountry, setSelectedCountry] = useState<Country>(defaultCountry);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get current country data
  const currentCountry = COUNTRIES_DATA.find(c => c.code === selectedCountry) || COUNTRIES_DATA[0];

  // Get flag component for country
  const FlagComponent = flags[selectedCountry];

  // Filter countries based on search term
  const filteredCountries = COUNTRIES_DATA.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.nameRu.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.dialCode.includes(searchTerm)
  );

  // Handle phone number input
  const handlePhoneNumberChange = (inputValue: string) => {
    // Only allow digits
    const digitsOnly = inputValue.replaceAll(/\D/g, '');
    
    // Limit the length to prevent overly long numbers (max 10 digits)
    if (digitsOnly.length <= 10) {
      setPhoneNumber(digitsOnly);
      
      // Pass only the digits to the form (without country code)
      onChange(digitsOnly);
    }
  };

  // Handle country selection
  const handleCountrySelect = (country: typeof COUNTRIES_DATA[0]) => {
    setSelectedCountry(country.code);
    setIsDropdownOpen(false);
    setSearchTerm("");
    
    // Notify parent component about country change
    if (onCountryChange) {
      onCountryChange(country.code, country.dialCode);
    }
  };

  // Parse existing value to extract only the phone number part
  useEffect(() => {
    if (value && value !== phoneNumber) {
      // If value contains only digits, use it directly
      if (/^\d+$/.test(value)) {
        setPhoneNumber(value);
      }
    }
  }, [value, phoneNumber]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      const target = event.target as HTMLElement;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setIsDropdownOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center w-full rounded-md border border-input bg-background">
        {/* Country Selector */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-3 py-2 hover:bg-accent rounded-l-md border-r border-input min-w-[4rem]"
          >
            {FlagComponent && (
              <div className="w-5 h-4 flex items-center justify-center overflow-hidden">
                <FlagComponent title={currentCountry.name} />
              </div>
            )}
            <span className="text-sm font-medium">+{currentCountry.dialCode}</span>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </button>

          {/* Dropdown */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-80 bg-background border border-border rounded-md shadow-lg z-50 max-h-80 overflow-hidden">
              {/* Search */}
              <div className="p-3 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search for countries"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 text-sm border border-input rounded-md bg-background"
                  />
                </div>
              </div>

              {/* Countries List */}
              <div className="max-h-60 overflow-y-auto">
                {filteredCountries.map((country) => {
                  const CountryFlag = flags[country.code];
                  return (
                    <button
                      key={country.code}
                      type="button"
                      onClick={() => handleCountrySelect(country)}
                      className="flex items-center gap-3 w-full px-3 py-2 hover:bg-accent text-left"
                    >
                      {CountryFlag && (
                        <div className="w-5 h-4 flex items-center justify-center overflow-hidden">
                          <CountryFlag title={country.name} />
                        </div>
                      )}
                      <span className="flex-1 text-sm">{country.nameRu} (+{country.dialCode})</span>
                      {selectedCountry === country.code && (
                        <span className="text-primary">✓</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Phone Number Input */}
        <input
          type="tel"
          inputMode="numeric"
          pattern="\d+"
          maxLength={10}
          value={phoneNumber}
          onChange={(e) => handlePhoneNumberChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 bg-transparent border-none outline-none text-sm"
        />
      </div>
    </div>
  );
};

export default CustomPhoneInput;
