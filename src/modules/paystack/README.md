# Paystack Payment Provider for Medusa

This is a custom payment provider for Medusa that integrates with Paystack payment gateway.

## Prerequisites

- [Paystack account](https://dashboard.paystack.co/)
- [Paystack API key](https://dashboard.paystack.co/settings/developer)
- Medusa server

## Installation

1. Make sure you have the required dependencies in your project:

```bash
npm install axios axios-retry
# or
yarn add axios axios-retry
```

2. Configure the payment provider in your Medusa configuration file (`medusa-config.js` or `medusa-config.ts`):

```typescript
module.exports = defineConfig({
  projectConfig: {
    // ... other config
  },
  modules: [
    // other modules
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          // other payment providers
          {
            resolve: "/Users/macbook/my-plugin/providers/paystack",
            options: {
              api_key: process.env.PAYSTACK_SECRET_KEY,
              webhook_secret: process.env.PAYSTACK_WEBHOOK_SECRET,
            },
          },
        ],
      },
    },
  ],
});
```

3. Add the following environment variables to your `.env` file:

```
PAYSTACK_SECRET_KEY=sk_test_your_secret_key
PAYSTACK_WEBHOOK_SECRET=your_webhook_secret
```

## Setting up Webhooks

To ensure that Medusa is notified of successful payments, you need to set up webhooks in your Paystack dashboard:

1. Go to your [Paystack dashboard](https://dashboard.paystack.com/) and navigate to the "Settings > API Keys & Webhooks" section.
2. Set the Webhook URL to `<your-medusa-backend-url>/hooks/payment/paystack`. For example: `https://your-medusa-backend.com/hooks/payment/paystack`.
3. Copy the webhook secret and add it to your `.env` file as `PAYSTACK_WEBHOOK_SECRET`.

## Usage in Admin Dashboard

1. Log in to your Medusa Admin Dashboard.
2. Go to Settings > Regions.
3. Edit your region or create a new one.
4. In the Payment Providers section, add "Paystack" as a payment provider.
5. Save the region.

## Usage in Storefront

When implementing the payment flow in your storefront, you'll need to:

1. Initialize a payment session with Paystack
2. Redirect the customer to the Paystack checkout page
3. Handle the redirect back to your website
4. Verify the payment status

Here's a basic example using React:

```jsx
import { useCart } from "medusa-react"

const CheckoutPayment = () => {
  const { cart } = useCart()
  
  const handlePaystackPayment = () => {
    // Find the Paystack payment session
    const paystackSession = cart.payment_sessions.find(
      (session) => session.provider_id === "paystack"
    )
    
    if (paystackSession?.data?.authorization_url) {
      // Redirect to Paystack checkout page
      window.location.href = paystackSession.data.authorization_url
    }
  }
  
  return (
    <button onClick={handlePaystackPayment}>
      Pay with Paystack
    </button>
  )
}
```

## Features

- Payment authorization
- Payment capture
- Payment verification
- Refunds
- Webhook handling

## API Reference

The Paystack payment provider implements all the methods required by the Medusa payment provider interface:

- `initiatePayment`: Initializes a payment with Paystack
- `authorizePayment`: Verifies if a payment has been authorized
- `capturePayment`: Captures an authorized payment
- `refundPayment`: Refunds a payment
- `cancelPayment`: Cancels a payment
- `deletePayment`: Deletes a payment
- `retrievePayment`: Retrieves payment information
- `updatePayment`: Updates payment information
- `getPaymentStatus`: Gets the current status of a payment
