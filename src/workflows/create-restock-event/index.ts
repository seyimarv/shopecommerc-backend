import { createWorkflow, transform, when, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { validateProductOutOfStockStep } from "./steps/validate-product-out-stock"
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"
import { createRestockEventStep } from "./steps/create-product-out-of-stock"
import { RESTOCK_MODULE } from "../../modules/restock"
import RestockModuleService from "../../modules/restock/service"

type CreateRestockEventWorkflowInput = {
    product_id: string
    sales_channel_id: string
}

export const createRestockEventWorkflow = createWorkflow(
    "create-restock-event",
    ({
        product_id,
        sales_channel_id,
    }: CreateRestockEventWorkflowInput) => {
      console.log("here")
        // TODO add more steps
        validateProductOutOfStockStep({
            product_id,
            sales_channel_id,
        })

        // @ts-ignore
        const { data: restockEvents } = useQueryGraphStep({
            entity: "restock_event",
            fields: ["*"],
            filters: {
                product_id,
                sales_channel_id,
            },
        }).config({ name: "retrieve-restock-events" })

        when({ restockEvents }, ({ restockEvents }) => {
            return restockEvents.length === 0
        })
            .then(() => {
                createRestockEventStep({
                    product_id,
                    sales_channel_id,
                })
            })

        // @ts-ignore
        const { data: restockEvent } = useQueryGraphStep({
            entity: "restock_event",
            fields: ["*"],
            filters: {
                product_id,
                sales_channel_id,
            },
        }).config({ name: "retrieve-restock-event" })

        return new WorkflowResponse(
            restockEvent
        )
    }
)

export const deleteRestockEventWorkflow = async (id: string, { container }) => {
    const restockModuleService: RestockModuleService = container.resolve(
        RESTOCK_MODULE
    )

    await restockModuleService.deleteRestockEvents(id)
}