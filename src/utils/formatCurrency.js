export default function formatCurrency(price = 0) {
  Number(price);

  return price.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });
}
