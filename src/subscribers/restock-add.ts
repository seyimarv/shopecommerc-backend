import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { createRestockEventWorkflow, deleteRestockEventWorkflow } from "../workflows/create-restock-event"

export default async function handleOrderPlaced({
    event: { data },
    container,
}: SubscriberArgs<{ id: string }>) {
    console.log("Order placed:", data.id)

    // Resolve the product module service to get product information
    const query = container.resolve("query")
    const productModuleService = container.resolve("product")

    // Get order details
    const { data: orders } = await query.graph({
        entity: "order",
        fields: [
            "id",
            "items.variant.product_id",
            "items.variant.inventory_item_id",
            "sales_channel_id",
        ],
        filters: {
            id: data.id,
        }
    })

    if (orders && orders.length > 0) {
        const order = orders[0]

        // Process each item in the order
        console.log(order)
        console.log(order?.sales_channel_id)
        for (const item of order?.items || []) {
            const productId = item?.variant?.product_id || ""
            console.log(productId)
            if (productId) {
                // Your restock event logic here
                const { result } = await createRestockEventWorkflow(container)
                    .run({
                        input: {
                            product_id: productId,
                            sales_channel_id: order?.sales_channel_id || "",
                        },
                    })
                console.log(result)
                if (result) {
                    await productModuleService.updateProducts(
                        productId,
                        {
                            metadata: {
                                isRestocked: false
                            }
                        }
                    )
                    console.log("out of stock")
                }
                // } else {
                //     await deleteRestockEventWorkflow(productId, order.sales_channel_id, { container })
                //     await productModuleService.updateProducts(
                //         productId,
                //         {
                //             metadata: {
                //                 isRestocked: true
                //             }
                //         }
                //     )
                //     console.log(result, "restocked")
                // }
            }
        }
    }
}

export const config: SubscriberConfig = {
    event: "order.placed",
}