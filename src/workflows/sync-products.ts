// import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
// import { useQueryGraphStep } from "@medusajs/medusa/core-flows"
// import { syncProductsStep, SyncProductsStepInput } from "./steps/sync-products"
// import { QueryContext } from "@medusajs/framework/utils"

// type SyncProductsWorkflowInput = {
//   filters?: Record<string, unknown>
//   limit?: number
//   offset?: number
//   currency_code?: string
//   region_id?: string
// }

// export const syncProductsWorkflow = createWorkflow(
//   "sync-products",
//   ({ filters, limit, offset, currency_code = "usd", region_id }: SyncProductsWorkflowInput) => {
//     // @ts-ignore
//     const { data, metadata } = useQueryGraphStep({
//       entity: "product",
//       fields: [
//         "id", "title", 
//         "description", 
//         "handle", 
//         "thumbnail", 
//         "categories.*", 
//         "tags.*",
//         "variants.id",
//         "variants.title",
//         "variants.calculated_price.*"  // Include calculated prices
//       ],
//       pagination: {
//         take: limit,
//         skip: offset
//       },
//       filters: {
//         // @ts-ignore
//         status: "published",
//         ...filters
//       },
//       context: {
//         variants: {
//           calculated_price: QueryContext({
//             currency_code,
//             region_id,
//           }),
//         },
//       },
//     })

//     syncProductsStep({
//       products: data
//     } as SyncProductsStepInput)

//     return new WorkflowResponse({
//       products: data,
//       metadata
//     })
//   }
// )