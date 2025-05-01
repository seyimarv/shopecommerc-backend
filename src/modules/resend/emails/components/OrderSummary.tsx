import { Section, Heading, Row, Column, Text } from "@react-email/components"
import { OrderDTO } from "@medusajs/framework/types"
import { formatPrice } from "./utils" // Assuming utils.ts holds formatPrice

type OrderSummaryProps = {
  order: OrderDTO
}

export const OrderSummary = ({ order }: OrderSummaryProps) => {
  const currencyCode = order.currency_code

  return (
    <Section className="mt-8 px-6">
      <Heading className="text-xl font-semibold text-gray-800 mb-4">
        Order Summary
      </Heading>
      <Row className="text-gray-600">
        <Column className="w-1/2">
          <Text className="m-0">Subtotal</Text>
        </Column>
        <Column className="w-1/2 text-right">
          <Text className="m-0">
            {formatPrice(order.item_total, currencyCode)}
          </Text>
        </Column>
      </Row>
      {order.shipping_methods?.map((method) => (
        <Row className="text-gray-600" key={method.id}>
          <Column className="w-1/2">
            <Text className="m-0">{method.name}</Text>
          </Column>
          <Column className="w-1/2 text-right">
            <Text className="m-0">{formatPrice(method.total, currencyCode)}</Text>
          </Column>
        </Row>
      ))}
      <Row className="text-gray-600">
        <Column className="w-1/2">
          <Text className="m-0">Tax</Text>
        </Column>
        <Column className="w-1/2 text-right">
          <Text className="m-0">{formatPrice(order.tax_total || 0, currencyCode)}</Text>
        </Column>
      </Row>
      <Row className="border-t border-gray-200 mt-4 text-gray-800 font-bold">
        <Column className="w-1/2">
          <Text>Total</Text>
        </Column>
        <Column className="w-1/2 text-right">
          <Text>{formatPrice(order.total, currencyCode)}</Text>
        </Column>
      </Row>
      {/* Optional: Add Order Token here if needed per-email */}
      <Text className="text-center text-gray-500 text-sm mt-6">
        Order Token: {order.id}
      </Text>
    </Section>
  )
}
