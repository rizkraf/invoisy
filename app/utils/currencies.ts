export type CurrencyOption = { label: string; value: string };

export const currencies: CurrencyOption[] = [
  { label: "USD - Dolar Amerika Serikat", value: "USD" },
  { label: "EUR - Euro", value: "EUR" },
  { label: "IDR - Rupiah Indonesia", value: "IDR" },
  { label: "JPY - Yen Jepang", value: "JPY" },
  { label: "GBP - Pound Sterling Inggris", value: "GBP" },
  { label: "AUD - Dolar Australia", value: "AUD" },
  { label: "CAD - Dolar Kanada", value: "CAD" },
  { label: "CHF - Franc Swiss", value: "CHF" },
  { label: "CNY - Yuan Tiongkok", value: "CNY" },
  { label: "INR - Rupee India", value: "INR" },
];

export const currencyToLocale: Record<string, string> = {
  USD: "en-US",
  EUR: "de-DE",
  IDR: "id-ID",
  JPY: "ja-JP",
  GBP: "en-GB",
  AUD: "en-AU",
  CAD: "en-CA",
  CHF: "de-CH",
  CNY: "zh-CN",
  INR: "en-IN",
};
