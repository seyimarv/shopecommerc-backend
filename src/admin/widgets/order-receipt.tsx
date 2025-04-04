import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Button } from "@medusajs/ui"
import { DetailWidgetProps } from "@medusajs/framework/types"
import { AdminOrder } from "@medusajs/framework/types"
import { useState } from "react"

const OrderReceiptWidget = ({ 
  data 
}: DetailWidgetProps<AdminOrder>) => {
  const [loading, setLoading] = useState<boolean>(false)
  
  const receiptFile = data.metadata?.receipt_file as { id: string, url: string } | undefined
  
  if (!receiptFile?.url) {
    return null
  }
  
  const viewReceipt = (): void => {
    window.open(receiptFile.url, "_blank")
  }
  
  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Order Receipt</Heading>
        <Button 
          variant="primary" 
          onClick={viewReceipt}
          isLoading={loading}
        >
          View Receipt
        </Button>
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "order.details.before",
})

export default OrderReceiptWidget