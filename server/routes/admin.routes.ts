import { Router } from "express";
import { addAnswer, addReplyToReview, deleteCourse, getAllCourses, updateCourse, uploadCourse } from "../controllers/course.controller";
import { getNotifications, updateNotification } from "../controllers/notifications.controller";
import { deleteUser, getAllUsers, updateUserRole } from "../controllers/user.controller";
import { getAllorders } from "../controllers/order.controller";
const router = Router();
router.post("/create-course", uploadCourse);
router.put("/update-course/:id", updateCourse);
router.delete("/delete-user/:id", deleteUser)
router.delete("/delete-course/:id", deleteCourse)
router.put("/add-answer", addAnswer);
router.put("/reply-to-review", addReplyToReview);
router.put("/update-notification/:id", updateNotification);
router.put("/update-user-role", updateUserRole);
router.get("/notifications", getNotifications);
router.get("/all-courses", getAllCourses);
router.get("/all-users", getAllUsers);
router.get("/all-orders", getAllorders)
export default router;
