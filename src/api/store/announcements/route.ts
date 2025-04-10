import { z } from "zod";
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import {
  createAnnouncementWorkflow,
} from "../../../workflows/create-announcement";

import { PostAdminCreateAnnouncement } from "./validators";

type PostAdminCreateAnnouncementType = z.infer<
  typeof PostAdminCreateAnnouncement
>;

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve("query");

  const response = await query.graph({
    entity: "announcement",
    fields: ["id", "message"],
  });
  const { data: announcements, metadata: { count, take, skip } = {} } =
    response;

  res.json({
    announcements,
    count,
    limit: take,
    offset: skip,
  });
};

export const POST = async (
  req: MedusaRequest<PostAdminCreateAnnouncementType>,
  res: MedusaResponse
) => {
  const data = await createAnnouncementWorkflow(req.scope).run({
    input: req.body,
  });
  res.json({ announcement: data.result });
};

