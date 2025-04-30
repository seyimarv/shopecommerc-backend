import type {
    SubscriberArgs,
    SubscriberConfig,
} from "@medusajs/framework"
import { updateOrderWorkflow } from "@medusajs/medusa/core-flows"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { sendOrderConfirmationWorkflow } from "../workflows/send-order-confirmation"

export default async function orderPlacedHandler({
    event: { data },
    container,
}: SubscriberArgs<{ id: string }>) {
    const orderId = data.id
    const query = container.resolve(ContainerRegistrationKeys.QUERY)

    const { data: orders } = await query.graph({
        entity: "order",
        fields: ["customer_id", "cart.*"],
        filters: { id: orderId },
    })

    if (orders.length === 0) return

    const order = orders[0]

    const cart = order.cart


    if (cart?.metadata?.receipt_file) {
        await updateOrderWorkflow(container).run({
            input: {
                id: orderId,
                user_id: order.customer_id || "",
                metadata: {
                    receipt_file: cart?.metadata?.receipt_file,
                    note: cart?.metadata?.note
                }
            }
        })
    }
    await sendOrderConfirmationWorkflow(container)
        .run({
            input: {
                id: orderId,
            },
        })
}

export const config: SubscriberConfig = {
    event: "order.placed",
}