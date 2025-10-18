export type Dict = Record<string, string>;

// Define the translation function type with cleaner signature
export type TranslationFunction = (
  key: string,
  fallback: string,
  vars?: Record<string, string | number>
) => string;

// Define the createT function type
export type CreateTFunction = (dicts: Dict[]) => TranslationFunction;

function get(obj: Dict, key: string, fallback?: string) {
  // Handle nested keys like "site.title"
  const keys = key.split(".");
  let current: any = obj;

  for (const k of keys) {
    if (current && typeof current === "object" && k in current) {
      current = current[k];
    } else {
      current = undefined;
      break;
    }
  }

  // Return the translation if it exists
  if (current && typeof current === "string") {
    return current;
  }

  // Return provided fallback if given
  if (fallback !== undefined) {
    return fallback;
  }

  // Default fallback: return the key itself, but make it more readable
  // Convert "nav.home" to "Home", "user.profile.settings" to "Settings"
  const lastPart = keys[keys.length - 1];
  return lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
}

export function createT(dicts: Dict[]): TranslationFunction {
  const dict = Object.assign({}, ...dicts); // merge namespaces

  return (
    key: string,
    fallback: string,
    vars?: Record<string, string | number>
  ) => {
    let str = get(dict, key, fallback);

    if (!vars) return str;
    // Replace variables in the string
    for (const [k, v] of Object.entries(vars)) {
      str = str.replaceAll(new RegExp(`{${k}}`, "g"), String(v));
    }

    return str;
  };
}

// Alternative ways to get the type of createT:

// 1. Using typeof operator
export type CreateTType = typeof createT;

// 2. Using ReturnType to get the returned translation function type
export type TFunctionType = ReturnType<typeof createT>;

// 3. Using Parameters to get the parameter types
export type CreateTParameters = Parameters<typeof createT>;

// Example usage of these types:
/*
// Use the function type directly
const myCreateT: CreateTFunction = createT;

// Use typeof
const anotherCreateT: CreateTType = createT;

// Use the returned function type
const myTranslationFn: TFunctionType = createT('en', []);
const myTranslationFn2: TranslationFunction = createT('en', []);

// Use parameter types
const params: CreateTParameters = ['en', [{ hello: 'Hello' }]];
*/
