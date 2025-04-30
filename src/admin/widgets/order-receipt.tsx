import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Button, Text } from "@medusajs/ui"
import { DetailWidgetProps } from "@medusajs/framework/types"
import { AdminOrder } from "@medusajs/framework/types"
import { useState } from "react"

const OrderReceiptWidget = ({ 
  data 
}: DetailWidgetProps<AdminOrder>) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [isNoteExpanded, setIsNoteExpanded] = useState<boolean>(false)
  
  const receiptFile = data.metadata?.receipt_file as { id: string, url: string } | undefined
  const orderNote = data.metadata?.note as string | undefined
  
  if (!receiptFile?.url && !orderNote) {
    return null
  }
  
  const viewReceipt = (): void => {
    if (receiptFile?.url) {
      window.open(receiptFile.url, "_blank")
    }
  }
  
  return (
    <Container className="divide-y p-0">
      {receiptFile?.url && (
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
      )}
      
      {orderNote && (
        <div className="px-6 py-4 border-t">
          <div className="flex items-center justify-between mb-2 cursor-pointer" onClick={() => setIsNoteExpanded(!isNoteExpanded)}>
            <Heading level="h2">Order Note</Heading>
            <Button
              variant="secondary"
              size="small"
              onClick={(e) => {
                e.stopPropagation()
                setIsNoteExpanded(!isNoteExpanded)
              }}
            >
              {isNoteExpanded ? 'Collapse' : 'Expand'}
            </Button>
          </div>
          {isNoteExpanded && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <Text className="text-ui-fg-subtle whitespace-pre-wrap">
                {orderNote}
              </Text>
            </div>
          )}
        </div>
      )}
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "order.details.before",
})

export default OrderReceiptWidget