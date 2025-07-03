import { Router } from "express";
import { addAnswer, updateCourse, uploadCourse } from "../controllers/course.controller";
const router = Router();
router.post("/create-course", uploadCourse);
router.put("/update-course/:id", updateCourse);
router.put("/add-answer", addAnswer);

export default router;
