import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncError";
import { User } from "../models/user.model";
import { ErrorHandler } from "../utils/ErrorHandler";
import { sendToken } from "../utils/jwt";
import { redisClient } from "../utils/redis";
import { getAllUsersService, getUserById } from "../services/user.service";
import { log } from "node:console";
import { cloudinary } from "../config/cloundinary.config";
import { json } from "node:stream/consumers";
import fileUpload from "express-fileupload";

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
interface IUpdatePassword {
  oldPassword: string;
  newPassword: string;
}
export const updatePassword = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { oldPassword, newPassword } = req.body as IUpdatePassword;
      if (!oldPassword || !newPassword) {
        return next(
          new ErrorHandler("Please Enter old and new passwords", 400)
        );
      }
      const user = await User.findById(req.user?.id as string).select(
        "+password"
      );
      if (user?.password == undefined) {
        return next(new ErrorHandler("Please login from your provider", 400));
      }

      const isPasswordMatch = await user?.comparePassword(oldPassword);
      if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid old password", 400));
      }

      user.password = newPassword;
      await user.save();
      await redisClient?.set(req.user?._id as string, JSON.stringify(user));
      res.status(201).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const updateProfilePicture = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id;
      const user = await User.findById(userId);

      const file = req.files?.avatar as fileUpload.UploadedFile;

      if (!file) {
        return next(new ErrorHandler("No file uploaded", 400));
      }

      if (user && user.avatar?.public_id) {
        await cloudinary.uploader.destroy(user.avatar.public_id);
      }

      const myCloud = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "avatars",
      });

      if (user) {
        user.avatar = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };

        await user.save();
      }

      res.status(200).json({
        success: true,
        message: "Avatar Updated Successfully",
        avatar: myCloud.url,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
export const getAllUsers = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cacheExist = await redisClient?.get("allUsers")
    if (!cacheExist) {
      return getAllUsersService(res)
    }
    res.status(200).json({
      success: true,
      users: JSON.parse(cacheExist)
    })
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500))
  }
})