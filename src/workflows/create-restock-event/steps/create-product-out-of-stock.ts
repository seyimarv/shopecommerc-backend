import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import RestockModuleService from "../../../modules/restock/service"
import { RESTOCK_MODULE } from "../../../modules/restock"

type CreateRestockEventStepInput = {
  product_id: string
  sales_channel_id: string
}

export const createRestockEventStep = createStep(
  "create-restock-event",
  async (input: CreateRestockEventStepInput, { container }) => {
    const restockModuleService: RestockModuleService = container.resolve(
      RESTOCK_MODULE
    )

    const restockEvent = await restockModuleService.createRestockEvents(
      input
    )

    return new StepResponse(restockEvent, restockEvent)
  },
  async (restockEvent, { container }) => {
    if (!restockEvent) {
      return
    }
    const restockModuleService: RestockModuleService = container.resolve(
      RESTOCK_MODULE
    )

    await restockModuleService.deleteRestockEvents(restockEvent.id)
  }
)