import { Router } from "express";
import { BackupController } from "../controllers/backupController.js";
const router = Router();

router.post("/backup", BackupController.backupDatabase);
router.post("/delete-all", BackupController.deleteAllData);
router.post("/restore", BackupController.restoreBackup)

router.get("/backup", BackupController.getBackup);

export default router;