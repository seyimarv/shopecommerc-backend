import {
  defineMiddlewares,
  validateAndTransformBody,
} from "@medusajs/framework/http";
import { PostAdminCreateAnnouncement } from "./store/announcements/validators";
import { createFindParams } from "@medusajs/medusa/api/utils/validators";
import { z } from "zod";
import multer from "multer"

export const GetAnnouncementsSchema = createFindParams();


const upload = multer({ storage: multer.memoryStorage() })

export default defineMiddlewares({
  routes: [
    {
      matcher: "/store/announcements",
      method: "POST",
      middlewares: [validateAndTransformBody(PostAdminCreateAnnouncement)],
    },
    {
      method: ["POST"],
      matcher: "/admin/collections/:id",
      additionalDataValidator: {
        cover_image: z.string().optional(),
      },
    },
    {
      method: ["GET"],
      matcher: "/store/restocked-products",
    },
    {
      matcher: "/store/receipts", // Adjust this path to match your actual receipts API route
      method: ["POST", "PUT"], // Include any HTTP methods that need the increased limit
      middlewares: [
        // @ts-ignore
        upload.array("files"),
      ],
      bodyParser: { 
        sizeLimit: "2mb"
      },
    },


    // {
    //   matcher: "/admin/announcements",
    //   method: "GET",
    //   middlewares: [
    //     validateAndTransformQuery(GetAnnouncementsSchema, {
    //       defaults: ["id", "message"],
    //       isList: true,
    //     }),
    //   ],
    // },
  ],
});
