import { Router } from "express";
import * as environmentController from "../controllers/environmentController.js";
const router = Router();

router.get("/", environmentController.getAllEnvironmentData);

export default router;