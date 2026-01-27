import express from "express";
import {
  addUserRating,
  getUserData,
  getUserProgress,
  purchaseCourse,
  updateUserCourseProgress,
  userEnrolledCourses,
} from "../controllers/user.js";

const userRouter = express.Router();

userRouter.get("/data", getUserData);
userRouter.get("/enrolled-courses", userEnrolledCourses);
userRouter.post("/purchase", purchaseCourse);
userRouter.post("/update-course-progress", updateUserCourseProgress);
userRouter.get("/get-course-progress", getUserProgress);
userRouter.get("/add-rating", addUserRating);

export default userRouter;
