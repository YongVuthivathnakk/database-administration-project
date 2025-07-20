import { Router } from "express";
import * as beekeeperController from "../controllers/beekeeperController.js";

const router = Router();

router.get("/", beekeeperController.getAllBeekeepers);
router.get("/:id", beekeeperController.getBeekeeperById);
router.post("/", beekeeperController.createBeekeeper);
router.put("/:id", beekeeperController.updateBeekeeper);
router.delete("/:id", beekeeperController.deleteBeekeeper);
router.get("/:id/hives", beekeeperController.getHivesByBeekeeper);

export default router;