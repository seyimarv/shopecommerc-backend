import { model } from "@medusajs/framework/utils"

const RestockEvent = model.define("restock_event", {
  id: model.id().primaryKey(),
  product_id: model.text(),
  sales_channel_id: model.text(),
  // restocked_at: model.dateTime().default(new Date()),
  // restocked_quantity: model.number(),
  // notified_subscribers: model.boolean().default(false),
  // is_product_restock: model.boolean().default(false),
})
.indexes([
  {
    on: ["product_id", "sales_channel_id"],
    unique: true,
  },
])

export default RestockEvent
