import { Router } from "express";
import * as honeyController from "../controllers/honeyController.js";
const router = Router();

router.get("/", honeyController.getAllHoneyProduction);

export default router;