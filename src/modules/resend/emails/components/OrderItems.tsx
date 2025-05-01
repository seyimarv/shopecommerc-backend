import { Container, Heading, Row, Column, Text, Section, Img } from "@react-email/components"
import { OrderDTO } from "@medusajs/framework/types"
import { formatPrice } from "./utils" // Assuming utils.ts holds formatPrice

type OrderItemsProps = {
  order: OrderDTO
  type?: "admin" | "customer"
}

export const OrderItems = ({ order, type = "customer" }: OrderItemsProps) => {
  const currencyCode = order.currency_code

  return (
    <Container className="px-6">
      <Heading className="text-xl font-semibold text-gray-800 mb-4">
        {type == "admin" ? "Items" : "Your Items"}
      </Heading>
      <Row>
        <Column>
          <Text className="text-sm m-0 my-2 text-gray-500">Order ID: #{order.display_id}</Text>
        </Column>
      </Row>
      {order.items?.map((item) => (
        <Section key={item.id} className="border-b border-gray-200 py-4">
          <Row>
            <Column className="w-1/3">
              <Img
                src={item.thumbnail ?? ''}
                alt={item.product_title ?? ''}
                className="rounded-lg"
                width="100%"
              />
            </Column>
            <Column className="w-2/3 pl-4">
              <Text className="text-lg font-semibold text-gray-800">
                {item.product_title}
              </Text>
              <Text className="text-gray-600">{item.variant_title}</Text>
              <Text className="text-gray-800 mt-2 font-bold">
                {formatPrice(item.total, currencyCode)}
              </Text>
            </Column>
          </Row>
        </Section>
      ))}
    </Container>
  )
}
