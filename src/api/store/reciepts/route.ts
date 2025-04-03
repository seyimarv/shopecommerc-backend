import type {
    MedusaRequest,
    MedusaResponse,
  } from "@medusajs/framework/http"
  import { uploadFilesWorkflow } from "@medusajs/medusa/core-flows"
  import { Modules } from "@medusajs/framework/utils"
  
  // Define the expected request body structure
  interface ReceiptUploadRequest {
    file: any
    cart_id?: string
  }
  
  export async function POST(
    req: MedusaRequest,
    res: MedusaResponse
  ) {
    // Type assertion for the request body
    const body = req.body as ReceiptUploadRequest
    
    if (!body.file) {
      return res.status(400).json({ 
        message: "Receipt file is required" 
      })
    }
    
    // Upload the file
    const { result: files } = await uploadFilesWorkflow(req.scope)
      .run({
        input: {
          files: [body.file] // Wrap single file in array for the workflow
        }
      })
    
    // Get the single file from the result
    const file = files[0]
    
    // Get cart ID from request
    const cartId = body.cart_id
    
    if (cartId) {
      // Resolve the cart module service
      const cartModuleService = req.scope.resolve(Modules.CART)
      
      // Update cart metadata with receipt file information
      await cartModuleService.updateCarts([{
        id: cartId,
        metadata: {
          receipt_file: {
            id: file.id,
            url: file.url,
          }
        }
      }])
    }
  
    res.status(200).json({ 
      message: "Receipt uploaded successfully", 
      file 
    })
  }