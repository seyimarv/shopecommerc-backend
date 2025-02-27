import { z } from "zod";
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import {
  createAnnouncementWorkflow,
  deleteAnnouncementWorkFlow,
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
  console.log(response);
  const { data: announcements, metadata: { count, take, skip } = {} } =
    response;
  console.log("query", announcements);

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
  console.log("data", data.result);
  res.json({ announcement: data.result });
};

