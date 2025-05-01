import { BigNumberValue } from "@medusajs/framework/types"

export const formatPrice = (price: BigNumberValue, currencyCode: string) => {
  const formatter = new Intl.NumberFormat([], {
    style: "currency",
    currencyDisplay: "narrowSymbol",
    currency: currencyCode,
  })

  if (typeof price === "number") {
    return formatter.format(price)
  }

  if (typeof price === "string") {
    return formatter.format(parseFloat(price))
  }

  // Attempt to handle BigNumber objects if necessary
  if (typeof price === 'object' && price !== null && 'toString' in price) {
    try {
      return formatter.format(parseFloat(price.toString()))
    } catch (e) {
      // Fallback if conversion fails
    }
  }

  return ""
}
