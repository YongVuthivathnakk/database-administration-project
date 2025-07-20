import { Router } from "express";
import * as hiveController from "../controllers/hiveController.js";
const router = Router();

router.get("/", hiveController.getAllHives);
router.get("/species/:speciesId", hiveController.getHivesBySpecies);

export default router;