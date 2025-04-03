import { AbstractPaymentProvider } from "@medusajs/framework/utils"
import { 
  Logger,
  AuthorizePaymentInput,
  AuthorizePaymentOutput,
  CapturePaymentInput,
  CapturePaymentOutput,
  CancelPaymentInput,
  CancelPaymentOutput,
  InitiatePaymentInput,
  InitiatePaymentOutput,
  DeletePaymentInput,
  DeletePaymentOutput,
  GetPaymentStatusInput,
  GetPaymentStatusOutput,
  RefundPaymentInput,
  RefundPaymentOutput,
  RetrievePaymentInput,
  RetrievePaymentOutput,
  UpdatePaymentInput,
  UpdatePaymentOutput,
  ProviderWebhookPayload,
  WebhookActionResult,
} from "@medusajs/framework/types";
import { MedusaError } from "@medusajs/utils";
import { BigNumber } from "@medusajs/framework/utils";
import Paystack from "./paystack-client";

type PaystackOptions = {
  secret_key: string;
  disable_retries?: boolean;
  debug?: boolean;
};


type InjectedDependencies = {
  logger: Logger;
};

class PaystackProviderService extends AbstractPaymentProvider<PaystackOptions> {
  static identifier = "paystack";
  
  protected logger_: Logger;
  protected options_: PaystackOptions;
  protected client: Paystack;

  constructor(container: InjectedDependencies, options: PaystackOptions) {
    super(container, options);

    this.logger_ = container.logger;
    this.options_ = options;

    // Initialize the Paystack client
    this.client = new Paystack(options.secret_key, {
      disable_retries: options.disable_retries
    });
    
    if (options.debug) {
      this.logger_.info("Paystack payment provider initialized in debug mode");
    }
  }

