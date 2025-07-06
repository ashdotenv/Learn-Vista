import { Router } from "express";
import { addAnswer, addReplyToReview, getAllCourses, updateCourse, uploadCourse } from "../controllers/course.controller";
import { getNotifications, updateNotification } from "../controllers/notifications.controller";
import { getAllUsers } from "../controllers/user.controller";
import { getAllorders } from "../controllers/order.controller";
const router = Router();
router.post("/create-course", uploadCourse);
router.put("/update-course/:id", updateCourse);
router.put("/add-answer", addAnswer);
router.put("/reply-to-review", addReplyToReview);
router.put("/update-notification/:id", updateNotification);
router.get("/notifications", getNotifications);
router.get("/all-courses", getAllCourses);
router.get("/all-users", getAllUsers);
router.get("/all-orders", getAllorders)
export default router;
