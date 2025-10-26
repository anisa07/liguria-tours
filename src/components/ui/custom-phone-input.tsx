import React, { useState, useRef, useEffect } from "react";
import flags from "react-phone-number-input/flags";
import PhoneInput, {
  type Country,
  getCountryCallingCode,
  parsePhoneNumber,
  type Value,
} from "react-phone-number-input";
import { ChevronDown, Search } from "lucide-react";

interface CustomPhoneInputProps {
  value?: string;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  className?: string;
  defaultCountry?: Country;
}

// Define common countries for tours with their emoji flags
const COUNTRIES_DATA: Array<{
  code: Country;
  flag: string;
  name: string;
  dialCode: string;
}> = [
  {
    code: "IT",
    flag: "🇮🇹",
    name: "Italy",
    dialCode: getCountryCallingCode("IT"),
  },
  {
    code: "RU",
    flag: "🇷🇺",
    name: "Russia",
    dialCode: getCountryCallingCode("RU"),
  },
  {
    code: "US",
    flag: "🇺🇸",
    name: "United States",
    dialCode: getCountryCallingCode("US"),
  },
  {
    code: "GB",
    flag: "🇬🇧",
    name: "United Kingdom",
    dialCode: getCountryCallingCode("GB"),
  },
  {
    code: "FR",
    flag: "🇫🇷",
    name: "France",
    dialCode: getCountryCallingCode("FR"),
  },
  {
    code: "DE",
    flag: "🇩🇪",
    name: "Germany",
    dialCode: getCountryCallingCode("DE"),
  },
  {
    code: "ES",
    flag: "🇪🇸",
    name: "Spain",
    dialCode: getCountryCallingCode("ES"),
  },
  {
    code: "CH",
    flag: "🇨🇭",
    name: "Switzerland",
    dialCode: getCountryCallingCode("CH"),
  },
  {
    code: "AT",
    flag: "🇦🇹",
    name: "Austria",
    dialCode: getCountryCallingCode("AT"),
  },
  {
    code: "NL",
    flag: "🇳🇱",
    name: "Netherlands",
    dialCode: getCountryCallingCode("NL"),
  },
  {
    code: "BE",
    flag: "🇧🇪",
    name: "Belgium",
    dialCode: getCountryCallingCode("BE"),
  },
  {
    code: "SE",
    flag: "🇸🇪",
    name: "Sweden",
    dialCode: getCountryCallingCode("SE"),
  },
  {
    code: "NO",
    flag: "🇳🇴",
    name: "Norway",
    dialCode: getCountryCallingCode("NO"),
  },
  {
    code: "DK",
    flag: "🇩🇰",
    name: "Denmark",
    dialCode: getCountryCallingCode("DK"),
  },
  {
    code: "FI",
    flag: "🇫🇮",
    name: "Finland",
    dialCode: getCountryCallingCode("FI"),
  },
  {
    code: "PL",
    flag: "🇵🇱",
    name: "Poland",
    dialCode: getCountryCallingCode("PL"),
  },
  {
    code: "CZ",
    flag: "🇨🇿",
    name: "Czech Republic",
    dialCode: getCountryCallingCode("CZ"),
  },
  {
    code: "HU",
    flag: "🇭🇺",
    name: "Hungary",
    dialCode: getCountryCallingCode("HU"),
  },
  {
    code: "GR",
    flag: "🇬🇷",
    name: "Greece",
    dialCode: getCountryCallingCode("GR"),
  },
  {
    code: "PT",
    flag: "🇵🇹",
    name: "Portugal",
    dialCode: getCountryCallingCode("PT"),
  },
  {
    code: "AU",
    flag: "🇦🇺",
    name: "Australia",
    dialCode: getCountryCallingCode("AU"),
  },
  {
    code: "CA",
    flag: "🇨🇦",
    name: "Canada",
    dialCode: getCountryCallingCode("CA"),
  },
  {
    code: "JP",
    flag: "🇯🇵",
    name: "Japan",
    dialCode: getCountryCallingCode("JP"),
  },
  {
    code: "CN",
    flag: "🇨🇳",
    name: "China",
    dialCode: getCountryCallingCode("CN"),
  },
  {
    code: "IN",
    flag: "🇮🇳",
    name: "India",
    dialCode: getCountryCallingCode("IN"),
  },
  {
    code: "BR",
    flag: "🇧🇷",
    name: "Brazil",
    dialCode: getCountryCallingCode("BR"),
  },
  {
    code: "AR",
    flag: "🇦🇷",
    name: "Argentina",
    dialCode: getCountryCallingCode("AR"),
  },
  {
    code: "MX",
    flag: "🇲🇽",
    name: "Mexico",
    dialCode: getCountryCallingCode("MX"),
  },
];

