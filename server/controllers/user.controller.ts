import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncError";
import { User } from "../models/user.model";
import { ErrorHandler } from "../utils/ErrorHandler";
import { sendToken } from "../utils/jwt";
import { redisClient } from "../utils/redis";
import { getUserById } from "../services/user.service";

export const getUserInfo = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id as string;
      getUserById(userId, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
interface ISocailAuthBody {
  name: string;
  email: string;
  avatar: string;
}

export const socialAuth = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, avatar } = req.body as ISocailAuthBody;
      if (!name || !email) {
        return next(new ErrorHandler("Please Enter all fields correctly", 400));
      }

      const user = await User.findOne({ email });

      if (!user) {
        const newUser = await User.create({ email, avatar, name });
        sendToken(newUser, 200, res);
      } else if (user?.email === email) {
        return next(new ErrorHandler("User Already Exist", 400));
      } else {
        sendToken(user, 200, res);
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

interface IUpdateUserInfo {
  name?: string;
  email?: string;
}

export const updateUserInfo = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, name } = req.body as IUpdateUserInfo;
      const userId = req.user?.id;
      if (!userId) {
        return next(new ErrorHandler("Unauthorized", 401));
      }

      const user = await User.findById(userId);
      if (!user) {
        console.log(req.user);
        return next(new ErrorHandler("User not found", 404));
      }

      if (email) {
        if (email === user.email) {
          return res
            .status(200)
            .json({ success: false, message: "Same email" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser && (existingUser._id as string) !== userId) {
          return next(new ErrorHandler("Email already exists", 400));
        }

        user.email = email;
      }

      if (name) {
        user.name = name;
      }

      await user.save();
      await redisClient?.set(userId, JSON.stringify(user));
      sendToken(user, 200, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
