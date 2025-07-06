import { Router } from "express";
import { getCoursesAnalytics, getOrdersAnalytics, getUserAnalytics } from "../controllers/analytics.controller";
const router = Router()
router.get("/users", getUserAnalytics)
router.get("/courses", getCoursesAnalytics)
router.get("/orders", getOrdersAnalytics)
export default router