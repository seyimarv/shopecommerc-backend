import {
  defineMiddlewares,
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework/http";
import { PostAdminCreateAnnouncement } from "./store/announcements/validators";
import { createFindParams } from "@medusajs/medusa/api/utils/validators";

export const GetAnnouncementsSchema = createFindParams();

export default defineMiddlewares({
  routes: [
    {
      matcher: "/store/announcements",
      method: "POST",
      middlewares: [validateAndTransformBody(PostAdminCreateAnnouncement)],
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
