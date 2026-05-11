const NGN_PER_GBP = 2000;
const GBP_TO_USD = 1.27;

export const nairaToPounds = (naira: number) => naira / NGN_PER_GBP;
export const nairaToDollars = (naira: number) => nairaToPounds(naira) * GBP_TO_USD;

export const formatPounds = (naira: number) =>
  new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 2 }).format(nairaToPounds(naira));

export const formatDollarEquivalent = (naira: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(nairaToDollars(naira));

export const formatPriceWithDollarEquivalent = (naira: number) => `${formatPounds(naira)} (${formatDollarEquivalent(naira)})`;
