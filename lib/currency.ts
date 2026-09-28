/** Formats an integer amount in GBP pence for display. */
export const formatPounds = (pence: number) =>
  new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(pence / 100);
