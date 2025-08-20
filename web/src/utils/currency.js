// Currency formatter for global support
export function formatCurrency(amount, currency = "USD", rate = 1) {
  const localAmount = amount * rate;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: currency === "JPY" || currency === "KRW" ? 0 : 2,
    maximumFractionDigits: currency === "JPY" || currency === "KRW" ? 0 : 2,
  }).format(localAmount);
}
