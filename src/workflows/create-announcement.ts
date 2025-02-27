import {
  createStep,
  StepResponse,
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { ANNOUNCEMENT_MODULE } from "../modules/announcement";
import AnnouncementModuleService from "../modules/announcement/service";

export type CreateAnnouncementStepInput = {
  message: string;
};

export const createAnnouncementStep = createStep(
  "create-announcement-step",
  async (input: CreateAnnouncementStepInput, { container }) => {
    const announcementModuleService: AnnouncementModuleService =
      container.resolve(ANNOUNCEMENT_MODULE);

    const announcement = await announcementModuleService.createAnnouncements(
      input
    );
    console.log(announcement);
    const response = new StepResponse(announcement, announcement.id);
    console.log("step response", response);
    return response;
  },
  async (id: string, { container }) => {
    const announcementModuleService: AnnouncementModuleService =
      container.resolve(ANNOUNCEMENT_MODULE);

    await announcementModuleService.deleteAnnouncements(id);
  }
);

export type CreateAnnouncementWorkflowInput = {
  message: string;
};

export const createAnnouncementWorkflow = createWorkflow(
  "create-announcement",
  (input: CreateAnnouncementWorkflowInput) => {
    const announcement = createAnnouncementStep(input);
    console.log(announcement);

    const WorkflowRespone = new WorkflowResponse(announcement);
    console.log("wokrcjc", WorkflowRespone);
    return WorkflowRespone;
  }
);

export const deleteAnnouncementWorkFlow = async (id: string, { container }) => {
  console.log("here")
  const announcementModuleService: AnnouncementModuleService =
    container.resolve(ANNOUNCEMENT_MODULE);

  await announcementModuleService.deleteAnnouncements(id);
};
