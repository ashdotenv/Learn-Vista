import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncError";
import { ErrorHandler } from "../utils/ErrorHandler";
import fileUpload, { UploadedFile } from "express-fileupload";
import { cloudinary } from "../config/cloundinary.config";
import { createCourse } from "../services/course.service";
import { Course } from "../models/course.model";
import { redisClient } from "../utils/redis";
import mongoose, { Mongoose } from "mongoose";
import ejs from "ejs"
import path from "path";
import { sendEmail } from "../utils/sendEmail";
import { Notification } from "../models/notification,model";
import { getNotifications } from "./notifications.controller";
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
      await redisClient?.set(course?._id as string, JSON.stringify(course), "EX", 60477);
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
    await Notification.create({
      userId: req.user?._id,
      title: "New Question Received",
      message: `${req.user?.name} just asked a Question in ${courseContent?.title}`
    })

    await course?.save()
    res.status(200).json({
      success: true,
      course
    })
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500))
  }
})
interface IAnswerData {
  answer: string
  courseId: string
  contentId: string
  questionId: string
}

export const addAnswer = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { answer, courseId, contentId, questionId } = req.body as IAnswerData
    const course = await Course.findById(courseId)
    if (!mongoose.Types.ObjectId.isValid(contentId)) {
      return next(new ErrorHandler("Invalid Content Id", 400))
    }
    const courseContent = course?.courseData.find((item: any) => item._id.equals(contentId))
    if (!courseContent) {
      return next(new ErrorHandler("Invalid Content Id", 400))
    }
    const question = courseContent.questions.find((item: any) => item._id.equals(questionId))
    if (!question) {
      return next(new ErrorHandler("Invalid Question Id", 400))
    }
    const newAnswer: any = {
      user: req.user,
      answer
    }
    question.questionReplies.push(newAnswer)
    await course?.save()
    if (req.user?._id === question.user._id) {
      await Notification.create({
        userId: req.user?._id,
        title: "New Question Reply Revieved",
        message: `You have a new question reply in ${courseContent.title}`
      })
    } else {
      const data = {
        name: question.user.name,
        title: courseContent.title
      }
      const html = await ejs.renderFile(path.join(__dirname, "../mails/question-reply.ejs"), data)
      try {
        await sendEmail({
          email: question.user.email,
          subject: "Question Reply",
          template: "question-reply.ejs",
          data
        })
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))
      }
    }
    res.status(200).json({
      success: true, course
    })

  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500))
  }
})
interface IReviewData {
  review: string,
  courseId: string,
  rating: string,
  userId: string,
}
export const addReview = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const courseList = req.user?.courses
    const courseId = req.params.id
    const courseExist = courseList?.some((course: any) => course._id.toString() === courseId.toString)
    if (!courseExist) {
      return next(new ErrorHandler("You are not enrolled in this course", 401))
    }
    const { review, rating } = req.body as IReviewData
    const course = await Course.findById(courseId)
    const reviewData: any = {
      user: req.user,
      comment: review,
      rating
    }
    course?.reviews.push(reviewData)
    let avg = 0
    course?.reviews.forEach((rev: any) => avg += rev.rating)
    if (course) {
      course.ratings = avg / course.reviews.length
    }
    await course?.save()
    const notification: any = {
      title: "New Review Added"
      , message: `${req.user?.name} has given a review in ${course?.name}`
    }
    // TODO: Send Notification
    res.status(200).json({
      success: true,
      course
    })


  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500))
  }
})
interface ICommentInReviewData {
  comment: string
  courseId: string
  reviewId: string
}
export const addReplyToReview = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { comment, courseId, reviewId } = req.body as ICommentInReviewData

    const course = await Course.findById(courseId)
    if (!course) return next(new ErrorHandler("Course not found", 404))

    const review = course.reviews.find((rev: any) => rev._id.toString() === reviewId)
    if (!review) return next(new ErrorHandler("Review not found", 404))

    const replyData = {
      user: req.user,
      question: comment,
      questionReplies: []
    }

    review.commentReplies.push(replyData)
    review.markModified("commentReplies")
    await course.save()

    res.status(200).json({
      success: true,
      course
    })
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500))
  }
})
export const deleteCourse = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    if (!id) {
      return next(new ErrorHandler("Please provide course id", 400))
    }
    const course = await Course.findById(id)
    if (!course) {
      return next(new ErrorHandler("Course not found", 400))
    }
    await course?.deleteOne({ id })
    res.status(200).json({
      success: true,
      message: "Course deleted successfully"
    })
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500))
  }
})