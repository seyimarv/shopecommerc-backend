import {
  defineMiddlewares,
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework/http";
import { PostAdminCreateAnnouncement } from "./store/announcements/validators";
import { createFindParams } from "@medusajs/medusa/api/utils/validators";
import { z } from "zod";

export const GetAnnouncementsSchema = createFindParams();

console.log("here")

export default defineMiddlewares({
  routes: [
    {
      matcher: "/store/announcements",
      method: "POST",
      middlewares: [validateAndTransformBody(PostAdminCreateAnnouncement)],
    },
    {
      method:  ["POST"],
      matcher: "/admin/collections/:id",
      additionalDataValidator: {
        cover_image: z.string().optional(),
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
