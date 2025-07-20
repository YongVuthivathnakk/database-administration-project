import { Router } from "express";
import * as beeSpeciesController from "../controllers/beeSpeciesController.js";
const router = Router();

router.get("/", beeSpeciesController.getAllBeeSpecies);

export default router;