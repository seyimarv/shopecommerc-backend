import {
    MedusaContainer
} from "@medusajs/framework/types";
import { getVariantAvailability } from "@medusajs/framework/utils";
import { deleteRestockEventWorkflow } from "../workflows/create-restock-event";


export default async function updateRestockedProductsJob(container: MedusaContainer) {
    const productService = container.resolve("product")
    const restockModuleService: any = container.resolve("restock")

    const [restockEvents] = await restockModuleService.listAndCountRestockEvents();
    if (!restockEvents.length) {
        return;
    }
    const productsIds = restockEvents.map(restockEvent => restockEvent.product_id)
    const [products] = await productService.listAndCountProducts(
        { id: productsIds },
    );

    for (const product of products) {
        const productId = product.id
        const restockEvent = restockEvents.find(restockEvent => restockEvent.product_id === productId)
        if (!restockEvent) {
            return;
        }

        const query = container.resolve("query")
        const [variants] = await productService.listAndCountProductVariants(
            { product_id: productId },
            { select: ["id", "manage_inventory"] }
        )
        console.log("variants", variants)
        if (!variants.length) {
            console.log("no variants found for product", productId)
            return;
        }
        const variant_ids = variants.filter(variant => variant.manage_inventory).map(variant => variant.id) as string[];
        if (!variant_ids.length) {
            await deleteRestockEventWorkflow(restockEvent.id, { container })
            console.log("deleted from restock", "restocked")
            await productService.updateProducts(productId, {
                metadata: {
                    isRestocked: false
                }
            })
            return;
        }

        const availability = await getVariantAvailability(query, {
            variant_ids,
            sales_channel_id: restockEvent.sales_channel_id,
        })
        const anyVariantInStock = Object.values(availability).some(
            variantAvailability => variantAvailability.availability > 0
        )

        if (anyVariantInStock) {
            await deleteRestockEventWorkflow(restockEvent.id, { container })
            await productService.updateProducts(productId, {
                metadata: {
                    isRestocked: true
                }
            })
        }
    }
}

export const config = {
    name: "daily-product-report",
    schedule: "0 0 * * *", // Every minute
};