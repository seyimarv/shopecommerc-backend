import { model } from "@medusajs/framework/utils";

export const Announcement = model.define("announcement", {
  id: model.id().primaryKey(),
  message: model.text(),
});
