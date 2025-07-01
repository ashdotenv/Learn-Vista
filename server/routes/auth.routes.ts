import express from "express";
import {
  activateUser,
  loginUser,
  logoutUser,
  registerUser,
  updateAccessToken,
} from "../controllers/auth.controller";
import { isAuthenticated } from "../middleware/auth";
const router = express.Router();
router.post("/login-user", loginUser);
router.post("/register-user", registerUser);
router.post("/activate-user", activateUser);
router.get("/logout-user", isAuthenticated, logoutUser);
router.get("/refresh", updateAccessToken);

export default router;