const CustomPhoneInput: React.FC<CustomPhoneInputProps> = ({
  value,
  onChange,
  placeholder,
  className,
  defaultCountry = "IT",
}) => {
  const [selectedCountry, setSelectedCountry] =
    useState<Country>(defaultCountry);
  // const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // const [searchTerm, setSearchTerm] = useState("");
  const [phoneNumber, setPhoneNumber] = useState<Value>();
  // const dropdownRef = useRef<HTMLDivElement>(null);

  // // Get current country data
  // const currentCountry =
  //   COUNTRIES_DATA.find((c) => c.code === selectedCountry) || COUNTRIES_DATA[0];

  // // Filter countries based on search term
  // const filteredCountries = COUNTRIES_DATA.filter(
  //   (country) =>
  //     country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     country.dialCode.includes(searchTerm)
  // );

  // // Handle phone number input
  // const handlePhoneNumberChange = (inputValue: string) => {
  //   setPhoneNumber(inputValue);

  //   // Format with country code
  //   const fullNumber = `+${currentCountry.dialCode}${inputValue}`;
  //   onChange(fullNumber);
  // };

  // // Handle country selection
  // const handleCountrySelect = (country: (typeof COUNTRIES_DATA)[0]) => {
  //   setSelectedCountry(country.code);
  //   setIsDropdownOpen(false);
  //   setSearchTerm("");

  //   // Update the phone number with new country code
  //   if (phoneNumber) {
  //     const fullNumber = `+${country.dialCode}${phoneNumber}`;
  //     onChange(fullNumber);
  //   }
  // };

  // Parse existing value to extract country and number
  // useEffect(() => {
  //   if (value) {
  //     try {
  //       const parsed = parsePhoneNumber(value);
  //       if (parsed) {
  //         setSelectedCountry(parsed.country || defaultCountry);
  //         setPhoneNumber(parsed.nationalNumber);
  //       }
  //     } catch {
  //       // If parsing fails, just use the raw value
  //       if (value.startsWith("+")) {
  //         setPhoneNumber(
  //           value.substring(
  //             value.indexOf(currentCountry.dialCode) +
  //               currentCountry.dialCode.length
  //           )
  //         );
  //       } else {
  //         setPhoneNumber(value);
  //       }
  //     }
  //   }
  // }, [value, currentCountry.dialCode, defaultCountry]);

  // Close dropdown when clicking outside
  // useEffect(() => {
  //   const handleClickOutside = (event: globalThis.MouseEvent) => {
  //     const target = event.target as HTMLElement;
  //     if (dropdownRef.current && !dropdownRef.current.contains(target)) {
  //       setIsDropdownOpen(false);
  //       setSearchTerm("");
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, []);

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center w-full rounded-md border border-input bg-background">
        {/* Country Selector */}

        {/* Phone Number Input */}
        {/* <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => handlePhoneNumberChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 bg-transparent border-none outline-none text-sm"
        /> */}
        <PhoneInput
          // country={selectedCountry}
          defaultCountry="IT"
          flags={flags}
          placeholder="Enter phone number"
          value={phoneNumber}
          onChange={(v: Value) => setPhoneNumber(v)}
        />
      </div>
    </div>
  );
};

export default CustomPhoneInput;
