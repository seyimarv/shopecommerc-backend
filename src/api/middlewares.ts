import {
  defineMiddlewares,
  validateAndTransformBody,
  validateAndTransformQuery
} from "@medusajs/framework/http";
import { createFindParams } from "@medusajs/medusa/api/utils/validators";
import { z } from "zod";

export const GetAnnouncementsSchema = createFindParams();

export default defineMiddlewares({
  routes: [
    {
      method: ["POST"],
      matcher: "/store/carts/:cart_id/payment-sessions",
      payload: {
        json: {
          limit: "10mb"
        }
      }
    },
  ],
});
