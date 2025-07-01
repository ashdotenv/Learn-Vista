import express from "express";
import {
  getUserInfo,
  socialAuth,
  updateUserInfo,
} from "../controllers/user.controller";
import { isAuthenticated } from "../middleware/auth";
const router = express.Router();

router.get("/me", isAuthenticated, getUserInfo);
router.post("/social-auth", socialAuth);
router.put("/update-user", isAuthenticated, updateUserInfo);
export default router;