  static validateOptions(options: Record<string, unknown>): void {
    if (!options.secret_key) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "API key is required in the provider's options."
      );
    }
  }

  async initiatePayment(
    input: InitiatePaymentInput
  ): Promise<InitiatePaymentOutput> {
    const {
      amount,
      currency_code,
      context,
      data
    } = input;

    const email = (data as Record<string, any>)?.email || "customer@example.com";
    
    const paystackAmount = Number(amount) * 100;

    try {
      const response = await this.client.transaction.initialize({
        amount: paystackAmount,
        email,
        currency: currency_code.toUpperCase(),
        metadata: {
          session_id: "session_" + Date.now(),
          ...context
        }
      });

      return {
        id: response.data.reference,
        data: {
          authorization_url: response.data.authorization_url,
          access_code: response.data.access_code,
          reference: response.data.reference,
        },
      };
    } catch (error) {
      this.logger_.error(`Error initializing Paystack payment: ${error.message}`);
      throw error;
    }
  }

  async authorizePayment(
    input: AuthorizePaymentInput
  ): Promise<AuthorizePaymentOutput> {
    const reference = input.data?.reference;

    if (!reference) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Reference is required to authorize payment"
      );
    }

    try {
      // Verify the transaction status
      const response = await this.client.transaction.verify({ reference: reference as string });
      
      // Check if the payment is successful
      if (response.data.status === "success") {
        return {
          data: response.data,
          status: "authorized"
        };
      }
      
      return {
        data: response.data,
        status: "pending"
      };
    } catch (error) {
      this.logger_.error(`Error authorizing Paystack payment: ${error.message}`);
      throw error;
    }
  }

  async capturePayment(
    input: CapturePaymentInput
  ): Promise<CapturePaymentOutput> {
    // Paystack automatically captures payments upon authorization
    // So we just need to verify the payment status
    const reference = input.data?.reference;

    if (!reference) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Reference is required to capture payment"
      );
    }

    try {
      const response = await this.client.transaction.verify({ reference: reference as string });
      
      return {
        data: response.data
      };
    } catch (error) {
      this.logger_.error(`Error capturing Paystack payment: ${error.message}`);
      throw error;
    }
  }

  async cancelPayment(
    input: CancelPaymentInput
  ): Promise<CancelPaymentOutput> {
    // Paystack doesn't have a direct cancel endpoint for authorized payments
    // We can just return the current data as cancellation isn't applicable
    return { data: input.data };
  }

  async getPaymentStatus(
    input: GetPaymentStatusInput
  ): Promise<GetPaymentStatusOutput> {
    const reference = input.data?.reference;

    if (!reference) {
      return { status: "pending" };
    }

    try {
      const response = await this.client.transaction.verify({ reference: reference as string });
      
      switch (response.data.status) {
        case "success":
          return { status: "captured" };
        case "abandoned":
        case "failed":
          return { status: "canceled" };
        default:
          return { status: "pending" };
      }
    } catch (error) {
      this.logger_.error(`Error getting Paystack payment status: ${error.message}`);
      return { status: "error", data: { error: error.message } };
    }
  }

  async refundPayment(
    input: RefundPaymentInput
  ): Promise<RefundPaymentOutput> {
    const reference = input.data?.reference;
    const transactionId = input.data?.id;

    if (!transactionId) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Transaction ID is required to refund payment"
      );
    }

    try {
      const refundResponse = await this.client.refund.create({
        transaction: Number(transactionId),
        amount: Number(input.amount)
      });
      
      return {
        data: {
          ...input.data,
          refund: refundResponse.data
        }
      };
    } catch (error) {
      this.logger_.error(`Error refunding Paystack payment: ${error.message}`);
      throw error;
    }
  }

  async retrievePayment(
    input: RetrievePaymentInput
  ): Promise<RetrievePaymentOutput> {
    const reference = input.data?.reference;

    if (!reference) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Reference is required to retrieve payment"
      );
    }

    try {
      const response = await this.client.transaction.verify({ reference: reference as string });
      return {
        data: response.data
      };
    } catch (error) {
      this.logger_.error(`Error retrieving Paystack payment: ${error.message}`);
      throw error;
    }
  }

  async updatePayment(
    input: UpdatePaymentInput
  ): Promise<UpdatePaymentOutput> {
    // Paystack doesn't support updating a payment after initialization
    // We'll just return the current data or an empty object if data is undefined
    return input.data || {};
  }

  async deletePayment(
    input: DeletePaymentInput
  ): Promise<DeletePaymentOutput> {
    // No specific action needed for Paystack
    return {};
  }

  async getWebhookActionAndData(
    payload: ProviderWebhookPayload["payload"]
  ): Promise<WebhookActionResult> {
    const { data, rawData, headers } = payload;
    
    try {
      // Verify webhook signature if secret_key is provided
      if (this.options_.secret_key) {
        // Verify the signature using crypto
        const crypto = require('crypto');
        const hash = crypto
          .createHmac("sha512", this.options_.secret_key)
          .update(rawData)
          .digest("hex");
          
        if (hash !== headers["x-paystack-signature"]) {
          this.logger_.warn("Paystack webhook signature verification failed");
          return {
            action: "not_supported" as any
          };
        }
      }
      
      // Handle different event types
      const event = data.event;
      
      switch(event) {
        case "charge.success":
          // Define a type for Paystack webhook data
          type PaystackWebhookData = {
            amount?: number;
            metadata?: {
              session_id?: string;
              [key: string]: unknown;
            };
            [key: string]: unknown;
          };

          const chargeData = data.data as PaystackWebhookData;
          const sessionId = chargeData?.metadata?.session_id;
          
          if (!sessionId) {
            this.logger_.warn("No session_id found in Paystack webhook metadata");
            return {
              action: "not_supported" as any
            };
          }
          
          return {
            action: "authorized" as any,
            data: {
              session_id: sessionId,
              amount: new BigNumber(((chargeData.amount || 0) / 100)) // Convert from kobo to base currency
            }
          };
        case "transfer.success":
          const refundData = data.data as PaystackWebhookData;
          const refundSessionId = refundData?.metadata?.session_id;
          
          if (!refundSessionId) {
            this.logger_.warn("No session_id found in Paystack webhook metadata for refund");
            return {
              action: "not_supported" as any
            };
          }
          
          return {
            action: "refund" as any,
            data: {
              session_id: refundSessionId,
              amount: new BigNumber(((refundData.amount || 0) / 100)) // Convert from kobo to base currency
            }
          };
        default:
          return {
            action: "not_supported" as any
          };
      }
    } catch (e) {
      this.logger_.error(`Error processing Paystack webhook: ${e.message}`);
      return {
        action: "error" as any,
        data: {
          session_id: "",
          amount: new BigNumber(0)
        }
      };
    }
  }
}

export default PaystackProviderService;
