import { MedusaService } from "@medusajs/framework/utils"
import RestockEvent from "./models/restock-event"

class RestockModuleService extends MedusaService({
  RestockEvent,
}) { }

export default RestockModuleService