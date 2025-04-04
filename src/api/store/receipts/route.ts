import type {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { uploadFilesWorkflow } from "@medusajs/medusa/core-flows"
import { MedusaError, Modules } from "@medusajs/framework/utils"

interface ReceiptUploadRequest {
  file: any
  cart_id?: string
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const mfiles = req.files as Express.Multer.File[]
  console.log(req.body)
  if (!mfiles?.length) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "No files were uploaded"
    )
  }

 

  const body = req.body as ReceiptUploadRequest

  const { result: files } = await uploadFilesWorkflow(req.scope)
    .run({
      input: {
        files: mfiles?.map((f) => ({
          filename: f.originalname,
          mimeType: f.mimetype,
          content: f.buffer.toString("binary"),
          access: "public",
        })),
      },  
    })

  const uploadedFile = files[0]

  const cartId = body.cart_id

  if (cartId) {
    const cartModuleService = req.scope.resolve(Modules.CART)

    await cartModuleService.updateCarts([{
      id: cartId,
      metadata: {
        receipt_file: {
          id: uploadedFile.id,
          url: uploadedFile.url,
        }
      }
    }])
  }

  res.status(200).json({
    message: "Receipt uploaded successfully",
    file: uploadedFile
  })
}

