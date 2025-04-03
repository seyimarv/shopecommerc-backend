import type {
    SubscriberArgs,
    SubscriberConfig,
  } from "@medusajs/framework"
  import { updateOrderWorkflow } from "@medusajs/medusa/core-flows"
  
  export default async function orderPlacedHandler({
    event: { data },
    container,
  }: SubscriberArgs<{ id: string }>) {
    // Get the order ID from the event data
    const orderId = data.id
    
    // Resolve the query service to fetch cart data
    const query = container.resolve("queryService") as any
    
    // Fetch the order to get the cart_id
    const { data: orders } = await query.graph({
      entity: "order",
      fields: ["cart_id", "customer_id"],
      filters: { id: orderId },
    })
    
    if (orders.length === 0) return
    
    const order = orders[0]
    
    // Fetch the cart to get receipt metadata
    const { data: carts } = await query.graph({
      entity: "cart",
      fields: ["metadata"],
      filters: { id: order.cart_id },
    })
    
    if (carts.length === 0) return
    
    const cart = carts[0]
    
    // Check if cart has receipt metadata
    if (cart.metadata?.receipt_file) {
      // Update the order with receipt metadata
      await updateOrderWorkflow(container).run({
        input: {
          id: orderId,
          user_id: order.customer_id || null,
          metadata: {
            receipt_file: cart.metadata.receipt_file
          }
        }
      })
    }
  }
  
  export const config: SubscriberConfig = {
    event: "order.placed",
  }