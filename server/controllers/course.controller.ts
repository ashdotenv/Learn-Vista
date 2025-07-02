import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncError";
import { ErrorHandler } from "../utils/ErrorHandler";
import fileUpload, { UploadedFile } from "express-fileupload";
import { cloudinary } from "../config/cloundinary.config";
import { createCourse } from "../services/course.service";
import { Course } from "../models/course.model";
import { redisClient } from "../utils/redis";
import mongoose from "mongoose";

export const uploadCourse = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = req.files?.thumbnail as fileUpload.UploadedFile;
      if (thumbnail) {
        const myCloud = await cloudinary.uploader.upload(
          thumbnail.tempFilePath,
          {
            folder: "avatar",
          }
        );
        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.url,
        };
      }
      createCourse(data, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
export const updateCourse = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const { id } = req.params;
      if (!id) {
        return next(new ErrorHandler("Please provide course Id", 400));
      }

      const course = await Course.findById(id);
      if (!course) {
        return next(new ErrorHandler("Couldn't find Course", 400));
      }

      const thumbnail = req.files?.thumbnail as fileUpload.UploadedFile;
      if (thumbnail) {
        if (course.thumbnail) {
          await cloudinary.uploader.destroy(course.thumbnail.public_id);
        }
        const myCloud = await cloudinary.uploader.upload(
          thumbnail.tempFilePath,
          {
            folder: "courses",
          }
        );
        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      const updatedCourse = await Course.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });

      res.status(200).json({
        success: true,
        updatedCourse,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
export const getCourseById = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const cacheExist = await redisClient?.get(id);
      if (cacheExist) {
        const course = JSON.parse(cacheExist);
        return res.status(200).json({
          success: true,
          course,
        });
      }
      if (!id) {
        return next(new ErrorHandler("Please provide course Id", 400));
      }
      const course = await Course.findById(id).select(
        "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.Links"
      );
      await redisClient?.set(course?._id as string, JSON.stringify(course));
      if (!course) {
        return next(new ErrorHandler("Couldn't find Course", 400));
      }
      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
export const getAllCourses = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cacheExist = await redisClient?.get("allCourses");
      if (cacheExist) {
        const courses = JSON.parse(cacheExist);
        return res.status(200).json({
          success: true,
          courses,
        });
      }
      const courses = await Course.find().select(
        "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
      );
      await redisClient?.set("allCourses", JSON.stringify(courses));
      res.status(200).json({
        success: true,
        courses,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
export const getCourseContent = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const courseList = req.user?.courses
    const courseId = req.params.id
    const courseExist = courseList?.find((course: any) => course._id.toString() === courseId)
    if (!courseExist) {
      return next(new ErrorHandler("You are not enrolled into this course", 404))
    }
    const course = await Course.findById(courseId)
    const content = course?.courseData
    res.status(200).json({ success: true, content })
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500))
  }
})
interface IAddQuestionData {
  question: string
  courseId: string
  contentId: string
}
export const addQuestionInCourse = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { question, courseId, contentId } = req.body as IAddQuestionData
    const course = await Course.findById(courseId)
    if (!mongoose.Types.ObjectId.isValid(contentId)) {
      return next(new ErrorHandler("Invalid Content Id", 400))
    }
    const courseContent = course?.courseData.find((item: any) => item._id.equals(contentId))
    if (!courseContent) {
      return next(new ErrorHandler("Invalid Content Id", 400))
    }
    const newQuestion: any = {
      user: req.user,
      question,
      questionReplies: []
    }
    courseContent.questions.push(newQuestion)

    await course?.save()
    res.status(200).json({
      success: true,
      course
    })
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500))
  }
})