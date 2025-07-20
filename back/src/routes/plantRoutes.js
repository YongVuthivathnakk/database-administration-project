import { Router } from "express";
import * as plantController from "../controllers/plantController.js";
const router = Router();

router.get("/", plantController.getAllPlants);

export default router;