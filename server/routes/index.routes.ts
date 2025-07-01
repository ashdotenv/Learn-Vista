import express from "express";
const router = express.Router();
import userRouter from "./user.routes";
import authRoutes from "./auth.routes";
router.use("/auth", authRoutes);
router.use("/user", userRouter);
export default router;
