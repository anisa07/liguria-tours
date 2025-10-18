export const formatDate = (d: Date, locale: string) =>
  new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(d);

export const formatCurrency = (n: number, locale: string, currency = "EUR") =>
  new Intl.NumberFormat(locale, { style: "currency", currency }).format(n);
