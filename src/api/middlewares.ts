import {
  defineMiddlewares,
  validateAndTransformBody,
  validateAndTransformQuery
} from "@medusajs/framework/http";
import { createFindParams } from "@medusajs/medusa/api/utils/validators";
import { z } from "zod";
import multer from "multer"

export const GetAnnouncementsSchema = createFindParams();

const upload = multer({ storage: multer.memoryStorage() })

export default defineMiddlewares({
  routes: [
    {
      matcher: "/store/receipts", 
      method: ["POST", "PUT"], 
      middlewares: [
        // @ts-ignore
        upload.array("files"),
      ],
      payload: {
        json: { 
          limit: "10mb", 
        },
        urlencoded: {
          limit: "10mb", 
        },
        sizeLimit: "2mb"
      },
    },
  ],
});
