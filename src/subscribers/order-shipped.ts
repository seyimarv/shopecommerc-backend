import type {
    SubscriberArgs,
    SubscriberConfig,
} from "@medusajs/framework"
import { sendShippingConfirmationWorkflow } from "../workflows/send-shipping-confirmation"

export default async function orderShippedHandler({
    event: { data },
    container,
}: SubscriberArgs<{ id: string }>) {
    const orderId = data.id

    await sendShippingConfirmationWorkflow(container)
        .run({
            input: {
                id: orderId,
            },
        })
}

export const config: SubscriberConfig = {
    event: "order.fulfillment_created",
}