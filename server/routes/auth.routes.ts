import express from "express";
import {
  activateUser,
  login,
  registerUser,
} from "../controllers/auth.controller";
const router = express.Router();
router.post("/register", registerUser);
router.post("/login", login);
router.post("/activate-user", activateUser);
export default router;
