import express from "express";
import {
  getUserInfo,
  updatePassword,
  updateProfilePicture,
  updateUserInfo,
} from "../controllers/user.controller";
import { addQuestionInCourse, getCourseContent } from "../controllers/course.controller";
const router = express.Router();

router.get("/me", getUserInfo);
router.put("/update-user", updateUserInfo);
router.put("/update-password", updatePassword);
router.put("/update-avatar", updateProfilePicture);
router.get("/course-content/:id", getCourseContent);
router.put("/add-question", addQuestionInCourse);
export default router;
