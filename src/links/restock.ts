import { defineLink } from "@medusajs/framework/utils"
import RestockModule from "../modules/restock"
import ProductModule from "@medusajs/medusa/product"

export default defineLink(
    {
        ...RestockModule.linkable.restockEvent.id,
        field: "product_id",
    },
    ProductModule.linkable.product,
    {
        readOnly: true,
    }
)