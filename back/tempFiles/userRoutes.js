import express from "express";
import {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserPassword,
  deleteUser,
  getAllPermissions,
  authenticateToken,
  requirePermission
} from "../controllers/userController.js";

const router = express.Router();

// Public routes (no authentication required)
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes (authentication required)
// Temporarily disabled authentication for testing
router.get("/", getAllUsers);
router.get("/permissions", getAllPermissions);
router.get("/:id", getUserById);

// Admin routes (require admin permissions)
// Temporarily disabled authentication for testing
router.post("/", createUser);
router.put("/:id", updateUser);
router.put("/:id/password", updateUserPassword);
router.delete("/:id", deleteUser);

export default router; 