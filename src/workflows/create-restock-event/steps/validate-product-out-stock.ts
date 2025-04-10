import { getVariantAvailability, MedusaError } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

type ValidateProductOutOfStockStepInput = {
    product_id: string
    sales_channel_id: string
}

export const validateProductOutOfStockStep = createStep(
    "validate-product-out-of-stock",
    async ({ product_id, sales_channel_id }: ValidateProductOutOfStockStepInput, { container }) => {
        const productModuleService = container.resolve("product")
        const query = container.resolve("query")

        // Get all variants of the product
        const [variants] = await productModuleService.listAndCountProductVariants(
            { product_id, },
            { select: ["id", "manage_inventory"] }
        )
        console.log(variants)
        if (!variants.length) {
            throw new MedusaError(
                MedusaError.Types.NOT_FOUND,
                "No variants found for the product."
            )
        }
        const variant_ids = variants.filter(variant => variant.manage_inventory).map(variant => variant.id) as string[];
        if (!variant_ids.length) {
            throw new MedusaError(
                MedusaError.Types.INVALID_DATA,
                "No variants with manage inventory found for the product."
            )
        }

        const availability = await getVariantAvailability(query, {
            variant_ids,
            sales_channel_id,
        })
        const anyVariantInStock = Object.values(availability).some(
            variantAvailability => variantAvailability.availability > 0
        )

        console.log(anyVariantInStock)

        if (anyVariantInStock) {
            throw new MedusaError(
                MedusaError.Types.INVALID_DATA,
                "Product isn't out of stock. At least one variant has inventory."
            )
        }

    }
)