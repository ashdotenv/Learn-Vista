import { Router } from "express";
import { updateCourse, uploadCourse } from "../controllers/course.controller";
const router = Router();
router.post("/create-course", uploadCourse);
router.put("/update-course/:id", updateCourse);
export default router;
