import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import {
  deleteAnnouncementWorkFlow,
} from "../../../../workflows/create-announcement";

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
    console.log("here");
    try {
      const { id } = req.params;
  
      if (!id) {
        return res.status(400).json({ error: "Announcement ID is required" });
      }
  
      await deleteAnnouncementWorkFlow(id, { container: req.scope });
  
      res.json({ success: true, message: "Announcement deleted successfully" });
    } catch (error) {
      console.error("Error deleting announcement:", error);
      res.status(500).json({ error: "Failed to delete announcement" });
    }
  };
  