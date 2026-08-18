export const DEFAULT_CURRENCY = 'INR';

export const SUPPORTED_CURRENCIES = [
  { code: 'USD', shortLabel: 'USD ($)', fullLabel: 'USD ($ - US Dollar)' },
  { code: 'EUR', shortLabel: 'EUR (€)', fullLabel: 'EUR (€ - Euro)' },
  { code: 'GBP', shortLabel: 'GBP (£)', fullLabel: 'GBP (£ - British Pound)' },
  { code: 'CAD', shortLabel: 'CAD ($)', fullLabel: 'CAD ($ - Canadian Dollar)' },
  { code: 'JPY', shortLabel: 'JPY (¥)', fullLabel: 'JPY (¥ - Japanese Yen)' },
  { code: 'INR', shortLabel: 'INR (₹)', fullLabel: 'INR (₹ - Indian Rupee)' },
] as const;

export const getCurrencyOption = (currencyCode: string) =>
  SUPPORTED_CURRENCIES.find((currency) => currency.code === currencyCode) ?? SUPPORTED_CURRENCIES[SUPPORTED_CURRENCIES.length - 1];

export const formatCurrency = (
  amount: number | string,
  currencyCode: string = DEFAULT_CURRENCY,
  options: Intl.NumberFormatOptions = {},
) => {
  const normalizedCurrency = (currencyCode || DEFAULT_CURRENCY).toUpperCase();
  const locale = normalizedCurrency === 'INR' ? 'en-IN' : 'en-US';
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: normalizedCurrency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  });

  return formatter.format(Number(amount) || 0);
};
