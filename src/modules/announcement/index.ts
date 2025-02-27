import { Module } from "@medusajs/framework/utils"
import AnnouncementModuleService from "./service"

export const ANNOUNCEMENT_MODULE = "Announcement"

export default Module(ANNOUNCEMENT_MODULE, {
  service: AnnouncementModuleService,
})