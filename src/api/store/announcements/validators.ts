import { z } from "zod";

export const PostAdminCreateAnnouncement = z.object({
  message: z.string(),
});

